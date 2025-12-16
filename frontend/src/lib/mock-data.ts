export type Condition = "NEW" | "USED" | "DAMAGED";
export type Tier = "OFFICIAL" | "BOOTLEG";
export type Category = "FIGURE" | "CARD" | "PLUSH" | "DECOR" | "OTHER";

export interface Product {
    id: string;
    title: string;
    slug: string;
    description: string;
    price: number; // in cents (ARS)
    stock: number;
    brand: string | null;
    franchise: string | null;
    condition: Condition;
    tier: Tier;
    category: Category;
    images: string[];
}

export interface User {
    id: string;
    email: string;
    username: string;
    lootCoins: number;
    role: "USER" | "ADMIN";
}

// ============================================
// JRPG-THEMED MOCK PRODUCTS
// ============================================

export const mockProducts: Product[] = [
    {
        id: "1",
        title: "Monkey D. Luffy - Gear 5 Awakening",
        slug: "luffy-gear-5-awakening",
        description: "A legendary artifact capturing the mythical Gear 5 transformation. Radiates pure joy and liberation. +50 Charisma to the owner.",
        price: 8500000,
        stock: 5,
        brand: "Bandai Namco",
        franchise: "One Piece",
        condition: "NEW",
        tier: "OFFICIAL",
        category: "FIGURE",
        images: ["https://placehold.co/400x500/1a1a2e/f0d000?text=Gear+5+Luffy"],
    },
    {
        id: "2",
        title: "Son Goku - Ultra Instinct Mastered",
        slug: "goku-ultra-instinct",
        description: "The ultimate Saiyan form, frozen in time. Pulses with divine ki. +100 Agility and the ability to move before thought.",
        price: 7200000,
        stock: 3,
        brand: "Banpresto",
        franchise: "Dragon Ball",
        condition: "NEW",
        tier: "OFFICIAL",
        category: "FIGURE",
        images: ["https://placehold.co/400x500/1a1a2e/00d4ff?text=Ultra+Instinct"],
    },
    {
        id: "3",
        title: "Pikachu - Vintage 1999 Base Set",
        slug: "pikachu-base-set-1999",
        description: "A sacred scroll from the First Era. The yellow mouse of thunder, immortalized in holographic ink. +25 Luck to collectors.",
        price: 4500000,
        stock: 2,
        brand: "Wizards of the Coast",
        franchise: "Pokémon",
        condition: "USED",
        tier: "OFFICIAL",
        category: "CARD",
        images: ["https://placehold.co/400x500/f0d000/1a1a2e?text=Pikachu+1999"],
    },
    {
        id: "4",
        title: "Cloud Strife - Advent Children",
        slug: "cloud-strife-advent",
        description: "The mercenary of Midgar, blade at rest. Forged from premium polystone. +35 Strength, +20 Brooding Aesthetic.",
        price: 9800000,
        stock: 2,
        brand: "Square Enix",
        franchise: "Final Fantasy VII",
        condition: "NEW",
        tier: "OFFICIAL",
        category: "FIGURE",
        images: ["https://placehold.co/400x500/16213e/00d4ff?text=Cloud+Strife"],
    },
    {
        id: "5",
        title: "Snorlax - Giant Plush (120cm)",
        slug: "snorlax-giant-plush",
        description: "A legendary companion for resting heroes. Blocks pathways and promotes +200% Rest efficiency. Ideal for HP recovery.",
        price: 6500000,
        stock: 4,
        brand: "Pokémon Center",
        franchise: "Pokémon",
        condition: "NEW",
        tier: "OFFICIAL",
        category: "PLUSH",
        images: ["https://placehold.co/400x500/2d3436/f0d000?text=Snorlax+Plush"],
    },
    {
        id: "6",
        title: "Triforce Lamp - Legend of Zelda",
        slug: "triforce-lamp-zelda",
        description: "The sacred relic of Hyrule, now illuminating your realm. +15 Wisdom, +15 Courage, +15 Power when lit.",
        price: 3200000,
        stock: 8,
        brand: "Nintendo",
        franchise: "The Legend of Zelda",
        condition: "NEW",
        tier: "OFFICIAL",
        category: "DECOR",
        images: ["https://placehold.co/400x500/0a3d62/f0d000?text=Triforce+Lamp"],
    },
    {
        id: "7",
        title: "Goku SSJ - Chibi Version",
        slug: "goku-ssj-chibi-bootleg",
        description: "A pocket-sized warrior with questionable anatomy but undeniable charm. +10 Cuteness, -5 Accuracy. Budget quest friendly.",
        price: 1500000,
        stock: 15,
        brand: "Unknown Artisan",
        franchise: "Dragon Ball",
        condition: "NEW",
        tier: "BOOTLEG",
        category: "FIGURE",
        images: ["https://placehold.co/400x500/2ecc71/1a1a2e?text=Chibi+Goku"],
    },
    {
        id: "8",
        title: "Mystery Anime Cards - 50 Pack",
        slug: "mystery-cards-pack",
        description: "A sealed treasure chest of random anime cards. Contains 50 cards from various realms. +??? Stats. Gacha energy infused.",
        price: 800000,
        stock: 25,
        brand: "Mixed Origins",
        franchise: "Various",
        condition: "NEW",
        tier: "BOOTLEG",
        category: "CARD",
        images: ["https://placehold.co/400x500/9b59b6/f0d000?text=Mystery+Cards"],
    },
    {
        id: "9",
        title: "Vegeta - Final Flash Pose",
        slug: "vegeta-final-flash",
        description: "The Prince of all Saiyans at the apex of his signature attack. +75 Pride, +50 Attack Power. Whispers 'Kakarot...' at night.",
        price: 5500000,
        stock: 6,
        brand: "Banpresto",
        franchise: "Dragon Ball",
        condition: "NEW",
        tier: "OFFICIAL",
        category: "FIGURE",
        images: ["https://placehold.co/400x500/1a1a2e/9b59b6?text=Vegeta"],
    },
    {
        id: "10",
        title: "Totoro Plush - Forest Spirit Mini",
        slug: "totoro-plush-mini",
        description: "A tiny forest spirit companion. May or may not be visible to adults. +30 Whimsy, +20 Childhood Nostalgia.",
        price: 1200000,
        stock: 12,
        brand: "Forest Workshop",
        franchise: "Studio Ghibli",
        condition: "NEW",
        tier: "BOOTLEG",
        category: "PLUSH",
        images: ["https://placehold.co/400x500/2ecc71/ffffff?text=Totoro+Mini"],
    },
];

export const mockUser: User = {
    id: "user-1",
    email: "hero@lootkingdom.com",
    username: "BraveAdventurer",
    lootCoins: 1250,
    role: "USER",
};
