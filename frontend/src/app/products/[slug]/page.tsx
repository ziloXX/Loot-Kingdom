// Server Component - Fetch data, renderiza HTML estático para SEO
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import ProductClient from './ProductClient';

// 🔒 Type-safe params
type Params = Promise<{
    slug: string;
}>;

// Mock data structure (en producción esto vendría del backend)
const MOCK_PRODUCT = {
    id: "1",
    title: "Dragon Ball Z - Goku SSJ Grandista",
    description: "The Grandista figure of Super Saiyan Goku captures all the intensity of the Z warrior. Standing at 28cm with premium sculpt details, this piece is essential for any Saiyan shrine.",
    franchise: "Dragon Ball Z",
    brand: "Banpresto",
    variants: [
        {
            id: "v1",
            tier: "OFFICIAL" as const,
            price: 85000,
            stock: 5,
            condition: "New - Factory Sealed",
            images: ["https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?q=80&w=2071&auto=format&fit=crop"]
        },
        {
            id: "v2",
            tier: "SECOND_HAND" as const,
            price: 68000,
            stock: 1,
            condition: "Open Box - Figure Perfect",
            images: ["https://images.unsplash.com/photo-1620336655554-7236d626359f?q=80&w=2000&auto=format&fit=crop"]
        },
        {
            id: "v3",
            tier: "BATTLE_DAMAGED" as const,
            price: 45000,
            stock: 0,
            condition: "No box - Minor boot detail",
            images: ["https://images.unsplash.com/photo-1542779283-308bc0facc55?q=80&w=2000&auto=format&fit=crop"]
        }
    ]
};

// 🚀 En producción: Fetch desde backend con ISR
async function getProduct(slug: string) {
    // TODO: Implementar fetch real
    // const res = await fetch(`${process.env.BACKEND_URL}/products/${slug}`, {
    //   next: { revalidate: 60 } // ISR: Cache por 60s
    // });
    // if (!res.ok) return null;
    // return res.json();

    // Mock por ahora
    return MOCK_PRODUCT;
}

// 🎯 SEO: Metadata dinámica
export async function generateMetadata({ params }: { params: Params }) {
    const { slug } = await params;
    const product = await getProduct(slug);

    if (!product) {
        return {
            title: 'Product Not Found',
        };
    }

    return {
        title: `${product.title} | Loot Kingdom`,
        description: product.description,
        openGraph: {
            title: product.title,
            description: product.description,
            images: [product.variants[0].images[0]],
        },
    };
}

export default async function ProductPage({ params }: { params: Params }) {
    const { slug } = await params;
    const product = await getProduct(slug);

    if (!product) {
        notFound();
    }

    return (
        <div className="animate-in fade-in duration-500">
            {/* Breadcrumb - Renderizado en el servidor */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
                <Link href="/products" className="hover:text-primary flex items-center gap-1">
                    <ArrowLeft className="w-4 h-4" /> Back to Shop
                </Link>
                <span>/</span>
                <span className="text-foreground">{product.franchise}</span>
            </div>

            {/* Client Component para interactividad */}
            <ProductClient product={product} />
        </div>
    );
}
