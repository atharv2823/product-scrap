export interface PlatformDeal {
  id: string;
  platform: 'Amazon' | 'Walmart' | 'Best Buy' | 'eBay' | 'Target' | 'AliExpress' | 'B&H Photo' | 'Flipkart';
  logoColor: string;
  sellerName: string;
  sellerRating: number;
  sellerReviewsCount: number;
  price: number;
  originalPrice: number;
  currency: string;
  inStock: boolean;
  stockCount?: number;
  shipping: {
    type: 'Prime Next-Day' | 'Free 2-Day' | 'Express Delivery' | 'Standard Free' | '$4.99 Standard';
    cost: number;
    estimatedDays: string;
  };
  condition: 'Brand New' | 'Open Box - Like New' | 'Refurbished (Certified)';
  returnPolicy: string;
  dealTag?: 'Lowest Price' | 'Best Value' | 'Fastest Delivery' | 'Certified Refurbished';
  couponCode?: string;
  couponDiscount?: string;
  productUrl: string;
  priceHistory: { date: string; price: number }[];
}

export interface AlternativeProduct {
  id: string;
  title: string;
  category: string;
  brand: string;
  imageUrl: string;
  platform: string;
  price: number;
  originalPrice: number;
  badge: 'Best Value' | 'Budget Alternative' | 'Pro Upgrade' | 'Certified Pre-Owned';
  similarityScore: number;
  keyDifference: string;
  rating: number;
  reviewsCount: number;
  productUrl: string;
}

export interface ProductPreset {
  id: string;
  name: string;
  tagline: string;
  category: 'Electronics' | 'Audio' | 'Footwear' | 'Computing' | 'Gaming' | 'Photography' | 'Beauty';
  brand: string;
  model: string;
  sku: string;
  confidenceScore: number;
  imageUrl: string;
  specs: { [key: string]: string };
  deals: PlatformDeal[];
  alternatives: AlternativeProduct[];
  priceAnalytics: {
    lowestPrice: number;
    highestPrice: number;
    averagePrice: number;
    allTimeLow: number;
    priceTrend: 'dropping' | 'stable' | 'rising';
    savingsPotential: number;
  };
}

export const PRODUCT_PRESETS: ProductPreset[] = [
  {
    id: 'sony-wh1000xm5',
    name: 'Sony WH-1000XM5 Wireless Noise-Canceling Headphones',
    tagline: 'Industry-leading noise cancellation with 30-hour battery life & Auto NC Optimizer',
    category: 'Audio',
    brand: 'Sony',
    model: 'WH-1000XM5 / Silver',
    sku: 'SNY-WH1000XM5-SLV',
    confidenceScore: 98.6,
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
    specs: {
      'Driver Unit': '30mm Carbon Fiber',
      'Battery Life': '30 Hours (ANC On)',
      'Connectivity': 'Bluetooth 5.2 / LDAC / 3.5mm',
      'Weight': '250g Lightweight Design',
      'Microphones': '8 Mics with AI Beamforming'
    },
    priceAnalytics: {
      lowestPrice: 328.00,
      highestPrice: 399.99,
      averagePrice: 369.00,
      allTimeLow: 319.99,
      priceTrend: 'dropping',
      savingsPotential: 71.99
    },
    deals: [
      {
        id: 'deal-walmart-xm5',
        platform: 'Walmart',
        logoColor: '#0071dc',
        sellerName: 'Walmart Official Direct',
        sellerRating: 4.8,
        sellerReviewsCount: 14230,
        price: 328.00,
        originalPrice: 399.99,
        currency: 'USD',
        inStock: true,
        stockCount: 18,
        shipping: {
          type: 'Free 2-Day',
          cost: 0,
          estimatedDays: '2 Business Days'
        },
        condition: 'Brand New',
        returnPolicy: '30-Day Free Returns',
        dealTag: 'Lowest Price',
        couponCode: 'WALMARTTECH10',
        couponDiscount: 'Extra $10 OFF at checkout',
        productUrl: 'https://www.walmart.com',
        priceHistory: [
          { date: 'Aug 01', price: 399 },
          { date: 'Aug 08', price: 389 },
          { date: 'Aug 15', price: 369 },
          { date: 'Aug 22', price: 348 },
          { date: 'Sep 01', price: 328 }
        ]
      },
      {
        id: 'deal-amazon-xm5',
        platform: 'Amazon',
        logoColor: '#ff9900',
        sellerName: 'Amazon.com Fulfilled',
        sellerRating: 4.9,
        sellerReviewsCount: 52890,
        price: 348.00,
        originalPrice: 399.99,
        currency: 'USD',
        inStock: true,
        shipping: {
          type: 'Prime Next-Day',
          cost: 0,
          estimatedDays: 'Tomorrow, by 8 PM'
        },
        condition: 'Brand New',
        returnPolicy: '30-Day Amazon Guarantee',
        dealTag: 'Fastest Delivery',
        couponCode: 'PRIMEAUDIO',
        couponDiscount: '$15 instant coupon clip',
        productUrl: 'https://www.amazon.com',
        priceHistory: [
          { date: 'Aug 01', price: 399 },
          { date: 'Aug 08', price: 399 },
          { date: 'Aug 15', price: 378 },
          { date: 'Aug 22', price: 359 },
          { date: 'Sep 01', price: 348 }
        ]
      },
      {
        id: 'deal-bestbuy-xm5',
        platform: 'Best Buy',
        logoColor: '#0046be',
        sellerName: 'Best Buy Retailers',
        sellerRating: 4.9,
        sellerReviewsCount: 28450,
        price: 349.99,
        originalPrice: 399.99,
        currency: 'USD',
        inStock: true,
        stockCount: 9,
        shipping: {
          type: 'Free 2-Day',
          cost: 0,
          estimatedDays: '2 Business Days or In-Store Pickup Today'
        },
        condition: 'Brand New',
        returnPolicy: '15-Day Member Returns',
        dealTag: 'Best Value',
        productUrl: 'https://www.bestbuy.com',
        priceHistory: [
          { date: 'Aug 01', price: 399 },
          { date: 'Aug 08', price: 399 },
          { date: 'Aug 15', price: 379 },
          { date: 'Aug 22', price: 369 },
          { date: 'Sep 01', price: 349 }
        ]
      },
      {
        id: 'deal-bh-xm5',
        platform: 'B&H Photo',
        logoColor: '#df0000',
        sellerName: 'B&H Authorized Pro',
        sellerRating: 4.8,
        sellerReviewsCount: 19800,
        price: 358.00,
        originalPrice: 399.99,
        currency: 'USD',
        inStock: true,
        shipping: {
          type: 'Standard Free',
          cost: 0,
          estimatedDays: '3-4 Business Days'
        },
        condition: 'Brand New',
        returnPolicy: '30-Day Hassle Free',
        productUrl: 'https://www.bhphotovideo.com',
        priceHistory: [
          { date: 'Aug 01', price: 399 },
          { date: 'Aug 08', price: 389 },
          { date: 'Aug 15', price: 379 },
          { date: 'Aug 22', price: 369 },
          { date: 'Sep 01', price: 358 }
        ]
      },
      {
        id: 'deal-ebay-xm5',
        platform: 'eBay',
        logoColor: '#e53238',
        sellerName: 'ElectronicsTechHub (Top Rated Plus)',
        sellerRating: 4.95,
        sellerReviewsCount: 38900,
        price: 279.99,
        originalPrice: 399.99,
        currency: 'USD',
        inStock: true,
        stockCount: 4,
        shipping: {
          type: 'Standard Free',
          cost: 0,
          estimatedDays: '3-5 Business Days'
        },
        condition: 'Refurbished (Certified)',
        returnPolicy: '30-Day eBay Money Back',
        dealTag: 'Certified Refurbished',
        couponCode: 'REFURB15',
        couponDiscount: '15% Off eBay Certified Refurbished',
        productUrl: 'https://www.ebay.com',
        priceHistory: [
          { date: 'Aug 01', price: 320 },
          { date: 'Aug 08', price: 310 },
          { date: 'Aug 15', price: 299 },
          { date: 'Aug 22', price: 289 },
          { date: 'Sep 01', price: 279 }
        ]
      },
      {
        id: 'deal-target-xm5',
        platform: 'Target',
        logoColor: '#cc0000',
        sellerName: 'Target Corporation',
        sellerRating: 4.7,
        sellerReviewsCount: 8400,
        price: 399.99,
        originalPrice: 399.99,
        currency: 'USD',
        inStock: true,
        shipping: {
          type: 'Free 2-Day',
          cost: 0,
          estimatedDays: '2 Days via RedCard'
        },
        condition: 'Brand New',
        returnPolicy: '90-Day Extended Return',
        productUrl: 'https://www.target.com',
        priceHistory: [
          { date: 'Aug 01', price: 399 },
          { date: 'Aug 08', price: 399 },
          { date: 'Aug 15', price: 399 },
          { date: 'Aug 22', price: 399 },
          { date: 'Sep 01', price: 399 }
        ]
      }
    ],
    alternatives: [
      {
        id: 'alt-bose-qc-ultra',
        title: 'Bose QuietComfort Ultra Headphones',
        category: 'Audio',
        brand: 'Bose',
        imageUrl: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80',
        platform: 'Amazon',
        price: 379.00,
        originalPrice: 429.00,
        badge: 'Pro Upgrade',
        similarityScore: 94,
        keyDifference: 'Immersive Spatial Audio with superior physical folding hinge mechanism',
        rating: 4.8,
        reviewsCount: 8900,
        productUrl: 'https://www.amazon.com'
      },
      {
        id: 'alt-sony-xm4',
        title: 'Sony WH-1000XM4 Wireless Premium Headphones',
        category: 'Audio',
        brand: 'Sony',
        imageUrl: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&auto=format&fit=crop&q=80',
        platform: 'Best Buy',
        price: 248.00,
        originalPrice: 348.00,
        badge: 'Best Value',
        similarityScore: 91,
        keyDifference: 'Identical 30hr battery & foldable frame at $80 lower price point',
        rating: 4.9,
        reviewsCount: 42000,
        productUrl: 'https://www.bestbuy.com'
      },
      {
        id: 'alt-sennheiser-m4',
        title: 'Sennheiser Momentum 4 Wireless ANC Headphones',
        category: 'Audio',
        brand: 'Sennheiser',
        imageUrl: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&auto=format&fit=crop&q=80',
        platform: 'B&H Photo',
        price: 289.95,
        originalPrice: 379.95,
        badge: 'Budget Alternative',
        similarityScore: 89,
        keyDifference: 'Massive 60-Hour battery life & audiophile sound tuning profile',
        rating: 4.7,
        reviewsCount: 5600,
        productUrl: 'https://www.bhphotovideo.com'
      }
    ]
  },
  {
    id: 'macbook-pro-m3',
    name: 'Apple MacBook Pro 14" (M3 Pro Chip, 18GB Unified Memory, 512GB SSD)',
    tagline: 'Liquid Retina XDR display, up to 22 hours battery, Space Black finish',
    category: 'Computing',
    brand: 'Apple',
    model: 'MacBook Pro 14 (MRX33LL/A)',
    sku: 'APL-MBP14-M3P-BLK',
    confidenceScore: 99.2,
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80',
    specs: {
      'Processor': 'Apple M3 Pro (11-core CPU, 14-core GPU)',
      'Memory': '18GB Unified Memory',
      'Storage': '512GB Fast NVMe SSD',
      'Display': '14.2" Liquid Retina XDR (120Hz ProMotion)',
      'Ports': '3x Thunderbolt 4, HDMI, SDXC, MagSafe 3'
    },
    priceAnalytics: {
      lowestPrice: 1749.00,
      highestPrice: 1999.00,
      averagePrice: 1879.00,
      allTimeLow: 1699.00,
      priceTrend: 'dropping',
      savingsPotential: 250.00
    },
    deals: [
      {
        id: 'deal-bh-mbp',
        platform: 'B&H Photo',
        logoColor: '#df0000',
        sellerName: 'B&H Photo Video Authorized',
        sellerRating: 4.9,
        sellerReviewsCount: 31000,
        price: 1749.00,
        originalPrice: 1999.00,
        currency: 'USD',
        inStock: true,
        stockCount: 6,
        shipping: {
          type: 'Free 2-Day',
          cost: 0,
          estimatedDays: '2 Business Days'
        },
        condition: 'Brand New',
        returnPolicy: '30-Day Return Window',
        dealTag: 'Lowest Price',
        couponCode: 'BHAPPLSAVER',
        couponDiscount: '$50 Instant Promo Code',
        productUrl: 'https://www.bhphotovideo.com',
        priceHistory: [
          { date: 'Aug 01', price: 1999 },
          { date: 'Aug 08', price: 1949 },
          { date: 'Aug 15', price: 1899 },
          { date: 'Aug 22', price: 1799 },
          { date: 'Sep 01', price: 1749 }
        ]
      },
      {
        id: 'deal-amazon-mbp',
        platform: 'Amazon',
        logoColor: '#ff9900',
        sellerName: 'Apple Official Store on Amazon',
        sellerRating: 4.9,
        sellerReviewsCount: 89000,
        price: 1799.00,
        originalPrice: 1999.00,
        currency: 'USD',
        inStock: true,
        shipping: {
          type: 'Prime Next-Day',
          cost: 0,
          estimatedDays: 'Tomorrow Morning'
        },
        condition: 'Brand New',
        returnPolicy: 'Apple 1-Year Official Warranty',
        dealTag: 'Fastest Delivery',
        productUrl: 'https://www.amazon.com',
        priceHistory: [
          { date: 'Aug 01', price: 1999 },
          { date: 'Aug 08', price: 1999 },
          { date: 'Aug 15', price: 1899 },
          { date: 'Aug 22', price: 1849 },
          { date: 'Sep 01', price: 1799 }
        ]
      },
      {
        id: 'deal-bestbuy-mbp',
        platform: 'Best Buy',
        logoColor: '#0046be',
        sellerName: 'Best Buy Apple Authorized',
        sellerRating: 4.9,
        sellerReviewsCount: 45000,
        price: 1799.00,
        originalPrice: 1999.00,
        currency: 'USD',
        inStock: true,
        shipping: {
          type: 'Free 2-Day',
          cost: 0,
          estimatedDays: 'In-Store Pickup in 1hr'
        },
        condition: 'Brand New',
        returnPolicy: 'TotalTech 60-Day Return',
        dealTag: 'Best Value',
        productUrl: 'https://www.bestbuy.com',
        priceHistory: [
          { date: 'Aug 01', price: 1999 },
          { date: 'Aug 08', price: 1999 },
          { date: 'Aug 15', price: 1949 },
          { date: 'Aug 22', price: 1849 },
          { date: 'Sep 01', price: 1799 }
        ]
      },
      {
        id: 'deal-ebay-mbp',
        platform: 'eBay',
        logoColor: '#e53238',
        sellerName: 'Official Refurbished Outlet',
        sellerRating: 4.94,
        sellerReviewsCount: 15400,
        price: 1549.00,
        originalPrice: 1999.00,
        currency: 'USD',
        inStock: true,
        stockCount: 3,
        shipping: {
          type: 'Standard Free',
          cost: 0,
          estimatedDays: '3 Business Days'
        },
        condition: 'Refurbished (Certified)',
        returnPolicy: '2-Year Allstate Warranty Included',
        dealTag: 'Certified Refurbished',
        couponCode: 'EBAYMAC100',
        couponDiscount: '$100 off refurbished computing',
        productUrl: 'https://www.ebay.com',
        priceHistory: [
          { date: 'Aug 01', price: 1700 },
          { date: 'Aug 08', price: 1650 },
          { date: 'Aug 15', price: 1620 },
          { date: 'Aug 22', price: 1590 },
          { date: 'Sep 01', price: 1549 }
        ]
      }
    ],
    alternatives: [
      {
        id: 'alt-macbook-air-m3',
        title: 'Apple MacBook Air 15" (M3 Chip, 16GB RAM, 512GB SSD)',
        category: 'Computing',
        brand: 'Apple',
        imageUrl: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&auto=format&fit=crop&q=80',
        platform: 'Amazon',
        price: 1449.00,
        originalPrice: 1699.00,
        badge: 'Best Value',
        similarityScore: 92,
        keyDifference: 'Ultra-thin fanless chassis, larger 15.3" screen at $300 lower price',
        rating: 4.9,
        reviewsCount: 12400,
        productUrl: 'https://www.amazon.com'
      },
      {
        id: 'alt-dell-xps-14',
        title: 'Dell XPS 14 (Intel Core Ultra 7, 32GB RAM, OLED 3.2K)',
        category: 'Computing',
        brand: 'Dell',
        imageUrl: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&auto=format&fit=crop&q=80',
        platform: 'Best Buy',
        price: 1699.00,
        originalPrice: 1999.00,
        badge: 'Budget Alternative',
        similarityScore: 88,
        keyDifference: 'Touch OLED display, double RAM (32GB) with Windows 11 Pro ecosystem',
        rating: 4.6,
        reviewsCount: 3400,
        productUrl: 'https://www.bestbuy.com'
      }
    ]
  },
  {
    id: 'nike-air-max-plus',
    name: 'Nike Air Max Plus "Triple Black" Tuned 1 Sneakers',
    tagline: 'Iconic TPU cage design, revolutionary Tuned Air cushioning, breathable mesh',
    category: 'Footwear',
    brand: 'Nike',
    model: 'Air Max Plus TN (604133-050)',
    sku: 'NKE-AMP-TN-BLK',
    confidenceScore: 97.8,
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
    specs: {
      'Upper Material': 'Breathable Synthetic Mesh & TPU Ribs',
      'Midsole': 'Polyurethane with Visible Max Air Units',
      'Outsole': 'Durable Rubber Waffle Grip',
      'Colorway': 'Black / Anthracite / Metallic Silver',
      'Style Code': '604133-050'
    },
    priceAnalytics: {
      lowestPrice: 139.99,
      highestPrice: 185.00,
      averagePrice: 165.00,
      allTimeLow: 129.99,
      priceTrend: 'dropping',
      savingsPotential: 45.01
    },
    deals: [
      {
        id: 'deal-ebay-nike',
        platform: 'eBay',
        logoColor: '#e53238',
        sellerName: 'KicksAuthentic (Authenticity Guaranteed)',
        sellerRating: 4.98,
        sellerReviewsCount: 42000,
        price: 139.99,
        originalPrice: 185.00,
        currency: 'USD',
        inStock: true,
        stockCount: 5,
        shipping: {
          type: 'Standard Free',
          cost: 0,
          estimatedDays: '3-4 Business Days'
        },
        condition: 'Brand New',
        returnPolicy: 'eBay Authenticity Guarantee Inspection',
        dealTag: 'Lowest Price',
        couponCode: 'SNEAKERDROP10',
        couponDiscount: '10% off top footwear verified',
        productUrl: 'https://www.ebay.com',
        priceHistory: [
          { date: 'Aug 01', price: 185 },
          { date: 'Aug 08', price: 175 },
          { date: 'Aug 15', price: 160 },
          { date: 'Aug 22', price: 149 },
          { date: 'Sep 01', price: 139 }
        ]
      },
      {
        id: 'deal-walmart-nike',
        platform: 'Walmart',
        logoColor: '#0071dc',
        sellerName: 'SoleHub Marketplace Partner',
        sellerRating: 4.7,
        sellerReviewsCount: 3900,
        price: 149.00,
        originalPrice: 185.00,
        currency: 'USD',
        inStock: true,
        shipping: {
          type: 'Free 2-Day',
          cost: 0,
          estimatedDays: '2 Business Days'
        },
        condition: 'Brand New',
        returnPolicy: 'Free Store Returns',
        dealTag: 'Best Value',
        productUrl: 'https://www.walmart.com',
        priceHistory: [
          { date: 'Aug 01', price: 185 },
          { date: 'Aug 08', price: 179 },
          { date: 'Aug 15', price: 169 },
          { date: 'Aug 22', price: 159 },
          { date: 'Sep 01', price: 149 }
        ]
      },
      {
        id: 'deal-amazon-nike',
        platform: 'Amazon',
        logoColor: '#ff9900',
        sellerName: 'Premium Athletics Outlet',
        sellerRating: 4.8,
        sellerReviewsCount: 12000,
        price: 159.95,
        originalPrice: 185.00,
        currency: 'USD',
        inStock: true,
        shipping: {
          type: 'Prime Next-Day',
          cost: 0,
          estimatedDays: 'Tomorrow Afternoon'
        },
        condition: 'Brand New',
        returnPolicy: '30-Day Free Shoes Return',
        dealTag: 'Fastest Delivery',
        productUrl: 'https://www.amazon.com',
        priceHistory: [
          { date: 'Aug 01', price: 185 },
          { date: 'Aug 08', price: 185 },
          { date: 'Aug 15', price: 175 },
          { date: 'Aug 22', price: 169 },
          { date: 'Sep 01', price: 159 }
        ]
      }
    ],
    alternatives: [
      {
        id: 'alt-nike-air-max-97',
        title: 'Nike Air Max 97 OG "Silver Bullet"',
        category: 'Footwear',
        brand: 'Nike',
        imageUrl: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800&auto=format&fit=crop&q=80',
        platform: 'eBay',
        price: 145.00,
        originalPrice: 180.00,
        badge: 'Best Value',
        similarityScore: 93,
        keyDifference: 'Full-length air unit with bullet train aerodynamic ripple lines',
        rating: 4.8,
        reviewsCount: 16800,
        productUrl: 'https://www.ebay.com'
      },
      {
        id: 'alt-nike-air-vapormax',
        title: 'Nike Air VaporMax Plus Triple Black',
        category: 'Footwear',
        brand: 'Nike',
        imageUrl: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&auto=format&fit=crop&q=80',
        platform: 'Walmart',
        price: 175.00,
        originalPrice: 215.00,
        badge: 'Pro Upgrade',
        similarityScore: 96,
        keyDifference: 'Hybrid silhouette combining Air Max Plus upper with full VaporMax air pods',
        rating: 4.9,
        reviewsCount: 9200,
        productUrl: 'https://www.walmart.com'
      }
    ]
  },
  {
    id: 'ps5-pro-console',
    name: 'Sony PlayStation 5 Pro Console (2TB SSD, PSSR AI Upscaling, Wi-Fi 7)',
    tagline: 'Enhanced GPU with advanced ray tracing, PlayStation Spectral Super Resolution',
    category: 'Gaming',
    brand: 'Sony PlayStation',
    model: 'CFI-7000B01X',
    sku: 'SNY-PS5-PRO-2TB',
    confidenceScore: 99.5,
    imageUrl: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800&auto=format&fit=crop&q=80',
    specs: {
      'Storage': '2TB Custom High-Speed NVMe SSD',
      'AI Upscaling': 'PlayStation Spectral Super Resolution (PSSR)',
      'Ray Tracing': 'Advanced 3x RT Hardware Acceleration',
      'Networking': 'Wi-Fi 7 / Bluetooth 5.3 / 1Gbps LAN',
      'Output': '4K 120Hz & 8K Support with VRR'
    },
    priceAnalytics: {
      lowestPrice: 679.99,
      highestPrice: 699.99,
      averagePrice: 695.00,
      allTimeLow: 679.99,
      priceTrend: 'stable',
      savingsPotential: 20.00
    },
    deals: [
      {
        id: 'deal-bestbuy-ps5',
        platform: 'Best Buy',
        logoColor: '#0046be',
        sellerName: 'Best Buy Official Gaming',
        sellerRating: 4.9,
        sellerReviewsCount: 65000,
        price: 679.99,
        originalPrice: 699.99,
        currency: 'USD',
        inStock: true,
        stockCount: 14,
        shipping: {
          type: 'Free 2-Day',
          cost: 0,
          estimatedDays: '2 Business Days'
        },
        condition: 'Brand New',
        returnPolicy: 'Official Sony 1-Year Warranty',
        dealTag: 'Lowest Price',
        couponCode: 'GAMERSQUAD',
        couponDiscount: '$20 store credit on next purchase',
        productUrl: 'https://www.bestbuy.com',
        priceHistory: [
          { date: 'Aug 01', price: 699 },
          { date: 'Aug 08', price: 699 },
          { date: 'Aug 15', price: 699 },
          { date: 'Aug 22', price: 689 },
          { date: 'Sep 01', price: 679 }
        ]
      },
      {
        id: 'deal-amazon-ps5',
        platform: 'Amazon',
        logoColor: '#ff9900',
        sellerName: 'PlayStation Direct Store on Amazon',
        sellerRating: 4.9,
        sellerReviewsCount: 94000,
        price: 699.99,
        originalPrice: 699.99,
        currency: 'USD',
        inStock: true,
        shipping: {
          type: 'Prime Next-Day',
          cost: 0,
          estimatedDays: 'Tomorrow, by 1 PM'
        },
        condition: 'Brand New',
        returnPolicy: '30-Day Hassle-Free Return',
        dealTag: 'Fastest Delivery',
        productUrl: 'https://www.amazon.com',
        priceHistory: [
          { date: 'Aug 01', price: 699 },
          { date: 'Aug 08', price: 699 },
          { date: 'Aug 15', price: 699 },
          { date: 'Aug 22', price: 699 },
          { date: 'Sep 01', price: 699 }
        ]
      },
      {
        id: 'deal-walmart-ps5',
        platform: 'Walmart',
        logoColor: '#0071dc',
        sellerName: 'Walmart Entertainment Hub',
        sellerRating: 4.8,
        sellerReviewsCount: 38000,
        price: 689.00,
        originalPrice: 699.99,
        currency: 'USD',
        inStock: true,
        shipping: {
          type: 'Free 2-Day',
          cost: 0,
          estimatedDays: '2 Business Days'
        },
        condition: 'Brand New',
        returnPolicy: 'Walmart 30-Day Returns',
        dealTag: 'Best Value',
        productUrl: 'https://www.walmart.com',
        priceHistory: [
          { date: 'Aug 01', price: 699 },
          { date: 'Aug 08', price: 699 },
          { date: 'Aug 15', price: 695 },
          { date: 'Aug 22', price: 689 },
          { date: 'Sep 01', price: 689 }
        ]
      }
    ],
    alternatives: [
      {
        id: 'alt-ps5-slim',
        title: 'Sony PlayStation 5 Slim (1TB Digital Edition)',
        category: 'Gaming',
        brand: 'Sony PlayStation',
        imageUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&auto=format&fit=crop&q=80',
        platform: 'Amazon',
        price: 449.00,
        originalPrice: 499.00,
        badge: 'Best Value',
        similarityScore: 90,
        keyDifference: 'Plays all PS5 games in 4K with smaller footprint at $230 lower cost',
        rating: 4.9,
        reviewsCount: 38000,
        productUrl: 'https://www.amazon.com'
      },
      {
        id: 'alt-xbox-series-x',
        title: 'Microsoft Xbox Series X (1TB Carbon Black)',
        category: 'Gaming',
        brand: 'Microsoft Xbox',
        imageUrl: 'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=800&auto=format&fit=crop&q=80',
        platform: 'Walmart',
        price: 469.00,
        originalPrice: 499.99,
        badge: 'Budget Alternative',
        similarityScore: 86,
        keyDifference: 'Xbox Game Pass ecosystem with 12 Teraflops GPU and disc drive included',
        rating: 4.8,
        reviewsCount: 22000,
        productUrl: 'https://www.walmart.com'
      }
    ]
  },
  {
    id: 'canon-eos-r6',
    name: 'Canon EOS R6 Mark II Mirrorless Camera (Body Only)',
    tagline: '24.2 MP Full-Frame CMOS, 40 fps burst, 6K RAW external & 4K60p oversampled',
    category: 'Photography',
    brand: 'Canon',
    model: 'EOS R6 Mark II (5666C002)',
    sku: 'CAN-R6MK2-BODY',
    confidenceScore: 98.1,
    imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80',
    specs: {
      'Sensor': '24.2MP Full-Frame CMOS Sensor',
      'Continuous Shooting': 'Up to 40 fps Electronic Shutter',
      'Video Capability': '4K60p 10-Bit Internal, 6K RAW HDMI',
      'Stabilization': 'In-Body 5-Axis IS (Up to 8.0 Stops)',
      'Autofocus': 'Dual Pixel CMOS AF II with Deep Learning'
    },
    priceAnalytics: {
      lowestPrice: 2099.00,
      highestPrice: 2499.00,
      averagePrice: 2299.00,
      allTimeLow: 1999.00,
      priceTrend: 'dropping',
      savingsPotential: 400.00
    },
    deals: [
      {
        id: 'deal-bh-canon',
        platform: 'B&H Photo',
        logoColor: '#df0000',
        sellerName: 'B&H Pro Video Camera Direct',
        sellerRating: 4.95,
        sellerReviewsCount: 48000,
        price: 2099.00,
        originalPrice: 2499.00,
        currency: 'USD',
        inStock: true,
        stockCount: 8,
        shipping: {
          type: 'Free 2-Day',
          cost: 0,
          estimatedDays: '2 Business Days (Includes Free SD Card)'
        },
        condition: 'Brand New',
        returnPolicy: '30-Day Pro Return + Canon USA Warranty',
        dealTag: 'Lowest Price',
        couponCode: 'PROPHOTO100',
        couponDiscount: 'Bonus 128GB Pro V90 SDXC card ($110 value)',
        productUrl: 'https://www.bhphotovideo.com',
        priceHistory: [
          { date: 'Aug 01', price: 2499 },
          { date: 'Aug 08', price: 2399 },
          { date: 'Aug 15', price: 2299 },
          { date: 'Aug 22', price: 2199 },
          { date: 'Sep 01', price: 2099 }
        ]
      },
      {
        id: 'deal-amazon-canon',
        platform: 'Amazon',
        logoColor: '#ff9900',
        sellerName: 'Canon Official Store on Amazon',
        sellerRating: 4.9,
        sellerReviewsCount: 31000,
        price: 2199.00,
        originalPrice: 2499.00,
        currency: 'USD',
        inStock: true,
        shipping: {
          type: 'Prime Next-Day',
          cost: 0,
          estimatedDays: 'Tomorrow Afternoon'
        },
        condition: 'Brand New',
        returnPolicy: '30-Day Refund Policy',
        dealTag: 'Fastest Delivery',
        productUrl: 'https://www.amazon.com',
        priceHistory: [
          { date: 'Aug 01', price: 2499 },
          { date: 'Aug 08', price: 2499 },
          { date: 'Aug 15', price: 2349 },
          { date: 'Aug 22', price: 2249 },
          { date: 'Sep 01', price: 2199 }
        ]
      },
      {
        id: 'deal-ebay-canon',
        platform: 'eBay',
        logoColor: '#e53238',
        sellerName: 'CameraPro_Refurbished',
        sellerRating: 4.92,
        sellerReviewsCount: 11200,
        price: 1849.00,
        originalPrice: 2499.00,
        currency: 'USD',
        inStock: true,
        stockCount: 2,
        shipping: {
          type: 'Standard Free',
          cost: 0,
          estimatedDays: '3 Business Days'
        },
        condition: 'Refurbished (Certified)',
        returnPolicy: '1-Year Warranty Included',
        dealTag: 'Certified Refurbished',
        productUrl: 'https://www.ebay.com',
        priceHistory: [
          { date: 'Aug 01', price: 2100 },
          { date: 'Aug 08', price: 1999 },
          { date: 'Aug 15', price: 1950 },
          { date: 'Aug 22', price: 1899 },
          { date: 'Sep 01', price: 1849 }
        ]
      }
    ],
    alternatives: [
      {
        id: 'alt-sony-a7iv',
        title: 'Sony Alpha a7 IV Mirrorless Camera (33MP Full-Frame)',
        category: 'Photography',
        brand: 'Sony',
        imageUrl: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&auto=format&fit=crop&q=80',
        platform: 'B&H Photo',
        price: 2298.00,
        originalPrice: 2498.00,
        badge: 'Pro Upgrade',
        similarityScore: 95,
        keyDifference: 'Higher 33MP resolution and unmatched Sony E-mount third party lens ecosystem',
        rating: 4.8,
        reviewsCount: 14200,
        productUrl: 'https://www.bhphotovideo.com'
      },
      {
        id: 'alt-canon-r8',
        title: 'Canon EOS R8 Mirrorless Camera (Body Only)',
        category: 'Photography',
        brand: 'Canon',
        imageUrl: 'https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?w=800&auto=format&fit=crop&q=80',
        platform: 'Amazon',
        price: 1299.00,
        originalPrice: 1499.00,
        badge: 'Budget Alternative',
        similarityScore: 90,
        keyDifference: 'Same 24.2MP sensor & 40fps burst at nearly half the weight and price ($1,299)',
        rating: 4.7,
        reviewsCount: 5200,
        productUrl: 'https://www.amazon.com'
      }
    ]
  },
  {
    id: 'dyson-airwrap-multi',
    name: 'Dyson Airwrap Multi-Styler Complete Long (Nickel & Copper)',
    tagline: 'Coanda airflow styling, dries and styles simultaneously without extreme heat',
    category: 'Beauty',
    brand: 'Dyson',
    model: 'Airwrap Complete Long (400714-01)',
    sku: 'DYS-AW-LONG-COP',
    confidenceScore: 98.9,
    imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80',
    specs: {
      'Airflow Velocity': '13-blade impeller spins up to 110,000 RPM',
      'Heat Control': 'Intelligent Heat Control under 150°C',
      'Included Barrels': '30mm & 40mm Re-engineered Airwrap Barrels',
      'Brushes': 'Firm & Soft Smoothing Brushes + Round Volumizing',
      'Storage Case': 'Prussian Blue Cushioned Presentation Case'
    },
    priceAnalytics: {
      lowestPrice: 499.99,
      highestPrice: 599.99,
      averagePrice: 569.00,
      allTimeLow: 479.99,
      priceTrend: 'dropping',
      savingsPotential: 100.00
    },
    deals: [
      {
        id: 'deal-walmart-dyson',
        platform: 'Walmart',
        logoColor: '#0071dc',
        sellerName: 'Walmart Beauty Direct',
        sellerRating: 4.8,
        sellerReviewsCount: 18000,
        price: 499.99,
        originalPrice: 599.99,
        currency: 'USD',
        inStock: true,
        stockCount: 7,
        shipping: {
          type: 'Free 2-Day',
          cost: 0,
          estimatedDays: '2 Business Days'
        },
        condition: 'Brand New',
        returnPolicy: '30-Day Free Return Window',
        dealTag: 'Lowest Price',
        couponCode: 'GLOW50',
        couponDiscount: 'Extra $25 off Dyson beauty tools',
        productUrl: 'https://www.walmart.com',
        priceHistory: [
          { date: 'Aug 01', price: 599 },
          { date: 'Aug 08', price: 599 },
          { date: 'Aug 15', price: 549 },
          { date: 'Aug 22', price: 529 },
          { date: 'Sep 01', price: 499 }
        ]
      },
      {
        id: 'deal-bestbuy-dyson',
        platform: 'Best Buy',
        logoColor: '#0046be',
        sellerName: 'Best Buy Beauty & Health',
        sellerRating: 4.9,
        sellerReviewsCount: 14000,
        price: 549.99,
        originalPrice: 599.99,
        currency: 'USD',
        inStock: true,
        shipping: {
          type: 'Free 2-Day',
          cost: 0,
          estimatedDays: '2 Days or Pickup Today'
        },
        condition: 'Brand New',
        returnPolicy: 'Dyson 2-Year Official Warranty',
        dealTag: 'Best Value',
        productUrl: 'https://www.bestbuy.com',
        priceHistory: [
          { date: 'Aug 01', price: 599 },
          { date: 'Aug 08', price: 599 },
          { date: 'Aug 15', price: 579 },
          { date: 'Aug 22', price: 549 },
          { date: 'Sep 01', price: 549 }
        ]
      },
      {
        id: 'deal-ebay-dyson',
        platform: 'eBay',
        logoColor: '#e53238',
        sellerName: 'Dyson Official eBay Outlet',
        sellerRating: 4.97,
        sellerReviewsCount: 92000,
        price: 399.99,
        originalPrice: 599.99,
        currency: 'USD',
        inStock: true,
        stockCount: 12,
        shipping: {
          type: 'Standard Free',
          cost: 0,
          estimatedDays: '3 Business Days'
        },
        condition: 'Refurbished (Certified)',
        returnPolicy: 'Dyson Official 2-Year Refurbished Guarantee',
        dealTag: 'Certified Refurbished',
        couponCode: 'DYSONSAVINGS',
        couponDiscount: '20% off direct from manufacturer',
        productUrl: 'https://www.ebay.com',
        priceHistory: [
          { date: 'Aug 01', price: 449 },
          { date: 'Aug 08', price: 439 },
          { date: 'Aug 15', price: 419 },
          { date: 'Aug 22', price: 409 },
          { date: 'Sep 01', price: 399 }
        ]
      }
    ],
    alternatives: [
      {
        id: 'alt-shark-flexstyle',
        title: 'Shark FlexStyle Air Styling & Drying System (HD430)',
        category: 'Beauty',
        brand: 'Shark',
        imageUrl: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=800&auto=format&fit=crop&q=80',
        platform: 'Amazon',
        price: 269.99,
        originalPrice: 299.99,
        badge: 'Best Value',
        similarityScore: 92,
        keyDifference: 'Rotates from dryer to multi-styler with auto-wrap curlers at less than half the price ($269)',
        rating: 4.7,
        reviewsCount: 15400,
        productUrl: 'https://www.amazon.com'
      }
    ]
  }
];

export const AI_AGENT_STAGES = [
  {
    id: 1,
    name: 'Vision & Feature Extractor',
    role: 'Computer Vision Agent',
    description: 'Deconstructs pixel tensor, isolates product contours, predicts brand, SKU and exact colorway.',
    icon: 'ScanEye'
  },
  {
    id: 2,
    name: 'Distributed Platform Crawler',
    role: 'Multi-Store Scraping Agent',
    description: 'Parallel queries executed against Amazon, Walmart, Best Buy, eBay, Target, B&H and AliExpress.',
    icon: 'Globe'
  },
  {
    id: 3,
    name: 'Price Arbitrage Engine',
    role: 'Financial Optimization Agent',
    description: 'Calculates real-time price delta, shipping cost normalized total, coupon codes & savings spread.',
    icon: 'TrendingDown'
  },
  {
    id: 4,
    name: 'Authenticity & Trust Guard',
    role: 'Seller Verification Agent',
    description: 'Screens merchant reputations, counterfeit risk, return policies and warranty validity.',
    icon: 'ShieldCheck'
  },
  {
    id: 5,
    name: 'Cross-Marketplace Matcher',
    role: 'Alternative Discovery Agent',
    description: 'Identifies high-value substitutes, refurbished tier gems and comparable alternatives.',
    icon: 'Sparkles'
  }
];

export const SAMPLE_AI_QUERIES = [
  'Which platform has the absolute lowest total price right now?',
  'Are there any verified refurbished deals with warranty?',
  'Which store will deliver this product the fastest?',
  'What are the best cheaper alternative models?',
  'Set a price alert if this drops below all-time low'
];
