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
        <Card className="overflow-hidden group hover:shadow-xl transition-all duration-300 border-border hover:border-primary/30 hover-lift">
            <div className="relative aspect-[4/5] overflow-hidden bg-muted">
                <img
                    src={image}
                    alt={title}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                />
                {/* Tier Badge - Top Right */}
                {tier === 'SECOND_HAND' && (
                    <div className="absolute top-3 right-3">
                        <Badge className="bg-secondary text-secondary-foreground font-bold shadow-lg">
                            Pre-Owned
                        </Badge>
                    </div>
                )}
                {tier === 'BATTLE_DAMAGED' && (
                    <div className="absolute top-3 right-3">
                        <Badge variant="destructive" className="font-bold shadow-lg">
                            Clearance
                        </Badge>
                    </div>
                )}

                {/* Category Badges - Top Left */}
                {badges && badges.length > 0 && (
                    <div className="absolute top-3 left-3 flex flex-col gap-1">
                        {badges.slice(0, 2).map((badge, i) => (
                            <Badge
                                key={i}
                                variant="outline"
                                className="bg-background/90 backdrop-blur-sm text-foreground text-xs"
                            >
                                {badge}
                            </Badge>
                        ))}
                    </div>
                )}

                {/* Quick Buy Overlay */}
                <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/60 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <Button size="sm" className="w-full bg-primary hover:bg-primary/90" asChild>
                        <Link href={`/products/${slug}`}>Quick View</Link>
                    </Button>
                </div>
            </div>

            <CardHeader className="p-4 pb-2">
                <Link href={`/products/${slug}`} className="block">
                    <h3 className="font-semibold tracking-tight text-base line-clamp-2 group-hover:text-primary transition-colors min-h-[2.5rem]">
                        {title}
                    </h3>
                </Link>
            </CardHeader>

            <CardContent className="p-4 pt-0">
                <div className="text-2xl font-bold text-primary">
                    ${price.toLocaleString('es-AR')}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                    {tier === 'OFFICIAL' ? 'Brand New' : tier === 'SECOND_HAND' ? 'Pre-Owned' : 'As-Is'}
                </p>
            </CardContent>

            <CardFooter className="p-4 pt-0">
                <Button variant="outline" className="w-full hover:bg-primary hover:text-primary-foreground hover:border-primary" asChild>
                    <Link href={`/products/${slug}`}>View Details</Link>
                </Button>
            </CardFooter>
        </Card>
    );
}
