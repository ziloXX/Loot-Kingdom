# 🔍 Loot Kingdom - Critical Code Review Report

**Fecha:** 2025-12-13  
**Repositorio:** [ziloXX/loot-kingdom](https://github.com/ziloXX/loot-kingdom)  
**Semana de Desarrollo:** 4  
**Stack:** NestJS + Prisma + PostgreSQL | Next.js 15 + TypeScript + Tailwind

---

## 📊 Executive Summary

Este reporte identifica **12 problemas críticos de seguridad**, **18 mejoras arquitecturales** y **5 buenas prácticas** detectadas en el código actual. La principal preocupación es la **exposición de secretos en hardcode**, **falta de validaciones en DTOs**, y **uso indiscriminado de `any` en TypeScript**.

---

## 🔴 CRÍTICO - Fix Inmediato

### 1. **🚨 JWT Secret Hardcodeado en Producción**

**Archivos afectados:**
- [auth.module.ts](file:///c:/Users/Nico/loot-kingdom/backend/src/auth/auth.module.ts#L14)
- [jwt.strategy.ts](file:///c:/Users/Nico/loot-kingdom/backend/src/auth/strategies/jwt.strategy.ts#L11)

**Problema:**
```typescript
// ❌ NUNCA EN PRODUCCIÓN
secret: process.env.JWT_SECRET || 'secretKey'
```

Si `JWT_SECRET` no está definido en el `.env`, usa un **fallback público** que permite a cualquiera firmar JWTs válidos.

**Impacto:** Cualquier atacante puede generar tokens válidos y autenticarse como cualquier usuario, incluyendo ADMIN.

**Fix inmediato:**
```typescript
secret: process.env.JWT_SECRET, // Sin fallback
// Agregar validación al inicio de la app
if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is required in production');
}
```

---

### 2. **🔓 CORS habilitado sin restricciones**

**Archivo:** [main.ts](file:///c:/Users/Nico/loot-kingdom/backend/src/main/ts#L10)

**Problema:**
```typescript
app.enableCors(); // ❌ Permite requests desde CUALQUIER origen
```

**Impacto:** Permite ataques CSRF y acceso desde dominios maliciosos.

**Fix:**
```typescript
app.enableCors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
});
```

---

### 3. **🛡️ DTOs sin validaciones: CreateProductDto**

**Archivo:** [create-product.dto.ts](file:///c:/Users/Nico/loot-kingdom/backend/src/products/dto/create-product.dto.ts)

**Problema:** El DTO más importante del sistema **NO TIENE NINGÚN DECORADOR de validación**. Solo tiene `@ApiProperty` (documentación).

**Campos sin validar:**
- `title` - Puede ser vacío o tener scripts XSS
- `price` - Puede ser negativo o 0
- `stock` - Puede ser negativo
- `images` - Puede estar vacío o tener URLs maliciosas
- `category` - No valida que sea un valor del enum

**Ejemplo de exploit:**
```bash
POST /products
{
  "title": "<script>alert('XSS')</script>",
  "price": -99999,
  "stock": -100
}
# ✅ Se crea el producto sin errores
```

**Fix completo:**
```typescript
import { ApiProperty } from '@nestjs/swagger';
import { 
  IsString, IsNotEmpty, IsEnum, IsArray, 
  IsNumber, Min, ValidateNested, ArrayMinSize, IsUrl 
} from 'class-validator';
import { Type } from 'class-transformer';
import { Category, ProductTier } from '@prisma/client';

export class CreateProductDto {
  @ApiProperty({ example: 'Goku Super Saiyan - Grandista' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'goku-ssj-grandista' })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiProperty({ example: 'Figura de 28cm marca Banpresto...' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 'Banpresto' })
  @IsString()
  @IsNotEmpty()
  brand: string;

  @ApiProperty({ example: 'Dragon Ball Z' })
  @IsString()
  @IsNotEmpty()
  franchise: string;

  @ApiProperty({ enum: Category, example: 'FIGURE' })
  @IsEnum(Category)
  category: Category;

  @ApiProperty({ example: ['https://i.imgur.com/goku-demo.jpg'] })
  @IsArray()
  @ArrayMinSize(1)
  @IsUrl({}, { each: true })
  images: string[];

  @ApiProperty({
    example: {
      create: [
        {
          tier: 'OFFICIAL',
          price: 85000,
          stock: 5,
          condition: 'New / Sealed',
          realPhotos: []
        }
      ]
    }
  })
  @ValidateNested({ each: true })
  @Type(() => CreateVariantDto)
  variants: { create: CreateVariantDto[] };
}

// DTO Anidado para variantes
class CreateVariantDto {
  @IsEnum(ProductTier)
  tier: ProductTier;

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  @Min(0)
  stock: number;

  @IsString()
  @IsNotEmpty()
  condition?: string;

  @IsArray()
  @IsUrl({}, { each: true })
  realPhotos?: string[];
}
```

---

### 4. **🔥 Uso de `any` en ProductsService.create()**

**Archivo:** [products.service.ts](file:///c:/Users/Nico/loot-kingdom/backend/src/products/products.service.ts#L9)

**Problema:**
```typescript
async create(createProductDto: any) {  // ❌ Type safety eliminada
```

**Impacto:** 
- TypeScript **NO PUEDE VALIDAR** los datos antes de que lleguen a Prisma
- Permite pasar objetos malformados que romperán en runtime
- Pierde autocompletado en el IDE

**Fix:**
```typescript
async create(createProductDto: CreateProductDto) {
  return await this.prisma.product.create({
    data: {
      ...createProductDto,
      variants: createProductDto.variants,
    },
    include: { variants: true },
  });
}
```

---

### 5. **💥 Falta manejo de errores en Auth**

**Archivo:** [auth.service.ts](file:///c:/Users/Nico/loot-kingdom/backend/src/auth/auth.service.ts#L18)

**Problema:** No valida emails duplicados antes de registrar.

```typescript
async register(registerDto: RegisterDto) {
  const hashedPassword = await bcrypt.hash(registerDto.password, 10);
  
  // ❌ Si el email ya existe, Prisma lanza un error críptico
  return this.prisma.user.create({
    data: { ... }
  });
}
```

**Efecto en frontend:** El usuario ve un error genérico `500 Internal Server Error` en lugar de "Email already registered".

**Fix:**
```typescript
import { ConflictException } from '@nestjs/common';

async register(registerDto: RegisterDto) {
  const existingUser = await this.prisma.user.findUnique({
    where: { email: registerDto.email }
  });

  if (existingUser) {
    throw new ConflictException('Email already registered');
  }

  const hashedPassword = await bcrypt.hash(registerDto.password, 10);
  
  const user = await this.prisma.user.create({
    data: {
      email: registerDto.email,
      password: hashedPassword,
      username: registerDto.username,
    },
  });

  // ❌ CRÍTICO: Nunca retornes el password (ni hasheado)
  const { password, ...result } = user;
  return result;
}
```

---

### 6. **🔐 Expones el password hasheado en el registro**

**Archivo:** [auth.service.ts](file:///c:/Users/Nico/loot-kingdom/backend/src/auth/auth.service.ts#L18-L24)

**Problema:** El endpoint `/auth/register` devuelve TODO el objeto `User`, incluyendo el hash de la contraseña.

**Response actual:**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "username": "player1",
  "password": "$2b$10$abcdef...",  // ❌ NUNCA exponer esto
  "role": "USER"
}
```

**Impacto:** Si un atacante obtiene estos hashes, puede intentar crackearlos offline con rainbow tables.

**Fix:** Ya incluido arriba - usar `const { password, ...result } = user;`

---

### 7. **⚠️ Credenciales de DB en docker-compose.yml en texto plano**

**Archivo:** [docker-compose.yml](file:///c:/Users/Nico/loot-kingdom/backend/docker-compose.yml#L7-L9)

**Problema:**
```yaml
environment:
  POSTGRES_USER: admin
  POSTGRES_PASSWORD: lootpassword123  # ❌ Hardcoded
```

**Impacto:** Si este archivo se commitea (ya está en .git), las credenciales son públicas.

**Fix:**
```yaml
environment:
  POSTGRES_USER: ${DB_USER:-admin}
  POSTGRES_PASSWORD: ${DB_PASSWORD}
  POSTGRES_DB: ${DB_NAME:-lootkingdom}
```

Y en `.env` (gitignoreado):
```
DB_USER=admin
DB_PASSWORD=tu_password_seguro_aqui
DB_NAME=lootkingdom
```

---

### 8. **🛒 NO existe lógica de Carrito ni Checkout**

**Status:** Los modelos `CartItem` y `Order` existen en Prisma, pero **NO HAY NINGÚN MÓDULO** implementado en NestJS.

**Archivos faltantes:**
- `src/cart/cart.module.ts` ❌
- `src/cart/cart.service.ts` ❌
- `src/orders/orders.module.ts` ❌
- `src/orders/orders.service.ts` ❌

**Problemas actuales:**
1. **Race Condition en Stock:** Si dos usuarios compran el mismo producto al mismo tiempo, ambos pueden "reservar" el último stock porque no hay validación atómica.
   
   **Escenario:**
   ```
   Stock inicial: 1 unidad
   User A: Agrega al carrito (stock: 1)
   User B: Agrega al carrito (stock: 1) 
   User A: Confirma compra (stock: 0)
   User B: Confirma compra (stock: -1) ❌ OVERSELLING
   ```

2. **Precio puede cambiar durante checkout:** Un producto puede tener su precio actualizado entre el momento que el usuario lo agrega al carrito y cuando paga.

**Fix necesario (Implementación completa en siguiente sección):**

```typescript
// cart.service.ts - Atomic Stock Reservation
async addToCart(userId: string, variantId: string, quantity: number) {
  const variant = await this.prisma.productVariant.findUnique({
    where: { id: variantId }
  });

  if (!variant || variant.stock < quantity) {
    throw new BadRequestException('Insufficient stock');
  }

  // Usar transaction para evitar race conditions
  return await this.prisma.$transaction(async (tx) => {
    // Verificar stock nuevamente dentro de la transaction
    const currentVariant = await tx.productVariant.findUnique({
      where: { id: variantId }
    });

    if (currentVariant.stock < quantity) {
      throw new BadRequestException('Stock changed during operation');
    }

    return tx.cartItem.upsert({
      where: {
        userId_variantId: { userId, variantId }
      },
      update: {
        quantity: { increment: quantity }
      },
      create: {
        userId,
        variantId,
        quantity
      }
    });
  });
}

// orders.service.ts - Freeze Price on Checkout
async createOrder(userId: string) {
  const cartItems = await this.prisma.cartItem.findMany({
    where: { userId },
    include: { 
      variant: { 
        include: { product: true } 
      } 
    }
  });

  if (cartItems.length === 0) {
    throw new BadRequestException('Cart is empty');
  }

  return await this.prisma.$transaction(async (tx) => {
    // 1. Verificar stock disponible para TODOS los items
    for (const item of cartItems) {
      const variant = await tx.productVariant.findUnique({
        where: { id: item.variantId }
      });

      if (variant.stock < item.quantity) {
        throw new BadRequestException(
          `Insufficient stock for ${item.variant.product.title}`
        );
      }
    }

    // 2. Crear la orden con precios SNAPSHOT
    const total = cartItems.reduce(
      (sum, item) => sum + Number(item.variant.price) * item.quantity, 
      0
    );

    const order = await tx.order.create({
      data: {
        userId,
        total,
        status: 'PENDING',
        items: {
          create: cartItems.map(item => ({
            variantId: item.variantId,
            quantity: item.quantity,
            price: item.variant.price,  // Freeze price
            productTitle: item.variant.product.title,
            condition: item.variant.condition
          }))
        }
      },
      include: { items: true }
    });

    // 3. Decrementar stock de forma atómica
    for (const item of cartItems) {
      await tx.productVariant.update({
        where: { id: item.variantId },
        data: {
          stock: { decrement: item.quantity }
        }
      });
    }

    // 4. Limpiar el carrito
    await tx.cartItem.deleteMany({
      where: { userId }
    });

    return order;
  });
}
```

---

### 9. **📱 Frontend: ProductPage es Client Component sin razón**

**Archivo:** [products/[slug]/page.tsx](file:///c:/Users/Nico/loot-kingdom/frontend/src/app/products/[slug]/page.tsx#L1)

**Problema:**
```tsx
"use client";  // ❌ Pierde beneficios de SSR

import { use, useState } from 'react';
```

**Por qué es crítico:**
- **SEO:** Los crawlers de Google no ven el contenido del producto
- **Performance:** El HTML se renderiza vacío, luego se hidrata con JS (Layout Shift)
- **Core Web Vitals:** Aumenta el LCP (Largest Contentful Paint)

**Fix:** Convertir a Server Component + usar `fetch()` con ISR:

```tsx
// app/products/[slug]/page.tsx (Server Component)
import { notFound } from 'next/navigation';
import ProductClient from './ProductClient';

interface Product {
  id: string;
  title: string;
  description: string;
  variants: Array<{
    tier: string;
    price: number;
    stock: number;
  }>;
}

async function getProduct(slug: string): Promise<Product | null> {
  const res = await fetch(`http://localhost:3000/products/${slug}`, {
    next: { revalidate: 60 } // ISR: Cache por 60s
  });

  if (!res.ok) return null;
  return res.json();
}

export default async function ProductPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  // Server Component renderiza el HTML estático
  return <ProductClient product={product} />;
}

// generateMetadata para SEO dinámico
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProduct(slug);

  return {
    title: product?.title || 'Product Not Found',
    description: product?.description,
  };
}
```

```tsx
// ProductClient.tsx (Client Component solo para interactividad)
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function ProductClient({ product }: { product: Product }) {
  const [selectedTier, setSelectedTier] = useState(product.variants[0].tier);
  // ... resto de la lógica interactiva
}
```

---

### 10. **🖼️ No estás usando `next/image` correctamente**

**Archivo:** [page.tsx](file:///c:/Users/Nico/loot-kingdom/frontend/src/app/page.tsx#L60-L64)

**Problema:**
```tsx
<img  // ❌ HTML nativo, sin optimización
  src="https://m.media-amazon.com/images/I/71UWLV3dY-L._AC_SL1500_.jpg"
  alt="Anime Plushies"
/>
```

**Impacto:**
- Carga imágenes a **tamaño completo** (1500px) incluso en móviles
- Sin lazy loading automático
- Sin WebP optimization
- Sin responsive srcset

**Fix:**
```tsx
import Image from 'next/image';

<Image
  src="https://m.media-amazon.com/images/I/71UWLV3dY-L._AC_SL1500_.jpg"
  alt="Anime Plushies"
  fill
  className="object-cover transition-transform duration-700 group-hover:scale-110"
  sizes="(max-width: 768px) 100vw, 50vw"
  priority={false}  // Lazy load para hero images secundarias
/>
```

Y en `next.config.ts`:
```typescript
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'm.media-amazon.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};
```

---

### 11. **🎯 Navbar: `isLogged` es hardcoded**

**Archivo:** [Navbar.tsx](file:///c:/Users/Nico/loot-kingdom/frontend/src/components/layout/Navbar.tsx#L12)

```tsx
const isLogged = true;  // ❌ Siempre true
```

**Impacto:** Todos los usuarios ven el estado "logged in" incluso si no lo están.

**Fix:** Necesitas un sistema de estado global (Zustand/Context):

```tsx
// lib/auth-store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  user: { id: string; username: string; lootCoins: number } | null;
  token: string | null;
  login: (token: string, user: any) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      login: (token, user) => set({ token, user }),
      logout: () => set({ token: null, user: null }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
```

```tsx
// Navbar.tsx
'use client';

import { useAuthStore } from '@/lib/auth-store';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const isLogged = !!user;

  // ... resto del componente
}
```

---

### 12. **🔄 No hay validación de variables de entorno en runtime**

**Problema:** Si `JWT_SECRET` no está en el `.env`, el servidor arranca IGUAL con el fallback inseguro.

**Fix:** Agregar validación en [main.ts](file:///c:/Users/Nico/loot-kingdom/backend/src/main.ts):

```typescript
// main.ts (inicio del archivo)
async function bootstrap() {
  // Validar variables críticas
  const requiredEnvVars = ['JWT_SECRET', 'DATABASE_URL'];
  const missingVars = requiredEnvVars.filter(v => !process.env[v]);

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}`
    );
  }

  const app = await NestFactory.create(AppModule);
  // ... resto del bootstrap
}
```

---

## 🟡 MEJORAS - Refactorización Recomendada

### 1. **🗂️ Estructura de carpetas del Backend**

**Problema actual:**
```
src/
  ├── auth/
  ├── products/
  ├── prisma/
  └── app.module.ts
```

**Faltantes:**
- ❌ Módulo de Cart
- ❌ Módulo de Orders
- ❌ Módulo de Users (profile, XP, coins)
- ❌ Módulo de Reviews
- ❌ Guards para rutas protegidas (Admin-only)

**Mejora sugerida:**
```
src/
  ├── auth/
  │   ├── guards/
  │   │   ├── jwt-auth.guard.ts
  │   │   └── roles.guard.ts
  │   └── decorators/
  │       └── public.decorator.ts
  ├── users/
  │   ├── users.service.ts
  │   ├── users.controller.ts
  │   └── dto/
  ├── cart/
  │   ├── cart.service.ts
  │   ├── cart.controller.ts
  │   └── dto/
  ├── orders/
  │   ├── orders.service.ts
  │   ├── orders.controller.ts
  │   └── dto/
  ├── products/
  ├── reviews/
  └── common/
      ├── filters/
      │   └── http-exception.filter.ts
      └── interceptors/
          └── transform.interceptor.ts
```

---

### 2. **🛡️ Implementar Guards para rutas protegidas**

**Problema:** Cualquier usuario puede crear productos (POST /products).

**Solución:**

```typescript
// auth/guards/jwt-auth.guard.ts
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
```

```typescript
// auth/guards/roles.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!requiredRoles) return true;

    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.includes(user.role);
  }
}
```

```typescript
// products.controller.ts
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('products')
export class ProductsController {
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')  // Solo admins pueden crear productos
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()  // Público
  findAll() {
    return this.productsService.findAll();
  }
}
```

---

### 3. **🎨 Separar Server y Client Components en el Frontend**

**Problema actual:** Todos los componentes UI son Server Components por defecto, pero algunos tienen lógica que requiere `"use client"`.

**Mejora:**
```
components/
  ├── server/          # Server Components (data fetching)
  │   ├── ProductGrid.tsx
  │   └── CategoryHero.tsx
  ├── client/          # Client Components (interactividad)
  │   ├── AddToCartButton.tsx
  │   ├── ProductGallery.tsx
  │   └── SearchBar.tsx
  └── ui/              # Primitives (puede ser mixto)
```

**Regla:** Si usa `useState`, `useEffect`, `onClick`, etc. → Client Component.

---

### 4. **🔗 Compartir tipos entre Backend y Frontend**

**Problema:** Los tipos de `ProductTier`, `Category`, etc. están duplicados manualmente.

**Solución (Pattern: Monorepo con shared types):**

Opción A: Generar tipos desde Prisma para el frontend:
```bash
# Backend genera los tipos
npx prisma generate

# Frontend importa desde Prisma
npm install @prisma/client --save-dev
```

```tsx
// frontend/src/types/product.ts
import type { Category, ProductTier } from '@prisma/client';

export interface ProductCardProps {
  id: string;
  title: string;
  tier: ProductTier;  // ✅ Compartido desde Prisma
  category: Category;
}
```

Opción B (mejor para monorepo): Crear un paquete `@loot-kingdom/types`:
```
packages/
  └── shared-types/
      ├── package.json
      └── src/
          ├── product.types.ts
          └── user.types.ts
```

---

### 5. **📦 Agregar paginación en GET /products**

**Problema:** `findAll()` trae TODOS los productos sin límite.

**Mejora:**
```typescript
// products.service.ts
async findAll(page: number = 1, limit: number = 20) {
  const skip = (page - 1) * limit;

  const [products, total] = await Promise.all([
    this.prisma.product.findMany({
      skip,
      take: limit,
      include: {
        variants: {
          select: {
            id: true,
            tier: true,
            price: true,
            stock: true,
          }
        }
      }
    }),
    this.prisma.product.count()
  ]);

  return {
    data: products,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
}
```

---

### 6. **🧪 Agregar tests unitarios**

**Status:** El proyecto tiene configuración de Jest pero **0 tests ejecutándose**.

**Mejora:**
```typescript
// products.service.spec.ts
describe('ProductsService', () => {
  let service: ProductsService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: PrismaService,
          useValue: {
            product: {
              findMany: jest.fn(),
              create: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should create a product with variants', async () => {
    const dto: CreateProductDto = {
      title: 'Test Product',
      // ... resto de los campos
    };

    await service.create(dto);
    expect(prisma.product.create).toHaveBeenCalledWith({
      data: expect.objectContaining({ title: 'Test Product' }),
    });
  });
});
```

---

### 7. **🌐 Implementar i18n para multi-idioma**

Actualmente el sitio está mezclado español/inglés:
- Código: Inglés ✅
- UI: Mezcla (ej: "fresh loot", "Pre-Owned", "Plushies" pero "Accesorios")

**Mejora:** Usar `next-intl`:
```tsx
// messages/es.json
{
  "home": {
    "hero": {
      "figures": "FIGURAS",
      "shopCollection": "Ver Colección"
    }
  }
}
```

---

### 8. **🔍 Agregar endpoint de búsqueda**

**Faltante:** No existe `/products/search?q=goku`.

**Mejora:**
```typescript
// products.controller.ts
@Get('search')
async search(@Query('q') query: string) {
  return this.productsService.search(query);
}

// products.service.ts
async search(query: string) {
  return this.prisma.product.findMany({
    where: {
      OR: [
        { title: { contains: query, mode: 'insensitive' } },
        { brand: { contains: query, mode: 'insensitive' } },
        { franchise: { contains: query, mode: 'insensitive' } },
      ],
    },
    include: { variants: true },
  });
}
```

---

### 9. **💾 Implementar Redis para caché de productos**

**Problema:** Cada request a `/products` ejecuta una query a Postgres.

**Mejora (opcional pero muy importante para performance):**
```typescript
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class ProductsService {
  constructor(
    private prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

  async findAll() {
    const cached = await this.cacheManager.get('products:all');
    if (cached) return cached;

    const products = await this.prisma.product.findMany({ ... });
    await this.cacheManager.set('products:all', products, 300); // 5 min TTL
    return products;
  }
}
```

---

### 10. **📝 Agregar Swagger decorators completos**

**Mejora:**
```typescript
// products.controller.ts
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  @Post()
  @ApiOperation({ summary: 'Create a new product (Admin only)' })
  @ApiResponse({ status: 201, description: 'Product created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(@Body() dto: CreateProductDto) {
    return this.productsService.create(dto);
  }
}
```

---

### 11. **🎮 Implementar lógica de gamificación (XP \u0026 Coins)**

**Status:** El schema tiene `xpPoints`, `level`, `lootCoins` pero NO HAY LÓGICA implementada.

**Mejora:**
```typescript
// users/users.service.ts
async awardRewards(userId: string, orderTotal: number) {
  const xpGained = Math.floor(orderTotal / 100);  // 1 XP por cada $100
  const coinsGained = Math.floor(orderTotal / 1000);

  const user = await this.prisma.user.update({
    where: { id: userId },
    data: {
      xpPoints: { increment: xpGained },
      lootCoins: { increment: coinsGained },
      coinHistory: {
        create: {
          amount: coinsGained,
          reason: `Compra completada - Orden #${orderId}`
        }
      }
    }
  });

  // Level up logic
  const newLevel = this.calculateLevel(user.xpPoints);
  if (newLevel > user.level) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { level: newLevel }
    });
  }

  return { xpGained, coinsGained, newLevel };
}

private calculateLevel(xp: number): number {
  // Ejemplo: Level = sqrt(XP / 100)
  return Math.floor(Math.sqrt(xp / 100)) + 1;
}
```

---

### 12. **🛠️ Agregar Health Check endpoint**

**Mejora:**
```typescript
// app.controller.ts
import { Controller, Get } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Controller()
export class AppController {
  constructor(private prisma: PrismaService) {}

  @Get('health')
  async health() {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return { status: 'ok', database: 'connected' };
    } catch {
      return { status: 'error', database: 'disconnected' };
    }
  }
}
```

---

### 13. **📊 Logging y Monitoreo**

**Problema:** No hay logs estructurados.

**Mejora:**
```typescript
// common/interceptors/logging.interceptor.ts
import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url } = request;
    const now = Date.now();

    return next.handle().pipe(
      tap(() => {
        const responseTime = Date.now() - now;
        this.logger.log(`${method} ${url} - ${responseTime}ms`);
      }),
    );
  }
}
```

---

### 14. **🔐 Implementar Rate Limiting**

**Problema:** No hay protección contra brute force en login.

**Mejora:**
```bash
npm install @nestjs/throttler
```

```typescript
// app.module.ts
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: 60,      // 60 segundos
      limit: 10,    // 10 requests max
    }),
    // ... otros módulos
  ],
})
```

```typescript
// auth.controller.ts
import { Throttle } from '@nestjs/throttler';

@Controller('auth')
export class AuthController {
  @Post('login')
  @Throttle({ short: { ttl: 60000, limit: 5 } })  // 5 intentos por minuto
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
```

---

### 15. **🗃️ Agregar índices en Prisma para optimization**

**Problema:** Queries lentas en búsquedas por `slug`, `category`, etc.

**Mejora:**
```prisma
model Product {
  id          String   @id @default(uuid())
  slug        String   @unique
  franchise   String
  category    Category

  @@index([category])           // Búsqueda por categoría
  @@index([franchise])          // Búsqueda por franquicia
  @@index([category, franchise]) // Búsqueda combinada
}

model ProductVariant {
  productId   String
  tier        ProductTier
  stock       Int

  @@index([tier])
  @@index([productId, tier])  // Filtrar variantes de un producto
}
```

---

### 16. **🔄 Implementar Soft Delete**

**Problema:** Borrar productos directamente rompe órdenes históricas.

**Mejora:**
```prisma
model Product {
  id          String    @id @default(uuid())
  deletedAt   DateTime?
  
  @@index([deletedAt])
}
```

```typescript
// products.service.ts
async findAll() {
  return this.prisma.product.findMany({
    where: { deletedAt: null }  // Solo activos
  });
}

async softDelete(id: string) {
  return this.prisma.product.update({
    where: { id },
    data: { deletedAt: new Date() }
  });
}
```

---

### 17. **📸 Validar y sanitizar URLs de imágenes**

**Problema:** Cualquier URL puede ser insertada (XSS, hot-linking).

**Mejora:**
```typescript
// products/dto/create-product.dto.ts
import { IsUrl, Matches } from 'class-validator';

@ApiProperty()
@IsArray()
@IsUrl({}, { each: true })
@Matches(/^https:\/\/(m\.media-amazon\.com|images\.unsplash\.com|i\.imgur\.com)/, {
  each: true,
  message: 'Only allowed image domains: Amazon, Unsplash, Imgur'
})
images: string[];
```

---

### 18. **🌍 Configurar variables de entorno por ambiente**

**Mejora:**
```
backend/
  ├── .env.development
  ├── .env.production
  └── .env.test
```

```typescript
// app.module.ts
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
      isGlobal: true,
    }),
  ],
})
```

---

## 🟢 APROBADO - Buenas Prácticas

### 1. ✅ **Uso de Prisma ORM**
Excelente elección. El schema está bien estructurado con relaciones claras (`User → Order → OrderItem`). La separación de `Product` y `ProductVariant` es el approach correcto para manejar múltiples tiers.

---

### 2. ✅ **ValidationPipe global activado**
```typescript
app.useGlobalPipes(new ValidationPipe({
  whitelist: true,           // Elimina propiedades no definidas en el DTO
  forbidNonWhitelisted: true // Rechaza requests con campos extra
}));
```
Esto previene **Mass Assignment** vulnerabilities. **Mantener**.

---

### 3. ✅ **Estructura de DTOs separadas**
Tienes `LoginDto`, `RegisterDto`, `CreateProductDto` separados. Esto facilita mantenimiento y validación específica por endpoint.

---

### 4. ✅ **Uso de bcrypt para hashing de passwords**
```typescript
const hashedPassword = await bcrypt.hash(registerDto.password, 10);
```
Salt rounds de 10 es un buen balance entre seguridad y performance. **Mantener**.

---

### 5. ✅ **App Router de Next.js 15**
Estás usando la versión más moderna de Next.js con App Router. Buena decisión para aprovechar Server Components y streaming.

**Mejora adicional:** Aprovechar más los Server Components (ver sección crítica #9).

---

## 📝 Checklist de Acción Inmediata

### 🔴 Alta Prioridad (Esta semana)
- [ ] Eliminar fallback de `JWT_SECRET` y agregar validación
- [ ] Configurar CORS con whitelist
- [ ] Agregar validaciones completas en `CreateProductDto`
- [ ] Cambiar `any` a `CreateProductDto` en `create()`
- [ ] Implementar validación de email duplicado en registro
- [ ] No retornar password en response de registro
- [ ] Mover credenciales de DB a `.env`
- [ ] Implementar módulo de Cart con transactions atómicas
- [ ] Implementar módulo de Orders con price freezing
- [ ] Convertir ProductPage a Server Component

### 🟡 Media Prioridad (Próximas 2 semanas)
- [ ] Implementar Guards (JWT + Roles)
- [ ] Agregar paginación en GET /products
- [ ] Usar `next/image` en lugar de `<img>`
- [ ] Crear sistema de autenticación global (Zustand)
- [ ] Compartir tipos entre Backend y Frontend
- [ ] Agregar endpoint de búsqueda
- [ ] Implementar gamificación (XP \u0026 Coins)
- [ ] Agregar tests unitarios

### 🟢 Baja Prioridad (Backlog)
- [ ] Implementar Redis para caché
- [ ] Configurar i18n
- [ ] Soft deletes
- [ ] Rate limiting
- [ ] Índices de Prisma
- [ ] Health check endpoint
- [ ] Logging interceptor

---

## 🎯 Conclusión

El proyecto tiene una **base sólida** en términos de stack tecnológico y estructura inicial, pero presenta **vulnerabilidades críticas de seguridad** que deben corregirse antes de cualquier deployment. 

**Puntos más preocupantes:**
1. JWT secret hardcoded
2. DTOs sin validación
3. CORS abierto
4. Lógica de carrito/checkout faltante
5. Server Components no aprovechados

**Recomendación:** Dedicar la **Semana 5** exclusivamente a cerrar los issues 🔴 CRÍTICOS antes de agregar nuevas features.

---

**Generado por:** Principal Software Architect Review  
**Fecha:** 2025-12-13  
**Versión:** 1.0
