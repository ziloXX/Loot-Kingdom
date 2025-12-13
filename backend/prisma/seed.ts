// prisma/seed.ts
import { PrismaClient, Category } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database...');

    // Clean existing data
    await prisma.productVariant.deleteMany();
    await prisma.product.deleteMany();

    // Create products with variants
    await prisma.product.create({
        data: {
            title: 'Dragon Ball Z - Goku SSJ Grandista',
            slug: 'goku-ssj-grandista',
            description: 'La figura Grandista de Goku Super Saiyan captura toda la intensidad del guerrero Z. Con 28cm de altura y detalles de escultura premium.',
            brand: 'Banpresto',
            franchise: 'Dragon Ball Z',
            category: Category.FIGURE,
            images: ['https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?q=80&w=2071&auto=format&fit=crop'],
            variants: {
                create: [
                    {
                        tier: 'OFFICIAL',
                        price: 85000,
                        stock: 5,
                        condition: 'Nuevo - Sellado de Fábrica',
                        realPhotos: [],
                    },
                    {
                        tier: 'SECOND_HAND',
                        price: 68000,
                        stock: 1,
                        condition: 'Caja Abierta - Figura Perfecta',
                        realPhotos: ['https://images.unsplash.com/photo-1620336655554-7236d626359f?q=80&w=2000&auto=format&fit=crop'],
                    },
                    {
                        tier: 'BATTLE_DAMAGED',
                        price: 45000,
                        stock: 0,
                        condition: 'Sin caja - Pequeño detalle en botas',
                        realPhotos: [],
                    },
                ],
            },
        },
    });

    await prisma.product.create({
        data: {
            title: 'Blue Eyes White Dragon - SDK-001',
            slug: 'blue-eyes-white-dragon',
            description: 'La icónica carta de Yu-Gi-Oh! Blue-Eyes White Dragon en su edicion SDK-001. Un clásico para cualquier collector.',
            brand: 'Konami',
            franchise: 'Yu-Gi-Oh!',
            category: Category.TCG_CARD,
            images: ['https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=2070&auto=format&fit=crop'],
            variants: {
                create: [
                    {
                        tier: 'SECOND_HAND',
                        price: 120000,
                        stock: 1,
                        condition: 'Near Mint - 1st Edition',
                        realPhotos: [],
                    },
                ],
            },
        },
    });

    await prisma.product.create({
        data: {
            title: 'Pikachu Plush Vintage 1999',
            slug: 'pikachu-plush-vintage',
            description: 'Peluche original de Pikachu de 1999. Una pieza de colección para fans de Pokemon de la primera hora.',
            brand: 'Pokemon Center',
            franchise: 'Pokemon',
            category: Category.PLUSHIE,
            images: ['https://images.unsplash.com/photo-1542779283-308bc0facc55?q=80&w=2000&auto=format&fit=crop'],
            variants: {
                create: [
                    {
                        tier: 'BATTLE_DAMAGED',
                        price: 45000,
                        stock: 1,
                        condition: 'Vintage - Pequeño desgaste',
                        realPhotos: [],
                    },
                ],
            },
        },
    });

    await prisma.product.create({
        data: {
            title: 'Gengar Neon LED Light',
            slug: 'gengar-lamp',
            description: 'Lámpara LED de Gengar con diferentes modos de iluminación. Perfecta para decorar tu setup gamer.',
            brand: 'Pokemon Center',
            franchise: 'Pokemon',
            category: Category.DECOR,
            images: ['https://images.unsplash.com/photo-1563223605-e37fe544521f?q=80&w=1974&auto=format&fit=crop'],
            variants: {
                create: [
                    {
                        tier: 'OFFICIAL',
                        price: 32000,
                        stock: 10,
                        condition: 'Nuevo - Stock Local',
                        realPhotos: [],
                    },
                ],
            },
        },
    });

    console.log('✅ Seeding complete!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
