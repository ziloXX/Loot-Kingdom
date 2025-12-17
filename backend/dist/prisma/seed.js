"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('⚔️  Initializing the Loot Kingdom Database...');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.user.upsert({
        where: { email: 'admin@lootkingdom.com' },
        update: {},
        create: {
            email: 'admin@lootkingdom.com',
            username: 'ShopkeeperMaster',
            password: hashedPassword,
            role: client_1.Role.ADMIN,
            lootCoins: 9999,
        },
    });
    console.log('👑 Shopkeeper created:', admin.username);
    const testUserPassword = await bcrypt.hash('hero123', 10);
    const testUser = await prisma.user.upsert({
        where: { email: 'hero@lootkingdom.com' },
        update: {},
        create: {
            email: 'hero@lootkingdom.com',
            username: 'BraveAdventurer',
            password: testUserPassword,
            role: client_1.Role.USER,
            lootCoins: 500,
        },
    });
    console.log('🗡️  Adventurer registered:', testUser.username);
    const products = [
        {
            title: 'Monkey D. Luffy - Gear 5 Awakening',
            slug: 'luffy-gear-5-awakening-official',
            description: 'A legendary artifact capturing the mythical Gear 5 transformation. The figure radiates pure joy and liberation. Wielding this grants the owner +50 Charisma and the power to turn imagination into reality. Said to be forged in the flames of Wano.',
            price: 8500000,
            stock: 5,
            brand: 'Bandai Namco',
            franchise: 'One Piece',
            condition: client_1.Condition.NEW,
            tier: client_1.Tier.OFFICIAL,
            category: client_1.Category.FIGURE,
            images: ['https://placehold.co/600x800/1a1a2e/f0d000?text=Gear+5+Luffy&font=press-start-2p'],
        },
        {
            title: 'Son Goku - Ultra Instinct Mastered',
            slug: 'goku-ultra-instinct-official',
            description: 'The ultimate Saiyan form, frozen in time. This artifact pulses with divine ki. Grants the bearer +100 Agility and the ability to move before thought. A relic from the Tournament of Power.',
            price: 7200000,
            stock: 3,
            brand: 'Banpresto',
            franchise: 'Dragon Ball',
            condition: client_1.Condition.NEW,
            tier: client_1.Tier.OFFICIAL,
            category: client_1.Category.FIGURE,
            images: ['https://placehold.co/600x800/1a1a2e/00d4ff?text=Ultra+Instinct&font=press-start-2p'],
        },
        {
            title: 'Pikachu - Vintage 1999 Base Set',
            slug: 'pikachu-base-set-1999-card',
            description: 'A sacred scroll from the First Era. The yellow mouse of thunder, immortalized in holographic ink. +25 Luck to collectors. Warning: May attract other trainers seeking battle.',
            price: 4500000,
            stock: 2,
            brand: 'Wizards of the Coast',
            franchise: 'Pokémon',
            condition: client_1.Condition.USED,
            tier: client_1.Tier.OFFICIAL,
            category: client_1.Category.CARD,
            images: ['https://placehold.co/600x800/f0d000/1a1a2e?text=Pikachu+1999&font=press-start-2p'],
        },
        {
            title: 'Cloud Strife - Advent Children Complete',
            slug: 'cloud-strife-advent-children',
            description: 'The mercenary of Midgar, blade at rest. Forged from premium polystone. +35 Strength, +20 Brooding Aesthetic. The Buster Sword is detachable for those worthy.',
            price: 9800000,
            stock: 2,
            brand: 'Square Enix',
            franchise: 'Final Fantasy VII',
            condition: client_1.Condition.NEW,
            tier: client_1.Tier.OFFICIAL,
            category: client_1.Category.FIGURE,
            images: ['https://placehold.co/600x800/16213e/00d4ff?text=Cloud+Strife&font=press-start-2p'],
        },
        {
            title: 'Snorlax - Giant Plush (120cm)',
            slug: 'snorlax-giant-plush-official',
            description: 'A legendary companion for resting heroes. Blocks pathways and promotes +200% Rest efficiency. Comes with an invisible Poké Flute (you must imagine it). Ideal for HP recovery.',
            price: 6500000,
            stock: 4,
            brand: 'Pokémon Center',
            franchise: 'Pokémon',
            condition: client_1.Condition.NEW,
            tier: client_1.Tier.OFFICIAL,
            category: client_1.Category.PLUSH,
            images: ['https://placehold.co/600x800/2d3436/f0d000?text=Snorlax+Plush&font=press-start-2p'],
        },
        {
            title: 'Triforce Lamp - Legend of Zelda',
            slug: 'triforce-lamp-zelda-decor',
            description: 'The sacred relic of Hyrule, now illuminating your realm. Grants +15 Wisdom, +15 Courage, +15 Power when lit. Warning: May attract Ganondorf. LED-powered, USB rechargeable.',
            price: 3200000,
            stock: 8,
            brand: 'Nintendo',
            franchise: 'The Legend of Zelda',
            condition: client_1.Condition.NEW,
            tier: client_1.Tier.OFFICIAL,
            category: client_1.Category.DECOR,
            images: ['https://placehold.co/600x800/0a3d62/f0d000?text=Triforce+Lamp&font=press-start-2p'],
        },
        {
            title: 'Vegeta - Final Flash Pose',
            slug: 'vegeta-final-flash-official',
            description: 'The Prince of all Saiyans, captured at the apex of his signature attack. +75 Pride, +50 Attack Power. This artifact whispers "Kakarot..." at night.',
            price: 5500000,
            stock: 6,
            brand: 'Banpresto',
            franchise: 'Dragon Ball',
            condition: client_1.Condition.NEW,
            tier: client_1.Tier.OFFICIAL,
            category: client_1.Category.FIGURE,
            images: ['https://placehold.co/600x800/1a1a2e/9b59b6?text=Vegeta+Final+Flash&font=press-start-2p'],
        },
        {
            title: 'Naruto - Baryon Mode Ultimate',
            slug: 'naruto-baryon-mode-official',
            description: 'The Seventh Hokage\'s final form. Nuclear fusion of human and bijuu. +200 Attack, but drains HP over time. Handle with respect for the sacrifices made.',
            price: 8900000,
            stock: 3,
            brand: 'MegaHouse',
            franchise: 'Naruto Shippuden',
            condition: client_1.Condition.NEW,
            tier: client_1.Tier.OFFICIAL,
            category: client_1.Category.FIGURE,
            images: ['https://placehold.co/600x800/e74c3c/f0d000?text=Baryon+Mode&font=press-start-2p'],
        },
        {
            title: 'Goku Super Saiyan - Chibi Version',
            slug: 'goku-ssj-chibi-bootleg',
            description: 'A pocket-sized warrior with questionable anatomy but undeniable charm. +10 Cuteness, -5 Accuracy to details. Perfect for adventurers on a budget quest.',
            price: 1500000,
            stock: 15,
            brand: 'Unknown Artisan',
            franchise: 'Dragon Ball',
            condition: client_1.Condition.NEW,
            tier: client_1.Tier.BOOTLEG,
            category: client_1.Category.FIGURE,
            images: ['https://placehold.co/600x800/2ecc71/1a1a2e?text=Chibi+Goku&font=press-start-2p'],
        },
        {
            title: 'Zoro - Three Sword Style (Pre-owned)',
            slug: 'zoro-three-sword-used',
            description: 'A seasoned artifact, previously owned by a wandering collector. Minor battle scars add +15 Character. One sword may have been reglued. Still radiates Santoryu energy.',
            price: 2200000,
            stock: 4,
            brand: 'Banpresto',
            franchise: 'One Piece',
            condition: client_1.Condition.USED,
            tier: client_1.Tier.OFFICIAL,
            category: client_1.Category.FIGURE,
            images: ['https://placehold.co/600x800/27ae60/f0f0f0?text=Zoro+Used&font=press-start-2p'],
        },
        {
            title: 'Mystery Anime Trading Cards - 50 Pack',
            slug: 'mystery-anime-cards-pack',
            description: 'A sealed treasure chest of random anime cards. Contains 50 cards from various realms. +??? Stats. Gacha energy infused. Results may vary. No refunds on luck.',
            price: 800000,
            stock: 25,
            brand: 'Mixed Origins',
            franchise: 'Various',
            condition: client_1.Condition.NEW,
            tier: client_1.Tier.BOOTLEG,
            category: client_1.Category.CARD,
            images: ['https://placehold.co/600x800/9b59b6/f0d000?text=Mystery+Cards&font=press-start-2p'],
        },
        {
            title: 'Totoro Plush - Forest Spirit Mini',
            slug: 'totoro-plush-mini-bootleg',
            description: 'A tiny forest spirit companion. May or may not be visible to adults. +30 Whimsy, +20 Childhood Nostalgia. Crafted by artisans inspired by the Ghibli realm.',
            price: 1200000,
            stock: 12,
            brand: 'Forest Workshop',
            franchise: 'Studio Ghibli',
            condition: client_1.Condition.NEW,
            tier: client_1.Tier.BOOTLEG,
            category: client_1.Category.PLUSH,
            images: ['https://placehold.co/600x800/2ecc71/ffffff?text=Totoro+Mini&font=press-start-2p'],
        },
        {
            title: 'Damaged Box - Sailor Moon Figure',
            slug: 'sailor-moon-damaged-box',
            description: 'The champion of justice, in a box that has seen battle. Figure pristine, packaging war-torn. -100 Box Condition, +100 Value for true collectors who see beyond.',
            price: 3500000,
            stock: 2,
            brand: 'Bandai',
            franchise: 'Sailor Moon',
            condition: client_1.Condition.DAMAGED,
            tier: client_1.Tier.OFFICIAL,
            category: client_1.Category.FIGURE,
            images: ['https://placehold.co/600x800/e91e63/f0d000?text=Sailor+Moon&font=press-start-2p'],
        },
        {
            title: 'Retro Game Posters Set - 5 Pack',
            slug: 'retro-game-posters-set',
            description: 'Five sacred scrolls depicting legends: Mario, Sonic, Link, Samus, and Mega Man. +40 Room Aesthetic, +25 Retro Cred. Printed on premium parchment (glossy paper).',
            price: 950000,
            stock: 20,
            brand: 'Pixel Prints',
            franchise: 'Various Classics',
            condition: client_1.Condition.NEW,
            tier: client_1.Tier.BOOTLEG,
            category: client_1.Category.DECOR,
            images: ['https://placehold.co/600x800/3498db/ffffff?text=Retro+Posters&font=press-start-2p'],
        },
        {
            title: 'Charizard Holographic - PSA 8 Grade',
            slug: 'charizard-holo-psa8-card',
            description: 'The fire-breathing dragon of legend, preserved in crystalline slab. PSA 8 certified - Near Mint condition. +500 Collector Status, +∞ Childhood Dreams Fulfilled.',
            price: 15000000,
            stock: 1,
            brand: 'Wizards of the Coast',
            franchise: 'Pokémon',
            condition: client_1.Condition.USED,
            tier: client_1.Tier.OFFICIAL,
            category: client_1.Category.CARD,
            images: ['https://placehold.co/600x800/e74c3c/f0d000?text=Charizard+PSA8&font=press-start-2p'],
        },
    ];
    console.log('📦 Stocking the Item Shop with legendary treasures...');
    for (const product of products) {
        await prisma.product.upsert({
            where: { slug: product.slug },
            update: product,
            create: product,
        });
    }
    console.log(`✨ Successfully added ${products.length} items to the inventory!`);
    console.log('');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('  🏰 LOOT KINGDOM DATABASE INITIALIZATION COMPLETE 🏰');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('');
    console.log('  👑 Admin Login:');
    console.log('     Email: admin@lootkingdom.com');
    console.log('     Password: admin123');
    console.log('');
    console.log('  🗡️  Test User Login:');
    console.log('     Email: hero@lootkingdom.com');
    console.log('     Password: hero123');
    console.log('');
    console.log('═══════════════════════════════════════════════════════════');
}
main()
    .catch((e) => {
    console.error('💀 Database seeding failed:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map