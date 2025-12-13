import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export interface ProductCardProps {
    id: string;
    slug: string;
    title: string;
    price: number;
    image: string;
    badges?: string[];
    tier?: 'OFFICIAL' | 'SECOND_HAND' | 'BATTLE_DAMAGED';
}

export function ProductCard({ slug, title, price, image, badges, tier = 'OFFICIAL' }: ProductCardProps) {
    return (
        <Card className="overflow-hidden group hover:shadow-lg transition-shadow border-muted">
            <div className="relative aspect-[4/5] overflow-hidden bg-muted">
                <img
                    src={image}
                    alt={title}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                />
                {badges && badges.length > 0 && (
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                        {badges.map((badge, i) => (
                            <Badge key={i} variant={badge === 'Nuevo' ? 'default' : 'secondary'} className="bg-background/90 text-foreground backdrop-blur">
                                {badge}
                            </Badge>
                        ))}
                    </div>
                )}
                {tier === 'SECOND_HAND' && (
                    <div className="absolute top-2 right-2">
                        <Badge variant="outline" className="bg-background/80 border-primary text-primary backdrop-blur">
                            Mercado Negro
                        </Badge>
                    </div>
                )}
            </div>
            <CardHeader className="p-4 pb-2">
                <h3 className="font-semibold tracking-tight text-lg line-clamp-1 group-hover:text-primary transition-colors">
                    <Link href={`/products/${slug}`}>
                        {title}
                    </Link>
                </h3>
            </CardHeader>
            <CardContent className="p-4 pt-0">
                <div className="text-xl font-bold">
                    ${price.toLocaleString('es-AR')}
                </div>
            </CardContent>
            <CardFooter className="p-4 pt-0">
                <Button asChild className="w-full">
                    <Link href={`/products/${slug}`}>Ver Tesoro</Link>
                </Button>
            </CardFooter>
        </Card>
    );
}
