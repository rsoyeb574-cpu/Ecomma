import { Category, Product, SellerProfile, User, Order, Review, Coupon } from '../types';

// Helper to create beautiful, self-contained SVG product images with editorial craftsmanship styling
export function createCraftSvg(bgHex: string, accentHex: string, label: string, category: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="100%" height="100%">
    <defs>
      <linearGradient id="g_${label.replace(/\s+/g, '')}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${bgHex}"/>
        <stop offset="100%" stop-color="${accentHex}"/>
      </linearGradient>
      <pattern id="pat_${label.replace(/\s+/g, '')}" width="40" height="40" patternUnits="userSpaceOnUse">
        <circle cx="20" cy="20" r="1.5" fill="rgba(255,255,255,0.15)"/>
        <path d="M0 20h40M20 0v40" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
      </pattern>
    </defs>
    <rect width="600" height="600" fill="url(#g_${label.replace(/\s+/g, '')})"/>
    <rect width="600" height="600" fill="url(#pat_${label.replace(/\s+/g, '')})"/>
    
    <!-- Decorative mandala / craftsmanship ring -->
    <g transform="translate(300, 260)" stroke="rgba(255,255,255,0.3)" stroke-width="1.5" fill="none">
      <circle r="120" stroke-dasharray="4 8"/>
      <circle r="90" stroke="rgba(255,255,255,0.4)"/>
      <circle r="50" fill="rgba(255,255,255,0.08)"/>
      <!-- Geometrics -->
      <polygon points="0,-80 80,0 0,80 -80,0" stroke="rgba(255,255,255,0.2)"/>
      <polygon points="0,-60 60,0 0,60 -60,0" stroke="rgba(255,255,255,0.25)"/>
    </g>

    <!-- Center Icon Symbol -->
    <g transform="translate(300, 260)" fill="white" opacity="0.95">
      <circle r="28" fill="rgba(15,27,45,0.25)"/>
      <text text-anchor="middle" y="9" font-family="'Fraunces', serif" font-size="28" font-weight="bold">E</text>
    </g>

    <!-- Category Kicker -->
    <text x="300" y="440" text-anchor="middle" fill="rgba(255,255,255,0.85)" font-family="'Inter', sans-serif" font-size="14" font-weight="600" letter-spacing="3">${category.toUpperCase()}</text>
    
    <!-- Title Label -->
    <text x="300" y="480" text-anchor="middle" fill="#FFFFFF" font-family="'Fraunces', Georgia, serif" font-size="24" font-weight="600">${label}</text>
    
    <text x="300" y="515" text-anchor="middle" fill="rgba(255,255,255,0.75)" font-family="'Inter', sans-serif" font-size="13">100% Authentic Handmade · Ecomma Certified</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat-ethnic',
    name: 'Ethnic Wear & Handlooms',
    slug: 'ethnic-wear-handlooms',
    iconName: 'Shirt',
    description: 'Chanderi silks, Banarasi weaves, Mulmul kurtis & artisanal dhotis.',
    productCount: 14
  },
  {
    id: 'cat-brass',
    name: 'Brass & Bell Metal Handicrafts',
    slug: 'brass-bell-metal',
    iconName: 'Sparkles',
    description: 'Lost-wax Dhokra sculptures, antique Urli bowls & temple diyas.',
    productCount: 9
  },
  {
    id: 'cat-wellness',
    name: 'Ayurvedic & Herbal Wellness',
    slug: 'ayurvedic-herbal-wellness',
    iconName: 'Leaf',
    description: 'Cold-pressed oils, Kumkumadi serums, Ubtan & forest honey.',
    productCount: 8
  },
  {
    id: 'cat-footwear',
    name: 'Handcrafted Footwear & Juttis',
    slug: 'handcrafted-footwear-juttis',
    iconName: 'Footprints',
    description: 'Genuine leather Mojaris, Zardozi juttis & Kolhapuri sandals.',
    productCount: 6
  },
  {
    id: 'cat-jewellery',
    name: 'Fine Silver & Temple Jewellery',
    slug: 'silver-temple-jewellery',
    iconName: 'Gem',
    description: '92.5 Sterling silver jhumkas, Kundan necklaces & oxidized bangles.',
    productCount: 7
  },
  {
    id: 'cat-spices',
    name: 'Organic Spices & Gourmet',
    slug: 'organic-spices-gourmet',
    iconName: 'Coffee',
    description: 'Single-origin Wayanad pepper, Kashmiri saffron & sun-dried spices.',
    productCount: 6
  },
  {
    id: 'cat-linen',
    name: 'Home Linen & Kantha Quilts',
    slug: 'home-linen-kantha',
    iconName: 'Home',
    description: 'Hand-block printed Jaipuri quilts, cushion covers & table runners.',
    productCount: 7
  },
  {
    id: 'cat-pottery',
    name: 'Contemporary Studio Pottery',
    slug: 'studio-pottery',
    iconName: 'Flame',
    description: 'Hand-thrown stoneware, ceramic planters, tea sets & tableware.',
    productCount: 5
  }
];

export const INITIAL_SELLERS: SellerProfile[] = [
  {
    id: 'seller-1',
    userId: 'user-seller-1',
    storeName: 'Kavita Silks & Crafts',
    slug: 'kavita-silks',
    logo: createCraftSvg('#3A1C28', '#8B2635', 'Kavita Silks', 'Artisan Guild'),
    description: 'Generational weavers from Chanderi & Maheshwar dedicated to preserving authentic handloom silk and zari traditions.',
    rating: 4.88,
    reviewCount: 342,
    isVerified: true,
    joinedDate: '2024-03-15',
    gstNumber: '23AAACK1924L1Z7',
    bankDetails: {
      accountHolder: 'Kavita Maheshwari',
      accountNumber: '918237461928',
      ifsc: 'HDFC0001824',
      bankName: 'HDFC Bank, Chanderi',
      upiId: 'kavita@okhdfcbank'
    },
    pickupAddress: {
      id: 'addr-seller-1',
      name: 'Kavita Silks Studio',
      street: '14 Bunkar Galli, Near Rajwada',
      city: 'Chanderi',
      state: 'Madhya Pradesh',
      pincode: '473446',
      phone: '+91 98261 44521',
      type: 'work'
    },
    commissionRate: 0.08,
    totalSales: 489200,
    walletBalance: 42150,
    pendingBalance: 12800,
    kycStatus: 'verified',
    status: 'active'
  },
  {
    id: 'seller-2',
    userId: 'user-seller-2',
    storeName: 'Dhokra Bastar Heritage',
    slug: 'dhokra-bastar-heritage',
    logo: createCraftSvg('#2B2A29', '#634735', 'Dhokra Craft', 'Sculptors Guild'),
    description: 'Tribal metal casters from Kondagaon crafting 4,000-year-old lost-wax bell metal art directly for conscious collectors.',
    rating: 4.92,
    reviewCount: 188,
    isVerified: true,
    joinedDate: '2024-01-10',
    gstNumber: '22AALCD8891J1ZT',
    bankDetails: {
      accountHolder: 'Ganga Ram Baghel',
      accountNumber: '30918273641',
      ifsc: 'SBIN0003412',
      bankName: 'State Bank of India, Kondagaon',
      upiId: 'dhokrabastar@oksbi'
    },
    pickupAddress: {
      id: 'addr-seller-2',
      name: 'Bastar Bell Metal Cluster',
      street: 'Silpi Gram, Main Road',
      city: 'Kondagaon',
      state: 'Chhattisgarh',
      pincode: '494226',
      phone: '+91 94060 12891',
      type: 'work'
    },
    commissionRate: 0.08,
    totalSales: 312000,
    walletBalance: 28400,
    pendingBalance: 8600,
    kycStatus: 'verified',
    status: 'active'
  },
  {
    id: 'seller-3',
    userId: 'user-seller-3',
    storeName: 'VedaVruksha Ayurvedic Wellness',
    slug: 'vedavruksha-herbals',
    logo: createCraftSvg('#132A13', '#31572C', 'VedaVruksha', 'Ayurveda'),
    description: 'Authentic Kerala Ayurvedic formulations prepared strictly adhering to Sahasrayogam and Ashtanga Hridaya texts.',
    rating: 4.85,
    reviewCount: 412,
    isVerified: true,
    joinedDate: '2023-11-20',
    gstNumber: '32AABCV4921K1ZZ',
    bankDetails: {
      accountHolder: 'Dr. Madhavan Nambiar',
      accountNumber: '501004128941',
      ifsc: 'ICIC0000841',
      bankName: 'ICICI Bank, Fort Kochi',
      upiId: 'vedavruksha@okicici'
    },
    pickupAddress: {
      id: 'addr-seller-3',
      name: 'VedaVruksha Pharmacy & Lab',
      street: '72 Heritage Way, Mattancherry',
      city: 'Kochi',
      state: 'Kerala',
      pincode: '682002',
      phone: '+91 98470 33219',
      type: 'work'
    },
    commissionRate: 0.08,
    totalSales: 645000,
    walletBalance: 59300,
    pendingBalance: 15400,
    kycStatus: 'verified',
    status: 'active'
  },
  {
    id: 'seller-4',
    userId: 'user-seller-4',
    storeName: 'Royale Jodhpur Mojari',
    slug: 'royale-jodhpur-mojari',
    logo: createCraftSvg('#4A1525', '#9E2A2B', 'Royale Mojari', 'Leather Guild'),
    description: 'Hand-stitched vegetable-tanned leather footwear made by royal cobbler families in the blue city of Jodhpur.',
    rating: 4.79,
    reviewCount: 275,
    isVerified: true,
    joinedDate: '2024-02-01',
    gstNumber: '08AAEFM3912L1ZX',
    bankDetails: {
      accountHolder: 'Mohammad Rafiq',
      accountNumber: '20194817263',
      ifsc: 'PUNB0182400',
      bankName: 'Punjab National Bank, Jodhpur',
      upiId: 'royalemojari@axis'
    },
    pickupAddress: {
      id: 'addr-seller-4',
      name: 'Royale Mojari Workshop',
      street: 'Clock Tower Road, Sardar Market',
      city: 'Jodhpur',
      state: 'Rajasthan',
      pincode: '342001',
      phone: '+91 94141 88392',
      type: 'work'
    },
    commissionRate: 0.08,
    totalSales: 298400,
    walletBalance: 21900,
    pendingBalance: 6400,
    kycStatus: 'verified',
    status: 'active'
  },
  {
    id: 'seller-5',
    userId: 'user-seller-5',
    storeName: 'Malabar Spice Trove',
    slug: 'malabar-spice-trove',
    logo: createCraftSvg('#3D2645', '#832161', 'Malabar Spice', 'Estate Origin'),
    description: 'High-elevation shade-grown pepper, wild forest cinnamon, and single-harvest spices straight from Wayanad hills.',
    rating: 4.94,
    reviewCount: 520,
    isVerified: true,
    joinedDate: '2023-09-05',
    gstNumber: '32AACFM9910P1ZW',
    bankDetails: {
      accountHolder: 'George Kurian',
      accountNumber: '01928475619',
      ifsc: 'FDRL0001392',
      bankName: 'Federal Bank, Kalpetta',
      upiId: 'malabarspice@fednet'
    },
    pickupAddress: {
      id: 'addr-seller-5',
      name: 'Malabar Processing Estate',
      street: 'Vythiri Road, Kalpetta',
      city: 'Wayanad',
      state: 'Kerala',
      pincode: '673121',
      phone: '+91 94471 29482',
      type: 'work'
    },
    commissionRate: 0.08,
    totalSales: 782000,
    walletBalance: 68400,
    pendingBalance: 19500,
    kycStatus: 'verified',
    status: 'active'
  },
  {
    id: 'seller-6',
    userId: 'user-seller-6',
    storeName: 'Khurja Studio Pottery Co.',
    slug: 'khurja-studio-pottery',
    logo: createCraftSvg('#1D3557', '#457B9D', 'Khurja Studio', 'Ceramics'),
    description: 'Ceramic artisans fusing Khurja heritage high-fire stoneware techniques with Scandinavian minimalism.',
    rating: 4.81,
    reviewCount: 164,
    isVerified: true,
    joinedDate: '2024-04-12',
    gstNumber: '09AAKCS1029Q1ZV',
    bankDetails: {
      accountHolder: 'Sunil Prajapati',
      accountNumber: '60192837461',
      ifsc: 'BARB0KHURJA',
      bankName: 'Bank of Baroda, Khurja',
      upiId: 'khurjaceramics@barodampay'
    },
    pickupAddress: {
      id: 'addr-seller-6',
      name: 'Khurja Pottery Kiln #4',
      street: 'GT Road Ceramic Zone',
      city: 'Khurja',
      state: 'Uttar Pradesh',
      pincode: '203131',
      phone: '+91 97191 00293',
      type: 'work'
    },
    commissionRate: 0.08,
    totalSales: 215000,
    walletBalance: 18700,
    pendingBalance: 5200,
    kycStatus: 'verified',
    status: 'active'
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  // Category: Ethnic Wear & Handlooms
  {
    id: 'prod-1',
    sellerId: 'seller-1',
    sellerName: 'Kavita Silks & Crafts',
    sellerRating: 4.88,
    title: 'Pure Chanderi Silk Zari Saree - Saffron Gold & Lotus Pink',
    slug: 'pure-chanderi-silk-zari-saree-saffron',
    description: 'Handwoven on traditional pit looms in Chanderi, Madhya Pradesh. This heirloom saree features delicate gold zari bootis on a luminous dual-tone warp of lotus pink and rich saffron. Finished with an unstitched matching blouse piece.',
    bulletFeatures: [
      '100% Pure Silk by Cotton warp with certified Silk Mark',
      'Hand-woven gold tested metallic zari border and pallu',
      'Breathable, lightweight 420g drape suitable for weddings and celebrations',
      'Includes 80cm unstitched pure silk blouse piece',
      'Care: Dry clean only; store folded in muslin cloth'
    ],
    category: 'Ethnic Wear & Handlooms',
    subCategory: 'Sarees',
    tags: ['chanderi', 'silk saree', 'handloom', 'zari', 'wedding', 'saffron', 'festive'],
    images: [
      createCraftSvg('#9E2A2B', '#E09F3E', 'Chanderi Saree', 'Ethnic Wear'),
      createCraftSvg('#540B0E', '#9E2A2B', 'Pallu Detail', 'Handloom'),
      createCraftSvg('#335C67', '#E09F3E', 'Zari Border', 'Craft Detail')
    ],
    price: 4899,
    originalPrice: 6500,
    stock: 12,
    isCodAvailable: true,
    status: 'active',
    rating: 4.9,
    reviewCount: 78,
    variants: [
      { id: 'v1-1', name: 'Standard 6.3m (with blouse)', sku: 'KS-CHN-001-STD', price: 4899, originalPrice: 6500, stock: 12, attributes: { Length: '6.3 Meters' } }
    ],
    seoTitle: 'Buy Pure Chanderi Silk Zari Saree Online | Handcrafted at Ecomma',
    seoDescription: 'Shop authentic Chanderi silk saree with gold zari work. Handwoven by master artisans with Silk Mark guarantee and Cash on Delivery.',
    aiScore: 96,
    returnPolicyDays: 7,
    weightGrams: 420,
    createdAt: '2025-01-10',
    isTrending: true,
    isBestseller: true
  },
  {
    id: 'prod-2',
    sellerId: 'seller-1',
    sellerName: 'Kavita Silks & Crafts',
    sellerRating: 4.88,
    title: 'Handloom Maheshwari Cotton-Silk Kurti - Indigo & Madder',
    slug: 'handloom-maheshwari-cotton-silk-kurti',
    description: 'Crafted with fine count Maheshwari cotton silk featuring traditional geometric Bugdi borders along the placket. Breathable comfort for all-day festive or workplace wear.',
    bulletFeatures: [
      'Blend of 70% mercerized cotton and 30% Mulberry silk',
      'Natural indigo and madder root plant dyes',
      'Contemporary A-line silhouette with side slits and pocket',
      'Pre-shrunk fabric with colorfast guarantee'
    ],
    category: 'Ethnic Wear & Handlooms',
    subCategory: 'Kurtis & Tunics',
    tags: ['maheshwari', 'kurti', 'cotton silk', 'indigo', 'office wear', 'handloom'],
    images: [
      createCraftSvg('#1D3557', '#457B9D', 'Maheshwari Kurti', 'Ethnic Wear'),
      createCraftSvg('#1D3557', '#E63946', 'Border Placket', 'Detail')
    ],
    price: 1899,
    originalPrice: 2499,
    stock: 24,
    isCodAvailable: true,
    status: 'active',
    rating: 4.8,
    reviewCount: 64,
    variants: [
      { id: 'v2-s', name: 'Size S (Bust 36")', sku: 'KS-MAH-S', price: 1899, originalPrice: 2499, stock: 6, attributes: { Size: 'S' } },
      { id: 'v2-m', name: 'Size M (Bust 38")', sku: 'KS-MAH-M', price: 1899, originalPrice: 2499, stock: 8, attributes: { Size: 'M' } },
      { id: 'v2-l', name: 'Size L (Bust 40")', sku: 'KS-MAH-L', price: 1899, originalPrice: 2499, stock: 7, attributes: { Size: 'L' } },
      { id: 'v2-xl', name: 'Size XL (Bust 42")', sku: 'KS-MAH-XL', price: 1899, originalPrice: 2499, stock: 3, attributes: { Size: 'XL' } }
    ],
    seoTitle: 'Maheshwari Cotton Silk Handloom Kurti | Ecomma India',
    seoDescription: 'Handcrafted Maheshwari kurti with zari bugdi border. Fast delivery across India with easy returns.',
    aiScore: 92,
    returnPolicyDays: 7,
    weightGrams: 280,
    createdAt: '2025-01-14',
    isTrending: true
  },
  {
    id: 'prod-3',
    sellerId: 'seller-1',
    sellerName: 'Kavita Silks & Crafts',
    sellerRating: 4.88,
    title: 'Bagru Hand-Block Printed Tussar Silk Dupatta',
    slug: 'bagru-hand-block-printed-tussar-silk-dupatta',
    description: 'Wild Tussar silk dupatta stamped by hand using teak wood blocks with natural mud-resist Dabu and vegetable inks. Rich organic texture with self-fringed edges.',
    bulletFeatures: [
      'Certified authentic wild Tussar silk weave',
      'Traditional Bagru floral and geometric bootis',
      'Length: 2.5 meters, Width: 36 inches',
      'Hypoallergenic vegetable colors'
    ],
    category: 'Ethnic Wear & Handlooms',
    subCategory: 'Dupattas & Stoles',
    tags: ['bagru', 'tussar silk', 'dupatta', 'block print', 'organic'],
    images: [
      createCraftSvg('#603808', '#B08968', 'Tussar Dupatta', 'Ethnic Wear')
    ],
    price: 2199,
    originalPrice: 2800,
    stock: 15,
    isCodAvailable: true,
    status: 'active',
    rating: 4.75,
    reviewCount: 39,
    variants: [
      { id: 'v3-1', name: 'Free Size (2.5m)', sku: 'KS-DUP-01', price: 2199, originalPrice: 2800, stock: 15, attributes: { Size: '2.5m' } }
    ],
    returnPolicyDays: 7,
    weightGrams: 220,
    createdAt: '2025-01-20'
  },

  // Category: Brass & Bell Metal Handicrafts
  {
    id: 'prod-4',
    sellerId: 'seller-2',
    sellerName: 'Dhokra Bastar Heritage',
    sellerRating: 4.92,
    title: 'Tribal Lost-Wax Dhokra Dancing Figurine (12 Inch)',
    slug: 'tribal-lost-wax-dhokra-dancing-figurine',
    description: 'An iconic antique-finish brass sculpture made via the prehistoric cire-perdue (lost wax) casting process. Depicts a Bastar village woman celebrating harvest, full of rhythmic motion and tactile wirework.',
    bulletFeatures: [
      'Solid non-ferrous bell metal (brass and bronze alloy)',
      '100% handcrafted - each piece is unique and non-replicable',
      'Weight: 1.85 kg, Height: 12 inches',
      'Treated with protective organic beeswax patina to prevent corrosion',
      'Direct Geographical Indication (GI) certified Bastar Dhokra'
    ],
    category: 'Brass & Bell Metal Handicrafts',
    subCategory: 'Sculptures & Statues',
    tags: ['dhokra', 'bastar', 'brass sculpture', 'lost wax', 'antique', 'home decor'],
    images: [
      createCraftSvg('#3D261D', '#8C5A3C', 'Dhokra Figurine', 'Sculpture'),
      createCraftSvg('#2E1C14', '#D4A373', 'Wirework Detail', 'Craft')
    ],
    price: 3499,
    originalPrice: 4500,
    stock: 8,
    isCodAvailable: true,
    status: 'active',
    rating: 4.95,
    reviewCount: 52,
    variants: [
      { id: 'v4-1', name: 'Antique Bronze Finish (12")', sku: 'DH-FIG-12', price: 3499, originalPrice: 4500, stock: 8, attributes: { Finish: 'Antique Bronze' } }
    ],
    seoTitle: 'Authentic Bastar Dhokra Brass Dancing Figurine | Ecomma',
    seoDescription: 'Buy GI-tagged Bastar Dhokra bell metal sculpture online. Hand-cast by tribal masters with certificate of authenticity.',
    aiScore: 97,
    returnPolicyDays: 7,
    weightGrams: 1850,
    createdAt: '2025-01-05',
    isTrending: true,
    isBestseller: true
  },
  {
    id: 'prod-5',
    sellerId: 'seller-2',
    sellerName: 'Dhokra Bastar Heritage',
    sellerRating: 4.92,
    title: 'Handcrafted Brass Peacock Urli Bowl with Bell Accents',
    slug: 'handcrafted-brass-peacock-urli-bowl',
    description: 'Heavy gauge bell-metal floating flower urli bowl decorated with sculpted peacock handles and traditional Ghungroo bells. Fill with water and fresh marigolds or floating tea lights.',
    bulletFeatures: [
      'Diameter: 10 inches, Depth: 3.5 inches',
      'Weight: 2.2 kg thick cast brass',
      'Hand-chiseled feather motifs along rim',
      'Ideal for festive entryways, pooja rooms, and Diwali gifts'
    ],
    category: 'Brass & Bell Metal Handicrafts',
    subCategory: 'Vessels & Diyas',
    tags: ['urli bowl', 'brass urli', 'peacock', 'pooja decor', 'diwali', 'brass'],
    images: [
      createCraftSvg('#4A3525', '#C68B59', 'Peacock Urli', 'Brass Decor')
    ],
    price: 2799,
    originalPrice: 3600,
    stock: 14,
    isCodAvailable: true,
    status: 'active',
    rating: 4.88,
    reviewCount: 43,
    variants: [
      { id: 'v5-1', name: '10 Inch Classic', sku: 'DH-URLI-10', price: 2799, originalPrice: 3600, stock: 14, attributes: { Size: '10 Inch' } }
    ],
    returnPolicyDays: 7,
    weightGrams: 2200,
    createdAt: '2025-01-18'
  },
  {
    id: 'prod-6',
    sellerId: 'seller-2',
    sellerName: 'Dhokra Bastar Heritage',
    sellerRating: 4.92,
    title: 'Dhokra Brass Elephant Figurine with Howdah Canopy',
    slug: 'dhokra-brass-elephant-howdah',
    description: 'Intricate Bastar bell-metal elephant adorned with royal procession trappings and bell fringe. Symbolizes prosperity, strength, and grounded wisdom.',
    bulletFeatures: [
      'Dimensions: 7" L x 4" W x 6" H',
      'Weight: 1.1 kg solid brass',
      'Hand-spun brass thread filigree body',
      'Clean with a dry cotton cloth'
    ],
    category: 'Brass & Bell Metal Handicrafts',
    subCategory: 'Animal Figurines',
    tags: ['brass elephant', 'dhokra', 'royal decor', 'bastar art'],
    images: [
      createCraftSvg('#302217', '#7F5539', 'Brass Elephant', 'Sculpture')
    ],
    price: 1999,
    originalPrice: 2500,
    stock: 19,
    isCodAvailable: true,
    status: 'active',
    rating: 4.82,
    reviewCount: 31,
    variants: [
      { id: 'v6-1', name: 'Single Elephant (6")', sku: 'DH-ELE-06', price: 1999, originalPrice: 2500, stock: 19, attributes: { Size: '6 Inch' } }
    ],
    returnPolicyDays: 7,
    weightGrams: 1100,
    createdAt: '2025-01-25'
  },

  // Category: Ayurvedic & Herbal Wellness
  {
    id: 'prod-7',
    sellerId: 'seller-3',
    sellerName: 'VedaVruksha Ayurvedic Wellness',
    sellerRating: 4.85,
    title: 'Authentic Kumkumadi Thailam Miraculous Beauty Fluid (30ml)',
    slug: 'kumkumadi-thailam-beauty-fluid-30ml',
    description: 'Slow-cooked in goat milk and pure sesame oil over 72 hours according to classical Ayurvedic scripture. Infused with Kashmiri Mogra saffron, red sandalwood, and 24 precious herbs for luminous complexion and pigmentation repair.',
    bulletFeatures: [
      '100% natural Ayurvedic formulation with Grade-A Kashmiri saffron',
      'Free from mineral oils, parabens, synthetic colors, and fragrance',
      'Clinically proven to brighten dull skin and fade hyperpigmentation',
      'Packaged in amber UV-protective dropper bottle'
    ],
    category: 'Ayurvedic & Herbal Wellness',
    subCategory: 'Facial Serums & Oils',
    tags: ['kumkumadi', 'ayurveda', 'saffron oil', 'organic serum', 'glowing skin'],
    images: [
      createCraftSvg('#4F1D2B', '#E29578', 'Kumkumadi Oil', 'Ayurveda'),
      createCraftSvg('#3A1C28', '#8B2635', 'Herbal Ingredients', 'Purity')
    ],
    price: 1499,
    originalPrice: 1999,
    stock: 45,
    isCodAvailable: true,
    status: 'active',
    rating: 4.93,
    reviewCount: 142,
    variants: [
      { id: 'v7-30', name: '30ml Dropper Bottle', sku: 'VV-KUM-30', price: 1499, originalPrice: 1999, stock: 30, attributes: { Volume: '30ml' } },
      { id: 'v7-50', name: '50ml Value Pack', sku: 'VV-KUM-50', price: 2199, originalPrice: 2899, stock: 15, attributes: { Volume: '50ml' } }
    ],
    seoTitle: 'Pure Kumkumadi Thailam Saffron Face Oil | VedaVruksha Ecomma',
    seoDescription: 'Authentic Kerala Kumkumadi tailam for radiant skin. Made with genuine saffron & cold pressed sesame oil. Order on Ecomma.',
    aiScore: 95,
    returnPolicyDays: 7,
    weightGrams: 150,
    createdAt: '2025-01-08',
    isTrending: true,
    isBestseller: true
  },
  {
    id: 'prod-8',
    sellerId: 'seller-3',
    sellerName: 'VedaVruksha Ayurvedic Wellness',
    sellerRating: 4.85,
    title: 'Cold-Pressed Wild Moringa & Bhringraj Scalp Elixir (200ml)',
    slug: 'cold-pressed-moringa-bhringraj-scalp-elixir',
    description: 'An invigorating scalp potion made with wild forest Bhringraj, cold-pressed black sesame oil, Amla, and Brahmi. Stimulates dormant follicles and halts premature greying.',
    bulletFeatures: [
      'Traditional Kshirpak विधि with herbal milk decoctions',
      'Visible reduction in hair fall within 3 weeks of bi-weekly use',
      'Glass bottle with easy flip-top applicator',
      'No synthetic silicones or petroleum derivatives'
    ],
    category: 'Ayurvedic & Herbal Wellness',
    subCategory: 'Hair Care',
    tags: ['bhringraj', 'hair oil', 'moringa', 'ayurvedic hair care', 'natural'],
    images: [
      createCraftSvg('#1B4332', '#52B788', 'Bhringraj Elixir', 'Hair Care')
    ],
    price: 799,
    originalPrice: 1100,
    stock: 60,
    isCodAvailable: true,
    status: 'active',
    rating: 4.8,
    reviewCount: 96,
    variants: [
      { id: 'v8-1', name: '200ml Glass Bottle', sku: 'VV-BHR-200', price: 799, originalPrice: 1100, stock: 60, attributes: { Volume: '200ml' } }
    ],
    returnPolicyDays: 7,
    weightGrams: 350,
    createdAt: '2025-01-16'
  },
  {
    id: 'prod-9',
    sellerId: 'seller-3',
    sellerName: 'VedaVruksha Ayurvedic Wellness',
    sellerRating: 4.85,
    title: 'Raw Forest Wildflower Honey with Royal Jelly & Pollen (500g)',
    slug: 'raw-forest-wildflower-honey-royal-jelly',
    description: 'Ethically harvested from the deep Shola forests of Nilgiris by tribal honey gatherers. Unfiltered, unpasteurized, and rich in natural bee pollen and enzymes.',
    bulletFeatures: [
      'NMR tested 100% pure raw forest honey',
      'Zero added inverted sugars or corn syrups',
      'Rich amber color with delicate floral aroma',
      'Packed in reusable food-grade glass jar'
    ],
    category: 'Ayurvedic & Herbal Wellness',
    subCategory: 'Superfoods & Tonics',
    tags: ['raw honey', 'wildflower', 'forest honey', 'ayurvedic', 'immunity'],
    images: [
      createCraftSvg('#7F4F24', '#DDB892', 'Raw Forest Honey', 'Wellness')
    ],
    price: 649,
    originalPrice: 850,
    stock: 50,
    isCodAvailable: true,
    status: 'active',
    rating: 4.9,
    reviewCount: 88,
    variants: [
      { id: 'v9-1', name: '500g Glass Jar', sku: 'VV-HON-500', price: 649, originalPrice: 850, stock: 50, attributes: { Weight: '500g' } }
    ],
    returnPolicyDays: 7,
    weightGrams: 750,
    createdAt: '2025-01-22'
  },

  // Category: Handcrafted Footwear & Juttis
  {
    id: 'prod-10',
    sellerId: 'seller-4',
    sellerName: 'Royale Jodhpur Mojari',
    sellerRating: 4.79,
    title: 'Hand-Stitched Tan Camel Leather Mojari with Brass Rivets',
    slug: 'hand-stitched-tan-camel-leather-mojari',
    description: 'Heritage Rajasthani slip-on mojari crafted from supple vegetable-tanned camel hide. Hand-turned and stitched with strong cotton cord, featuring a curved Khussa toe and cushioned insole.',
    bulletFeatures: [
      '100% genuine breathable vegetable-tanned leather',
      'Double-stitched leather sole with anti-slip rubber heel insert',
      'Padded memory foam footbed for bite-free comfort',
      'Pairs perfectly with kurtas, sherwanis, or rolled denim'
    ],
    category: 'Handcrafted Footwear & Juttis',
    subCategory: 'Mens Mojari',
    tags: ['mojari', 'jodhpur', 'leather shoes', 'khussa', 'ethnic footwear', 'rajasthan'],
    images: [
      createCraftSvg('#582F0E', '#A68A56', 'Tan Mojari', 'Footwear'),
      createCraftSvg('#3B2219', '#7F4F24', 'Leather Sole Detail', 'Craft')
    ],
    price: 2199,
    originalPrice: 2999,
    stock: 22,
    isCodAvailable: true,
    status: 'active',
    rating: 4.82,
    reviewCount: 71,
    variants: [
      { id: 'v10-7', name: 'UK 7 (EU 41)', sku: 'RM-MOJ-07', price: 2199, originalPrice: 2999, stock: 5, attributes: { Size: 'UK 7' } },
      { id: 'v10-8', name: 'UK 8 (EU 42)', sku: 'RM-MOJ-08', price: 2199, originalPrice: 2999, stock: 8, attributes: { Size: 'UK 8' } },
      { id: 'v10-9', name: 'UK 9 (EU 43)', sku: 'RM-MOJ-09', price: 2199, originalPrice: 2999, stock: 6, attributes: { Size: 'UK 9' } },
      { id: 'v10-10', name: 'UK 10 (EU 44)', sku: 'RM-MOJ-10', price: 2199, originalPrice: 2999, stock: 3, attributes: { Size: 'UK 10' } }
    ],
    seoTitle: 'Genuine Leather Rajasthani Mojari Shoes | Royale Jodhpur on Ecomma',
    seoDescription: 'Handmade camel leather mojaris for men. Traditional Jodhpur craftsmanship with padded sole comfort and COD.',
    aiScore: 93,
    returnPolicyDays: 7,
    weightGrams: 550,
    createdAt: '2025-01-11',
    isTrending: true
  },
  {
    id: 'prod-11',
    sellerId: 'seller-4',
    sellerName: 'Royale Jodhpur Mojari',
    sellerRating: 4.79,
    title: 'Emerald Velvet Zardozi Bridal Jutti with Pearls',
    slug: 'emerald-velvet-zardozi-bridal-jutti',
    description: 'Regal bridal jutti crafted in deep emerald micro-velvet, embellished with golden dabka wire, sequins, and mini seed pearls. Soft leather lining prevents shoe bites.',
    bulletFeatures: [
      'Delicate hand-embroidered Zardozi bullion wire work',
      'Cushioned leather insole for 8+ hour wedding comfort',
      'Curved ergonomic back seam',
      'Delivered in satin dust pouch with extra stones'
    ],
    category: 'Handcrafted Footwear & Juttis',
    subCategory: 'Womens Juttis',
    tags: ['bridal jutti', 'zardozi', 'velvet', 'wedding footwear', 'emerald'],
    images: [
      createCraftSvg('#081C15', '#2D6A4F', 'Zardozi Jutti', 'Footwear')
    ],
    price: 2499,
    originalPrice: 3200,
    stock: 18,
    isCodAvailable: true,
    status: 'active',
    rating: 4.91,
    reviewCount: 54,
    variants: [
      { id: 'v11-37', name: 'Size 37 (UK 4)', sku: 'RM-ZAR-37', price: 2499, originalPrice: 3200, stock: 4, attributes: { Size: '37' } },
      { id: 'v11-38', name: 'Size 38 (UK 5)', sku: 'RM-ZAR-38', price: 2499, originalPrice: 3200, stock: 6, attributes: { Size: '38' } },
      { id: 'v11-39', name: 'Size 39 (UK 6)', sku: 'RM-ZAR-39', price: 2499, originalPrice: 3200, stock: 5, attributes: { Size: '39' } },
      { id: 'v11-40', name: 'Size 40 (UK 7)', sku: 'RM-ZAR-40', price: 2499, originalPrice: 3200, stock: 3, attributes: { Size: '40' } }
    ],
    returnPolicyDays: 7,
    weightGrams: 420,
    createdAt: '2025-01-19'
  },

  // Category: Fine Silver & Temple Jewellery
  {
    id: 'prod-12',
    sellerId: 'seller-1',
    sellerName: 'Kavita Silks & Crafts',
    sellerRating: 4.88,
    title: '92.5 Sterling Silver Antique Oxidized Jhumkas with Ruby Drops',
    slug: '925-sterling-silver-oxidized-jhumkas-ruby',
    description: 'Hallmarked 925 silver statement jhumkas featuring intricate peacocks on the stud and a filigree bell lined with synthetic ruby briolettes and tiny pearl droplets.',
    bulletFeatures: [
      'BIS 925 stamped sterling silver guarantee',
      'Artisanal oxidized antique patina that highlights deep carvings',
      'Secure push-back closure with wide support washers',
      'Weight: 26 grams per pair; hypoallergenic nickel-free silver'
    ],
    category: 'Fine Silver & Temple Jewellery',
    subCategory: 'Earrings & Jhumkas',
    tags: ['silver jhumka', '925 silver', 'oxidized', 'temple jewellery', 'ruby'],
    images: [
      createCraftSvg('#1F2421', '#495057', 'Silver Jhumka', 'Jewellery'),
      createCraftSvg('#212529', '#6C757D', 'Hallmark Detail', 'Quality')
    ],
    price: 3299,
    originalPrice: 4200,
    stock: 16,
    isCodAvailable: true,
    status: 'active',
    rating: 4.89,
    reviewCount: 82,
    variants: [
      { id: 'v12-1', name: 'Ruby Red Drops', sku: 'KS-JHM-RUBY', price: 3299, originalPrice: 4200, stock: 16, attributes: { Color: 'Ruby Red' } }
    ],
    seoTitle: '925 Sterling Silver Antique Jhumka Earrings | Ecomma',
    seoDescription: 'Handcrafted hallmarked 925 oxidized silver jhumkas. Pure silver temple jewelry delivered securely with BIS certificate.',
    aiScore: 94,
    returnPolicyDays: 7,
    weightGrams: 26,
    createdAt: '2025-01-09',
    isTrending: true,
    isBestseller: true
  },
  {
    id: 'prod-13',
    sellerId: 'seller-1',
    sellerName: 'Kavita Silks & Crafts',
    sellerRating: 4.88,
    title: 'Goddess Lakshmi Temple Choker Necklace in 925 Silver',
    slug: 'goddess-lakshmi-temple-choker-925-silver',
    description: 'Traditional South Indian temple jewelry design crafted in pure sterling silver with 24k gold leaf micro-plating (Pachhi work). Features carved Lakshmi flanked by dancing apsaras.',
    bulletFeatures: [
      'Pure 92.5 Sterling silver with 1-micron gold wash',
      'Adjustable hand-braided Zari Dori string',
      'Kemp stone insets with emerald and ruby tones',
      'Includes tamper-proof authenticity seal'
    ],
    category: 'Fine Silver & Temple Jewellery',
    subCategory: 'Necklaces & Chokers',
    tags: ['temple jewelry', 'choker', 'lakshmi', 'gold plated silver', 'kemp'],
    images: [
      createCraftSvg('#3A1C28', '#A26769', 'Temple Choker', 'Jewellery')
    ],
    price: 5499,
    originalPrice: 7200,
    stock: 9,
    isCodAvailable: false,
    status: 'active',
    rating: 4.96,
    reviewCount: 37,
    variants: [
      { id: 'v13-1', name: 'Gold Wash (Pachhi)', sku: 'KS-CHK-01', price: 5499, originalPrice: 7200, stock: 9, attributes: { Finish: 'Gold Plated Silver' } }
    ],
    returnPolicyDays: 7,
    weightGrams: 58,
    createdAt: '2025-01-15'
  },

  // Category: Organic Spices & Gourmet
  {
    id: 'prod-14',
    sellerId: 'seller-5',
    sellerName: 'Malabar Spice Trove',
    sellerRating: 4.94,
    title: 'Single-Estate Wayanad Tellicherry Extra Bold Black Pepper (250g)',
    slug: 'wayanad-tellicherry-extra-bold-black-pepper',
    description: 'Hand-picked berry by berry at 3,200ft elevation in Wayanad, Kerala. Tellicherry Garbled Special Extra Bold (TGSEB) berries measuring 4.75mm+, yielding high piperine content, floral woodiness, and deep heat.',
    bulletFeatures: [
      'Grade: TGSEB (Top 10% harvest size)',
      'Sun-dried naturally on bamboo mats with zero chemical washes',
      'Packed in zip-lock airtight aroma-lock pouch with degassing valve',
      'Direct farm-to-table traceability with harvest batch QR code'
    ],
    category: 'Organic Spices & Gourmet',
    subCategory: 'Whole Spices',
    tags: ['black pepper', 'tellicherry', 'wayanad', 'organic spice', 'gourmet pepper', 'kerala'],
    images: [
      createCraftSvg('#1A1C20', '#3E424B', 'Tellicherry Pepper', 'Spices'),
      createCraftSvg('#252830', '#565B68', 'Pepper Berries', 'Macro')
    ],
    price: 499,
    originalPrice: 650,
    stock: 80,
    isCodAvailable: true,
    status: 'active',
    rating: 4.97,
    reviewCount: 210,
    variants: [
      { id: 'v14-250', name: '250g Pouch', sku: 'MST-PEP-250', price: 499, originalPrice: 650, stock: 50, attributes: { Pack: '250g' } },
      { id: 'v14-500', name: '500g Value Pack', sku: 'MST-PEP-500', price: 899, originalPrice: 1200, stock: 30, attributes: { Pack: '500g' } }
    ],
    seoTitle: 'Buy Authentic Wayanad Tellicherry Black Pepper Online | Ecomma',
    seoDescription: 'Direct farm-fresh TGSEB bold black pepper from Kerala hills. High piperine, aroma-packed whole peppercorns on Ecomma.',
    aiScore: 98,
    returnPolicyDays: 7,
    weightGrams: 280,
    createdAt: '2025-01-02',
    isTrending: true,
    isBestseller: true
  },
  {
    id: 'prod-15',
    sellerId: 'seller-5',
    sellerName: 'Malabar Spice Trove',
    sellerRating: 4.94,
    title: 'Grade A1 Kashmiri Mogra Saffron Threads (2 Grams)',
    slug: 'grade-a1-kashmiri-mogra-saffron-2g',
    description: 'Pure Mongra Lacha saffron stigmas cultivated in the violet flower beds of Pampore, Kashmir. Rich crocin levels ensure deep sunset red infusion and delicate honey aroma.',
    bulletFeatures: [
      'Certified GI-Tagged Pampore Kashmiri Saffron',
      'All-red stigmas without yellow style threads',
      'Packed in acrylic moisture-tight box with seal',
      'Ideal for festive sweets, biryanis, milk, and skin rituals'
    ],
    category: 'Organic Spices & Gourmet',
    subCategory: 'Exotic Spices',
    tags: ['saffron', 'kesar', 'kashmiri saffron', 'mogra', 'pampore'],
    images: [
      createCraftSvg('#780000', '#C1121F', 'Kashmiri Saffron', 'Spices')
    ],
    price: 799,
    originalPrice: 1100,
    stock: 35,
    isCodAvailable: true,
    status: 'active',
    rating: 4.92,
    reviewCount: 118,
    variants: [
      { id: 'v15-1', name: '2 Gram Pack', sku: 'MST-SAF-02', price: 799, originalPrice: 1100, stock: 25, attributes: { Weight: '2g' } },
      { id: 'v15-5', name: '5 Gram Tin', sku: 'MST-SAF-05', price: 1799, originalPrice: 2400, stock: 10, attributes: { Weight: '5g' } }
    ],
    returnPolicyDays: 7,
    weightGrams: 50,
    createdAt: '2025-01-07',
    isTrending: true
  },
  {
    id: 'prod-16',
    sellerId: 'seller-5',
    sellerName: 'Malabar Spice Trove',
    sellerRating: 4.94,
    title: 'Whole Green Cardamom Pods - Alleppey Extra Bold 8mm (150g)',
    slug: 'alleppey-green-cardamom-extra-bold',
    description: 'Vibrant emerald green cardamom pods grown under rainforest canopy in Idukki. Packed with aromatic oils that release sweet citrus and eucalyptus fragrance.',
    bulletFeatures: [
      'Hand-graded 8mm+ Jumbo pods',
      'Natural electric green color without artificial tinting',
      'Resealable foil pouch for long-lasting aroma'
    ],
    category: 'Organic Spices & Gourmet',
    subCategory: 'Whole Spices',
    tags: ['cardamom', 'elaichi', 'alleppey green', 'kerala spice'],
    images: [
      createCraftSvg('#2D6A4F', '#74C69D', 'Green Cardamom', 'Spices')
    ],
    price: 549,
    originalPrice: 720,
    stock: 45,
    isCodAvailable: true,
    status: 'active',
    rating: 4.88,
    reviewCount: 68,
    variants: [
      { id: 'v16-1', name: '150g Pouch', sku: 'MST-CAR-150', price: 549, originalPrice: 720, stock: 45, attributes: { Weight: '150g' } }
    ],
    returnPolicyDays: 7,
    weightGrams: 170,
    createdAt: '2025-01-21'
  },

  // Category: Home Linen & Kantha Quilts
  {
    id: 'prod-17',
    sellerId: 'seller-1',
    sellerName: 'Kavita Silks & Crafts',
    sellerRating: 4.88,
    title: 'Reversible Jaipuri Hand-Block Printed Cotton Razai Quilt',
    slug: 'reversible-jaipuri-hand-block-printed-cotton-razai',
    description: 'Lightweight cloud-soft winter quilt filled with 100% carded surgical cotton. Hand-stitched by Sanganer block printers with delicate Persian floral vines on one side and geometric Chevron on reverse.',
    bulletFeatures: [
      '100% fine voile cotton exterior, breathable and soft against skin',
      'Filled with 1.2kg triple-carded virgin cotton batting',
      'King Size: 90 x 108 inches (fits double bed with drape)',
      'Fine Kantha hand-quilted channels preventing clump formation'
    ],
    category: 'Home Linen & Kantha Quilts',
    subCategory: 'Quilts & Blankets',
    tags: ['jaipuri razai', 'cotton quilt', 'block print', 'bedding', 'reversible quilt'],
    images: [
      createCraftSvg('#005F73', '#0A9396', 'Jaipuri Razai', 'Home Linen'),
      createCraftSvg('#94D2BD', '#E9D8A6', 'Print Pattern', 'Textile')
    ],
    price: 3499,
    originalPrice: 4800,
    stock: 14,
    isCodAvailable: true,
    status: 'active',
    rating: 4.87,
    reviewCount: 92,
    variants: [
      { id: 'v17-king', name: 'King Size (90x108")', sku: 'KS-RAZ-KNG', price: 3499, originalPrice: 4800, stock: 10, attributes: { Size: 'King' } },
      { id: 'v17-queen', name: 'Queen Size (90x90")', sku: 'KS-RAZ-QNN', price: 2999, originalPrice: 3999, stock: 4, attributes: { Size: 'Queen' } }
    ],
    seoTitle: 'Jaipuri Hand Block Printed Cotton Razai Quilt | Ecomma',
    seoDescription: 'Authentic reversible cotton quilt hand-printed in Jaipur. Ultra-light, warm, and breathable bedding on Ecomma.',
    aiScore: 95,
    returnPolicyDays: 7,
    weightGrams: 1600,
    createdAt: '2025-01-04',
    isTrending: true
  },
  {
    id: 'prod-18',
    sellerId: 'seller-1',
    sellerName: 'Kavita Silks & Crafts',
    sellerRating: 4.88,
    title: 'Handloom Cotton Indigo Cushion Covers (Set of 5, 16x16")',
    slug: 'handloom-cotton-indigo-cushion-covers-set-of-5',
    description: 'Set of five coordinating throw pillow covers made from hand-spun Khadi cotton with mud-resist Dabu prints and natural wooden button closures.',
    bulletFeatures: [
      '5 distinct hand-blocked complementary patterns',
      'Hidden zipper back closure with flange trim',
      'Durable thick upholstery-grade 280 GSM cotton'
    ],
    category: 'Home Linen & Kantha Quilts',
    subCategory: 'Cushions & Throws',
    tags: ['cushion covers', 'indigo', 'khadi', 'living room decor', 'block print'],
    images: [
      createCraftSvg('#1D3557', '#457B9D', 'Cushion Covers Set', 'Home Linen')
    ],
    price: 1299,
    originalPrice: 1800,
    stock: 25,
    isCodAvailable: true,
    status: 'active',
    rating: 4.79,
    reviewCount: 48,
    variants: [
      { id: 'v18-1', name: 'Set of 5 (16x16")', sku: 'KS-CSH-05', price: 1299, originalPrice: 1800, stock: 25, attributes: { Set: 'Set of 5' } }
    ],
    returnPolicyDays: 7,
    weightGrams: 650,
    createdAt: '2025-01-23'
  },

  // Category: Contemporary Studio Pottery
  {
    id: 'prod-19',
    sellerId: 'seller-6',
    sellerName: 'Khurja Studio Pottery Co.',
    sellerRating: 4.81,
    title: 'Speckled Sandstone Stoneware Ceramic Dinner Set (16 Pieces)',
    slug: 'speckled-sandstone-stoneware-ceramic-dinner-set',
    description: 'Wheel-thrown high-fire stoneware dinner set featuring a warm raw clay exterior and food-safe matte cream glaze interior. Resistant to chipping, oven-safe up to 220°C, microwave and dishwasher safe.',
    bulletFeatures: [
      'Includes 4 Dinner Plates (10.5"), 4 Salad Plates (8"), 4 Katori Bowls, 4 Mugs (320ml)',
      'Fired at 1260°C for exceptional durability and non-porous vitrification',
      'Lead-free, cadmium-free non-toxic glaze',
      'Subtle ergonomic lip and stackable rim design'
    ],
    category: 'Contemporary Studio Pottery',
    subCategory: 'Dinnerware',
    tags: ['stoneware', 'ceramic dinner set', 'khurja pottery', 'studio pottery', 'tableware', 'minimalist'],
    images: [
      createCraftSvg('#3D3A37', '#8A817C', 'Stoneware Dinner Set', 'Pottery'),
      createCraftSvg('#4F4B47', '#BCB8B1', 'Plate Profile', 'Ceramics')
    ],
    price: 4999,
    originalPrice: 6800,
    stock: 10,
    isCodAvailable: false,
    status: 'active',
    rating: 4.86,
    reviewCount: 41,
    variants: [
      { id: 'v19-1', name: '16 Piece Service for 4', sku: 'KSP-DIN-16', price: 4999, originalPrice: 6800, stock: 10, attributes: { Pieces: '16 Pieces' } }
    ],
    seoTitle: 'Handmade Stoneware Ceramic Dinner Set | Khurja Studio Pottery',
    seoDescription: 'Handcrafted ceramic dinner set for 4. Microwave & dishwasher safe studio pottery made by Khurja artisans on Ecomma.',
    aiScore: 94,
    returnPolicyDays: 7,
    weightGrams: 6800,
    createdAt: '2025-01-12',
    isTrending: true
  },
  {
    id: 'prod-20',
    sellerId: 'seller-6',
    sellerName: 'Khurja Studio Pottery Co.',
    sellerRating: 4.81,
    title: 'Ribbed Earth Terra Chai Kulhad Set (Set of 6, 180ml)',
    slug: 'ribbed-earth-terra-chai-kulhad-set-of-6',
    description: 'Modern interpretation of the timeless Indian railway kulhad. Crafted in durable reusable stoneware that retains heat and gives tea an earthy note without single-use waste.',
    bulletFeatures: [
      'Set of 6 handcrafted ribbed cups (180ml capacity each)',
      'Unglazed tactile exterior with glossy glazed hygiene interior',
      'Comfortable finger groove grip'
    ],
    category: 'Contemporary Studio Pottery',
    subCategory: 'Drinkware & Mugs',
    tags: ['chai kulhad', 'stoneware mugs', 'pottery cup', 'tea set', 'khurja'],
    images: [
      createCraftSvg('#6F4E37', '#A67B5B', 'Chai Kulhad Set', 'Pottery')
    ],
    price: 899,
    originalPrice: 1200,
    stock: 35,
    isCodAvailable: true,
    status: 'active',
    rating: 4.84,
    reviewCount: 62,
    variants: [
      { id: 'v20-1', name: 'Set of 6 (180ml)', sku: 'KSP-KUL-06', price: 899, originalPrice: 1200, stock: 35, attributes: { Set: 'Set of 6' } }
    ],
    returnPolicyDays: 7,
    weightGrams: 1100,
    createdAt: '2025-01-17'
  }
];

export const INITIAL_USERS: User[] = [
  {
    id: 'user-buyer-1',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@example.in',
    role: 'buyer',
    phone: '+91 98112 34567',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    addresses: [
      {
        id: 'addr-aarav-1',
        name: 'Aarav Sharma',
        street: 'Flat 402, Green Glen Layout, Bellandur',
        city: 'Bengaluru',
        state: 'Karnataka',
        pincode: '560103',
        phone: '+91 98112 34567',
        isDefault: true,
        type: 'home'
      },
      {
        id: 'addr-aarav-2',
        name: 'Aarav Sharma (Office)',
        street: 'WeWork Galaxy, 43 Residency Road',
        city: 'Bengaluru',
        state: 'Karnataka',
        pincode: '560025',
        phone: '+91 98112 34567',
        isDefault: false,
        type: 'work'
      }
    ]
  },
  {
    id: 'user-seller-1',
    name: 'Kavita Maheshwari',
    email: 'kavita@kavitacrafts.in',
    role: 'seller',
    phone: '+91 98261 44521',
    sellerId: 'seller-1',
    addresses: [
      {
        id: 'addr-kavita-1',
        name: 'Kavita Maheshwari',
        street: '14 Bunkar Galli, Near Rajwada',
        city: 'Chanderi',
        state: 'Madhya Pradesh',
        pincode: '473446',
        phone: '+91 98261 44521',
        isDefault: true,
        type: 'work'
      }
    ]
  },
  {
    id: 'user-admin-1',
    name: 'Vikram Sengupta',
    email: 'admin@ecomma.in',
    role: 'admin',
    phone: '+91 98300 11223',
    addresses: [
      {
        id: 'addr-admin-1',
        name: 'Ecomma HQ Operations',
        street: 'Level 8, Prestige Tech Park, Marathahalli',
        city: 'Bengaluru',
        state: 'Karnataka',
        pincode: '560103',
        phone: '+91 98300 11223',
        isDefault: true,
        type: 'work'
      }
    ]
  }
];

export const INITIAL_COUPONS: Coupon[] = [
  {
    id: 'coup-1',
    code: 'NAMASTE10',
    discountType: 'percentage',
    discountValue: 10,
    minOrderValue: 999,
    maxDiscount: 500,
    validUntil: '2026-12-31',
    description: '10% off up to ₹500 on all artisanal handlooms & craft items.',
    isActive: true
  },
  {
    id: 'coup-2',
    code: 'FESTIVE20',
    discountType: 'percentage',
    discountValue: 20,
    minOrderValue: 2999,
    maxDiscount: 1200,
    validUntil: '2026-12-31',
    description: 'Flat 20% off on orders above ₹2,999 during the festive season.',
    isActive: true
  },
  {
    id: 'coup-3',
    code: 'FIRSTBUY',
    discountType: 'flat',
    discountValue: 250,
    minOrderValue: 1499,
    validUntil: '2026-12-31',
    description: 'Flat ₹250 off on your very first order at Ecomma.',
    isActive: true
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-1001',
    orderNumber: 'ECM-2025-8812',
    buyerId: 'user-buyer-1',
    buyerName: 'Aarav Sharma',
    buyerEmail: 'aarav.sharma@example.in',
    buyerPhone: '+91 98112 34567',
    shippingAddress: {
      id: 'addr-aarav-1',
      name: 'Aarav Sharma',
      street: 'Flat 402, Green Glen Layout, Bellandur',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560103',
      phone: '+91 98112 34567',
      type: 'home'
    },
    subOrders: [
      {
        id: 'sub-1001-1',
        orderId: 'ord-1001',
        sellerId: 'seller-1',
        sellerName: 'Kavita Silks & Crafts',
        items: [
          {
            id: 'item-1001-1',
            productId: 'prod-1',
            productTitle: 'Pure Chanderi Silk Zari Saree - Saffron Gold & Lotus Pink',
            variantId: 'v1-1',
            variantName: 'Standard 6.3m (with blouse)',
            price: 4899,
            originalPrice: 6500,
            quantity: 1,
            image: createCraftSvg('#9E2A2B', '#E09F3E', 'Chanderi Saree', 'Ethnic Wear'),
            sellerId: 'seller-1',
            sellerName: 'Kavita Silks & Crafts',
            isCodAvailable: true,
            stock: 12
          }
        ],
        subtotal: 4899,
        shippingFee: 0,
        commission: 391.92,
        tax: 244.95,
        netPayout: 4262.13,
        status: 'shipped',
        shipment: {
          id: 'ship-1001',
          subOrderId: 'sub-1001-1',
          courierName: 'Delhivery Surface Pro',
          awbNumber: 'DL-8491823-IN',
          estimatedDelivery: 'Tomorrow, by 7 PM',
          events: [
            { timestamp: '2025-01-28 09:30 AM', status: 'Order Placed', location: 'Bengaluru Hub', description: 'Customer confirmed order online via UPI.' },
            { timestamp: '2025-01-28 02:15 PM', status: 'Packed & Invoiced', location: 'Chanderi Workshop', description: 'Seller packed package with tamper-evident seal.' },
            { timestamp: '2025-01-29 11:00 AM', status: 'In Transit', location: 'Bhopal Central Hub', description: 'Dispatched towards Bengaluru distribution facility.' }
          ]
        },
        payoutStatus: 'pending'
      }
    ],
    totalAmount: 4899,
    discountAmount: 489.9,
    shippingTotal: 0,
    grandTotal: 4409.1,
    paymentMethod: 'ONLINE',
    paymentStatus: 'PAID',
    overallStatus: 'shipped',
    couponCode: 'NAMASTE10',
    createdAt: '2025-01-28T09:30:00Z'
  },
  {
    id: 'ord-1002',
    orderNumber: 'ECM-2025-8794',
    buyerId: 'user-buyer-1',
    buyerName: 'Aarav Sharma',
    buyerEmail: 'aarav.sharma@example.in',
    buyerPhone: '+91 98112 34567',
    shippingAddress: {
      id: 'addr-aarav-1',
      name: 'Aarav Sharma',
      street: 'Flat 402, Green Glen Layout, Bellandur',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560103',
      phone: '+91 98112 34567',
      type: 'home'
    },
    subOrders: [
      {
        id: 'sub-1002-1',
        orderId: 'ord-1002',
        sellerId: 'seller-5',
        sellerName: 'Malabar Spice Trove',
        items: [
          {
            id: 'item-1002-1',
            productId: 'prod-14',
            productTitle: 'Single-Estate Wayanad Tellicherry Extra Bold Black Pepper (250g)',
            variantId: 'v14-250',
            variantName: '250g Pouch',
            price: 499,
            originalPrice: 650,
            quantity: 2,
            image: createCraftSvg('#1A1C20', '#3E424B', 'Tellicherry Pepper', 'Spices'),
            sellerId: 'seller-5',
            sellerName: 'Malabar Spice Trove',
            isCodAvailable: true,
            stock: 80
          }
        ],
        subtotal: 998,
        shippingFee: 50,
        commission: 79.84,
        tax: 49.9,
        netPayout: 918.26,
        status: 'delivered',
        shipment: {
          id: 'ship-1002',
          subOrderId: 'sub-1002-1',
          courierName: 'BlueDart Air',
          awbNumber: 'BD-918234-IN',
          estimatedDelivery: 'Delivered on Jan 24',
          events: [
            { timestamp: '2025-01-21 11:20 AM', status: 'Order Placed', location: 'Online', description: 'Cash on Delivery order verified.' },
            { timestamp: '2025-01-22 03:00 PM', status: 'Packed', location: 'Wayanad Estate', description: 'Assigned to BlueDart.' },
            { timestamp: '2025-01-23 08:45 AM', status: 'Out for Delivery', location: 'Bengaluru Outer Hub', description: 'Agent Ramesh on delivery route.' },
            { timestamp: '2025-01-24 02:10 PM', status: 'Delivered', location: 'Bengaluru', description: 'Handed over to recipient. ₹1,048 Cash collected.' }
          ]
        },
        payoutStatus: 'settled'
      }
    ],
    totalAmount: 998,
    discountAmount: 0,
    shippingTotal: 50,
    grandTotal: 1048,
    paymentMethod: 'COD',
    paymentStatus: 'PAID',
    overallStatus: 'delivered',
    createdAt: '2025-01-21T11:20:00Z'
  },
  {
    id: 'ord-1003',
    orderNumber: 'ECM-2025-8850',
    buyerId: 'user-buyer-1',
    buyerName: 'Aarav Sharma',
    buyerEmail: 'aarav.sharma@example.in',
    buyerPhone: '+91 98112 34567',
    shippingAddress: {
      id: 'addr-aarav-1',
      name: 'Aarav Sharma',
      street: 'Flat 402, Green Glen Layout, Bellandur',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560103',
      phone: '+91 98112 34567',
      type: 'home'
    },
    subOrders: [
      {
        id: 'sub-1003-1',
        orderId: 'ord-1003',
        sellerId: 'seller-2',
        sellerName: 'Dhokra Bastar Heritage',
        items: [
          {
            id: 'item-1003-1',
            productId: 'prod-4',
            productTitle: 'Tribal Lost-Wax Dhokra Dancing Figurine (12 Inch)',
            variantId: 'v4-1',
            variantName: 'Antique Bronze Finish (12")',
            price: 3499,
            originalPrice: 4500,
            quantity: 1,
            image: createCraftSvg('#3D261D', '#8C5A3C', 'Dhokra Figurine', 'Sculpture'),
            sellerId: 'seller-2',
            sellerName: 'Dhokra Bastar Heritage',
            isCodAvailable: true,
            stock: 8
          }
        ],
        subtotal: 3499,
        shippingFee: 0,
        commission: 279.92,
        tax: 174.95,
        netPayout: 3044.13,
        status: 'packed',
        shipment: {
          id: 'ship-1003',
          subOrderId: 'sub-1003-1',
          courierName: 'Shadowfax Express',
          awbNumber: 'SF-771924-IN',
          estimatedDelivery: 'Feb 03, 2025',
          events: [
            { timestamp: '2025-01-29 04:15 PM', status: 'Order Placed', location: 'Online', description: 'Order confirmed with online payment.' },
            { timestamp: '2025-01-30 10:00 AM', status: 'Packed', location: 'Kondagaon Workshop', description: 'Shipping label generated and courier pickup requested.' }
          ]
        },
        payoutStatus: 'pending'
      }
    ],
    totalAmount: 3499,
    discountAmount: 250,
    shippingTotal: 0,
    grandTotal: 3249,
    paymentMethod: 'ONLINE',
    paymentStatus: 'PAID',
    overallStatus: 'packed',
    couponCode: 'FIRSTBUY',
    createdAt: '2025-01-29T16:15:00Z'
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    productId: 'prod-1',
    buyerId: 'user-rev-1',
    buyerName: 'Priyanka Sen',
    buyerAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80',
    rating: 5,
    title: 'Breathtaking weave, pure royal elegance!',
    comment: 'The dual-tone saffron and lotus pink glow under ambient light is mesmerizing. The zari is soft and doesn’t scratch at all. Arrived in a lovely reusable cotton potli bag.',
    date: '2025-01-22',
    verifiedPurchase: true,
    helpfulCount: 24
  },
  {
    id: 'rev-2',
    productId: 'prod-1',
    buyerId: 'user-rev-2',
    buyerName: 'Ananya Deshmukh',
    buyerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
    rating: 5,
    title: 'Authentic Chanderi silk mark certified',
    comment: 'I verified the Silk Mark tag online and it checked out perfectly. Wore it to my cousin’s sangeet and received compliments throughout the night.',
    date: '2025-01-19',
    verifiedPurchase: true,
    helpfulCount: 18
  },
  {
    id: 'rev-3',
    productId: 'prod-4',
    buyerId: 'user-rev-3',
    buyerName: 'Dr. Kabir Roy',
    buyerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
    rating: 5,
    title: 'Museum grade bronze craft in my living room',
    comment: 'The weight and the subtle beeswax smell confirms authentic Bastar lost-wax methodology. Superbly packed with multiple layers of corrugated bubble wrap.',
    date: '2025-01-25',
    verifiedPurchase: true,
    helpfulCount: 31
  }
];
