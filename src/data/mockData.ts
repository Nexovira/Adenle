import { 
  Category, 
  Product, 
  Store, 
  Order, 
  Review, 
  TechService, 
  Course, 
  DigitalProduct, 
  AffiliateData, 
  FinancialLedgerItem, 
  GlobalBrandSettings, 
  HomepageSection 
} from '../types';

export const CATEGORIES: Category[] = [
  { id: 'refrigerators', name: 'Refrigerators & Freezers', group: 'appliances', icon: 'Refrigerator', itemCount: 142, description: 'Smart French door, side-by-side, inverter, and chest freezers.' },
  { id: 'air-conditioners', name: 'Air Conditioners & Cooling', group: 'appliances', icon: 'Wind', itemCount: 98, description: 'Dual inverter split ACs, portable cooling, and quiet tower fans.' },
  { id: 'washing-machines', name: 'Washing Machines & Care', group: 'appliances', icon: 'WashingMachine', itemCount: 85, description: 'Front-load washer-dryers, top-load steam agitators, and eco-dryers.' },
  { id: 'microwaves', name: 'Microwaves & Ovens', group: 'appliances', icon: 'Microwave', itemCount: 110, description: 'Smart convection microwaves, built-in ovens, and air-fry microwave combos.' },
  { id: 'cookers', name: 'Cookers & Ranges', group: 'appliances', icon: 'Flame', itemCount: 76, description: 'Induction cooktops, dual-fuel gas ranges, and smart pressure cookers.' },
  { id: 'blenders', name: 'Blenders & Air Fryers', group: 'appliances', icon: 'CookingPot', itemCount: 164, description: 'High-speed professional blenders, dual-basket air fryers, and food processors.' },
  { id: 'vacuums', name: 'Robotic & Home Vacuums', group: 'appliances', icon: 'Sparkles', itemCount: 62, description: 'LiDAR AI mapping robot vacuums, wet-dry cordless sticks, and carpet washers.' },
  { id: 'tvs', name: 'OLED & QLED Smart TVs', group: 'electronics', icon: 'Tv', itemCount: 210, description: '4K & 8K Neo QLED, OLED Motion 120Hz displays, and cinema laser projectors.' },
  { id: 'audio', name: 'Audio Systems & Headphones', group: 'electronics', icon: 'Headphones', itemCount: 188, description: 'Dolby Atmos soundbars, active noise canceling headphones, and party towers.' },
  { id: 'laptops', name: 'Computing & Workstations', group: 'electronics', icon: 'Laptop', itemCount: 156, description: 'AI workstation laptops, gaming powerhouses, and ultra-light OLED ultrabooks.' },
  { id: 'gaming', name: 'Gaming Consoles & Gear', group: 'electronics', icon: 'Gamepad2', itemCount: 94, description: 'Next-gen consoles, VR headsets, mechanical RGB gear, and 240Hz monitors.' },
  { id: 'accessories', name: 'Smart Power & Solar', group: 'smart-home', icon: 'Zap', itemCount: 135, description: 'Inverter power stations, LiFePO4 solar generators, and smart home hubs.' },
  { id: 'ebooks', name: 'Digital E-books & Guides', group: 'electronics', icon: 'BookOpen', itemCount: 42, description: 'Technical manuals, engineering guides, solar installation handbooks, and tech blueprints in PDF.' },
];

export const STORES: Store[] = [
  {
    id: 'store-1',
    name: 'NexaTech Global Store',
    logo: '/nexovira.jpeg',
    banner: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&auto=format&fit=crop&q=80',
    verified: true,
    status: 'verified',
    rating: 4.9,
    reviewCount: 142,
    joinedDate: '2023-01-15',
    productsCount: 88,
    description: 'Direct store partner for smart home appliances, inverter air conditioners, and premium OLED displays.',
    location: 'Lagos Hub / Victoria Island',
    country: 'Nigeria',
    currency: 'NGN',
    contactEmail: 'nexovirasupport@gmail.com',
    contactPhone: '+234 911 044 3054',
    payoutMethod: 'Bank Transfer / Paystack',
  },
  {
    id: 'store-2',
    name: 'ElectraHome Hub',
    logo: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=150&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=1200&auto=format&fit=crop&q=80',
    verified: true,
    status: 'verified',
    rating: 4.8,
    reviewCount: 95,
    joinedDate: '2023-04-10',
    productsCount: 64,
    description: 'Premier supplier of energy-efficient washing machines, side-by-side refrigerators, and heavy-duty kitchen equipment.',
    location: 'Lagos Hub / Ikeja',
    country: 'Nigeria',
    currency: 'NGN',
    contactEmail: 'sales@electrahome.io',
    contactPhone: '+234 812 959 5134',
    payoutMethod: 'Paystack Direct / Wire',
  },
  {
    id: 'store-3',
    name: 'Apex Computing & Energy',
    logo: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=150&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop&q=80',
    verified: true,
    status: 'verified',
    rating: 4.95,
    reviewCount: 210,
    joinedDate: '2022-11-01',
    productsCount: 112,
    description: 'Specializing in high-performance workstation laptops, solar generator power stations, and next-gen hardware.',
    location: 'Lagos Hub / Lekki',
    country: 'Nigeria',
    currency: 'NGN',
    contactEmail: 'orders@apexcomputing.com',
    contactPhone: '+234 911 044 3054',
    payoutMethod: 'Paystack Automated',
  },
];

export const PRODUCTS: Product[] = [
  {
    id: 'prod-ebook-1',
    title: 'Solar & Inverter Installation Master Handbook (2026 Edition)',
    brand: 'NEXOVIRA Press',
    author: 'Engr. Kenneth Adeleke & NEXOVIRA Energy Labs',
    productType: 'digital_ebook',
    isDigital: true,
    publisher: 'NEXOVIRA Technical Publishing',
    publicationYear: '2026',
    isbn: '978-0-19-852663-6',
    pdfUrl: 'data:application/pdf;base64,JVBERi0xLjQKJcOkw7zDtsOfCjEgMCBvYmoKPDwvVHlwZSAvQ2F0YWxvZyAvUGFnZXMgMiAwIFI+PgplbmRvYmoKMiAwIG9iago8PC9UeXBlIC9QYWdlcyAvS2lkcyBbMyAwIFJdIC9Db3VudCAxPj4KZW5kb2JqCjMgMCBvYmoKPDwvVHlwZSAvUGFnZSAvUGFyZW50IDIgMCBSIC9NZWRpYUJveCBbMCAwIDYxMiA3OTJdIC9Db250ZW50cyA0IDAgUj4+CmVuZG9iago0IDAgb2JqCjw8L0xlbmd0aCA1ND4+CnN0cmVhbQpCVAovRjEgMjQgVGYKMTA0IDcyMCBUZAkKKE5FWE9WSVJBIERJR0lUQUwgRS1CT09LIFZFUklGSUVEKSBUagpFVAplbmRzdHJlYW0KZW5kb2JqCnhyZWYKMCA1CjAwMDAwMDAwMDAgNjU1MzUgZiAKMDA0MDAwMDAxNSAwMDAwMCBuIAowMDAwMDAwMDY4IDA0MDAwIG4gCjAwMDAwMDAxMjUgMDAwMDAgbiAKMDA0MDAwMDAyMTkgMDAwMDAgbiAKdHJhaWxlcgo8PC9TaXplIDUvUm9vdCAxIDAgUj4+CnN0YXJ0eHJlZgozMTQKJSVFT0Y=',
    pdfFileName: 'Solar_Inverter_Master_Handbook_2026.pdf',
    pdfFileSize: '18.40 MB',
    categoryId: 'ebooks',
    price: 35,
    originalPrice: 60,
    discountPercentage: 41,
    currency: 'USD',
    rating: 5.0,
    reviewCount: 34,
    stock: 9999,
    sellerId: 'store-1',
    sellerName: 'NexaTech Global Store',
    sellerVerified: true,
    images: [
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'The definitive 280-page technical guide for solar engineers, electricians, and homeowners. Features detailed LiFePO4 battery wiring diagrams, MPPT sizing formulas, hybrid inverter load distribution tables, and tropical climate installation standards.',
    keyFeatures: [
      'Instant High-Res PDF Access (Printable)',
      'Complete LiFePO4 & Gel Battery Sizing Charts',
      'Step-by-Step Hybrid Inverter Wiring Blueprints',
      'Lagos & Tropical Heat Temperature Compensation Guidelines'
    ],
    specifications: {
      'Format': 'Digital PDF',
      'Pages': '280 Pages',
      'Language': 'English',
      'File Size': '18.40 MB'
    },
    tags: ['solar', 'inverter', 'ebook', 'handbook', 'engineering'],
    warranty: 'Lifetime Digital Access & Free Updates',
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-ebook-2',
    title: 'Modern HVAC & Inverter Refrigeration Troubleshooting Guide',
    brand: 'NEXOVIRA Press',
    author: 'Dr. Samuel O. Biobaku',
    productType: 'digital_ebook',
    isDigital: true,
    publisher: 'NEXOVIRA Press',
    publicationYear: '2025',
    isbn: '978-1-4028-9457-3',
    pdfUrl: 'data:application/pdf;base64,JVBERi0xLjQKJcOkw7zDtsOfCjEgMCBvYmoKPDwvVHlwZSAvQ2F0YWxvZyAvUGFnZXMgMiAwIFI+PgplbmRvYmoKMiAwIG9iago8PC9UeXBlIC9QYWdlcyAvS2lkcyBbMyAwIFJdIC9Db3VudCAxPj4KZW5kb2JqCjMgMCBvYmoKPDwvVHlwZSAvUGFnZSAvUGFyZW50IDIgMCBSIC9NZWRpYUJveCBbMCAwIDYxMiA3OTJdIC9Db250ZW50cyA0IDAgUj4+CmVuZG9iago4IDAgb2JqCjw8L0xlbmd0aCA1ND4+CnN0cmVhbQpCVAovRjEgMjQgVGYKMTA0IDcyMCBUZAkKKE5FWE9WSVJBIERJR0lUQUwgRS1CT09LIFZFUklGSUVEKSBUagpFVAplbmRzdHJlYW0KZW5kb2JqCnhyZWYKMCA1CjAwMDAwMDAwMDAgNjU1MzUgZiAKMDA0MDAwMDAxNSAwMDAwMCBuIAowMDAwMDAwMDY4IDA0MDAwIG4gCjAwMDAwMDAxMjUgMDAwMDAgbiAKMDA0MDAwMDAyMTkgMDAwMDAgbiAKdHJhaWxlcgo8PC9TaXplIDUvUm9vdCAxIDAgUj4+CnN0YXJ0eHJlZgozMTQKJSVFT0Y=',
    pdfFileName: 'HVAC_Inverter_Troubleshooting_Guide.pdf',
    pdfFileSize: '12.80 MB',
    categoryId: 'ebooks',
    price: 25,
    originalPrice: 45,
    discountPercentage: 44,
    currency: 'USD',
    rating: 4.9,
    reviewCount: 21,
    stock: 9999,
    sellerId: 'store-1',
    sellerName: 'NexaTech Global Store',
    sellerVerified: true,
    images: [
      'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Comprehensive diagnostic manual for Dual Inverter air conditioners, smart refrigerators, and PCB fault codes. Includes step-by-step diagnostic flowcharts for R32/R410A refrigerants and inverter compressor testing.',
    keyFeatures: [
      'Diagnostic Flowcharts for All Major Inverter Error Codes',
      'R32 & R410A Refrigerant Pressure Temperature Charts',
      'PCB Electronic Board Voltage Testing Procedures'
    ],
    specifications: {
      'Format': 'Digital PDF',
      'Pages': '195 Pages',
      'Language': 'English',
      'File Size': '12.80 MB'
    },
    tags: ['hvac', 'ac repair', 'inverter', 'ebook', 'troubleshooting'],
    warranty: 'Lifetime Digital Access',
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-1',
    title: 'NEXOVIRA Pro-Cool 2.0 HP Inverter Split AC (Gen-3 Eco)',
    brand: 'NEXOVIRA Tech',
    categoryId: 'air-conditioners',
    price: 325, // ₦520,000 at 1600 rate
    originalPrice: 400,
    discountPercentage: 18,
    currency: 'USD',
    rating: 4.9,
    reviewCount: 48,
    stock: 45,
    sellerId: 'store-1',
    sellerName: 'NexaTech Global Store',
    sellerVerified: true,
    images: [
      'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&auto=format&fit=crop&q=80'
    ],
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    description: 'Engineered with Dual-Inverter Turbo Cooling and AI Climate Sensing. Reduces energy consumption by up to 70% while delivering rapid room cooling in under 60 seconds.',
    keyFeatures: [
      'Dual Inverter Compressor with 10-Year Warranty',
      'AI Thermal Smart Radar Adjusts Temperature Automatically',
      'Ultra-Quiet 19dB Silent Night Sleep Mode',
      'Anti-Corrosion GoldFin Copper Radiator'
    ],
    specifications: {
      'Cooling Capacity': '18,000 BTU / 2.0 HP',
      'Energy Rating': 'A+++ Eco Inverter',
      'Power Consumption': '1,120 W (Max Eco Mode: 420 W)',
      'Refrigerant': 'R32 Eco Gas',
      'Room Coverage': 'Up to 35 sq meters',
      'Noise Level': '19 dB Whisper Low'
    },
    energyRating: 'A+++',
    capacity: '2.0 HP / 18,000 BTU',
    warranty: '10 Years Compressor + 2 Years Full System',
    featured: true,
    isFlashDeal: true,
    isBestSeller: true,
    tags: ['air conditioner', 'ac', 'inverter', 'cooling', 'appliance'],
    createdAt: '2026-01-10T10:00:00Z'
  },
  {
    id: 'prod-2',
    title: 'ElectraFrost 620L Smart French Door Refrigerator (InstaView AI)',
    brand: 'ElectraHome',
    categoryId: 'refrigerators',
    price: 925, // ₦1,480,000 at 1600 rate
    originalPrice: 1100,
    discountPercentage: 16,
    currency: 'USD',
    rating: 4.8,
    reviewCount: 35,
    stock: 18,
    sellerId: 'store-2',
    sellerName: 'ElectraHome Hub',
    sellerVerified: true,
    images: [
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Flagship 620L Smart Refrigerator featuring knock-twice transparent glass door, internal craft ice generator, and total no-frost dual linear cooling systems.',
    keyFeatures: [
      'Knock Twice InstaView Glass Door Panel',
      'Dual Compressor Linear Inverter System',
      'Built-in UVnano Water & Ice Dispenser',
      'Smart Freshness Radar for 14-Day Fresh Veggies'
    ],
    specifications: {
      'Total Capacity': '620 Liters (Fridge: 400L, Freezer: 220L)',
      'Cooling Technology': 'Total No Frost + Dual Linear Inverter',
      'Dimensions': '912 x 1790 x 738 mm',
      'Energy Consumption': '310 kWh/year'
    },
    energyRating: 'A++',
    capacity: '620 Liters',
    warranty: '10 Years Linear Compressor Warranty',
    featured: true,
    isFlashDeal: false,
    isBestSeller: true,
    tags: ['refrigerator', 'fridge', 'french door', 'kitchen', 'appliance'],
    createdAt: '2026-01-15T12:00:00Z'
  },
  {
    id: 'prod-3',
    title: 'SteamClean Pro 12kg Front-Load Washer Dryer Combo (1400 RPM)',
    brand: 'NEXOVIRA Tech',
    categoryId: 'washing-machines',
    price: 387.5, // ₦620,000
    originalPrice: 480,
    discountPercentage: 19,
    currency: 'USD',
    rating: 4.85,
    reviewCount: 29,
    stock: 22,
    sellerId: 'store-1',
    sellerName: 'NexaTech Global Store',
    sellerVerified: true,
    images: [
      'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'All-in-one AI Direct Drive Front-Load Washing Machine & Condenser Dryer. Intelligently senses fabric weight and softness to select optimal washing motions.',
    keyFeatures: [
      '12kg Wash Capacity + 8kg Turbo Drying',
      'AI DD Inverter Direct Drive Motor',
      'Steam Allergy Care Eliminates 99.9% Mites',
      'TurboWash 360 in 39 Minutes'
    ],
    specifications: {
      'Washing Capacity': '12.0 kg',
      'Drying Capacity': '8.0 kg',
      'Spin Speed': '1400 RPM',
      'Motor Type': 'Direct Drive Inverter'
    },
    energyRating: 'A+++',
    capacity: '12kg Wash / 8kg Dry',
    warranty: '10 Years Motor Warranty',
    featured: true,
    isFlashDeal: true,
    isBestSeller: false,
    tags: ['washing machine', 'washer', 'dryer', 'front load', 'appliance'],
    createdAt: '2026-01-20T09:30:00Z'
  },
  {
    id: 'prod-4',
    title: 'NEXOVIRA VisionMax 75" 4K Quantum QLED Smart TV (120Hz Gaming)',
    brand: 'NEXOVIRA Vision',
    categoryId: 'tvs',
    price: 718.75, // ₦1,150,000
    originalPrice: 880,
    discountPercentage: 18,
    currency: 'USD',
    rating: 4.95,
    reviewCount: 64,
    stock: 15,
    sellerId: 'store-1',
    sellerName: 'NexaTech Global Store',
    sellerVerified: true,
    images: [
      'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Unmatched visual brilliance powered by Quantum Dot QLED pixels, Neural AI 4K Upscaling, Dolby Vision IQ, and 60W Dolby Atmos spatial sound.',
    keyFeatures: [
      '75-Inch Quantum Dot Display with HDR10+',
      '120Hz Native Refresh Rate + FreeSync',
      '4x HDMI 2.1 Ports for Next-Gen Consoles',
      '60W Dolby Atmos Sound System'
    ],
    specifications: {
      'Screen Size': '75 Inches',
      'Display Technology': 'Quantum QLED 4K',
      'Resolution': '3840 x 2160',
      'Refresh Rate': '120Hz Native'
    },
    warranty: '3 Years Panel Warranty',
    featured: true,
    isFlashDeal: true,
    isBestSeller: true,
    tags: ['tv', 'qled', '4k', 'smart tv', 'electronics'],
    createdAt: '2026-01-05T08:00:00Z'
  },
  {
    id: 'prod-5',
    title: 'ApexBook Pro 16 AI Workstation (64GB RAM, 2TB SSD)',
    brand: 'Apex Computing',
    categoryId: 'laptops',
    price: 1156.25, // ₦1,850,000
    originalPrice: 1350,
    discountPercentage: 14,
    currency: 'USD',
    rating: 4.9,
    reviewCount: 42,
    stock: 12,
    sellerId: 'store-3',
    sellerName: 'Apex Computing & Energy',
    sellerVerified: true,
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Heavyweight computing performance for machine learning, 8K video editing, and software development. 16.2" Mini-LED 120Hz Liquid Retina display.',
    keyFeatures: [
      'Octa-Core Pro AI Accelerated Chipset',
      '64GB High-Speed RAM + 2TB NVMe SSD',
      '120Hz Liquid Retina Display',
      'Up to 22 Hours Battery Life'
    ],
    specifications: {
      'Processor': 'Apex Octa-Core Pro AI',
      'RAM': '64GB LPDDR5X',
      'Storage': '2TB High-Speed SSD',
      'Display': '16.2" Liquid XDR'
    },
    warranty: '2 Years Manufacturer Warranty',
    featured: true,
    isFlashDeal: false,
    isBestSeller: true,
    tags: ['laptop', 'workstation', 'computing', 'ai laptop'],
    createdAt: '2026-01-18T14:00:00Z'
  },
  {
    id: 'prod-6',
    title: 'Apex PowerStation 3.5kVA Solar Inverter & LiFePO4 Battery Unit',
    brand: 'Apex Energy',
    categoryId: 'accessories',
    price: 843.75, // ₦1,350,000
    originalPrice: 1000,
    discountPercentage: 15,
    currency: 'USD',
    rating: 4.95,
    reviewCount: 52,
    stock: 25,
    sellerId: 'store-3',
    sellerName: 'Apex Computing & Energy',
    sellerVerified: true,
    images: [
      'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Zero-emission emergency home backup solar generator. Powers refrigerators, air conditioners, TVs, and kitchen appliances during grid outages.',
    keyFeatures: [
      '3500W Pure Sine Wave AC Output',
      '3,840Wh EV-Grade LiFePO4 Battery (3500+ Cycles)',
      '10ms Seamless UPS Auto Switchover',
      'Supports Fast MPPT Solar Charging'
    ],
    specifications: {
      'Capacity': '3,840 Wh',
      'AC Output': '3500W Pure Sine Wave',
      'Solar Input': '2400W Max MPPT',
      'Battery Chemistry': 'LiFePO4 (LFP)'
    },
    capacity: '3,840Wh Battery / 3.5kVA Inverter',
    warranty: '5 Years Replacement Guarantee',
    featured: true,
    isFlashDeal: false,
    isBestSeller: true,
    tags: ['solar generator', 'inverter', 'power station', 'backup power'],
    createdAt: '2026-01-22T11:00:00Z'
  },
  {
    id: 'prod-7',
    title: 'NEXOVIRA ThermoSmart 2-Door Chest Freezer 350L',
    brand: 'NEXOVIRA Tech',
    categoryId: 'refrigerators',
    price: 237.5, // ₦380,000
    originalPrice: 280,
    discountPercentage: 15,
    currency: 'USD',
    rating: 4.8,
    reviewCount: 31,
    stock: 20,
    sellerId: 'store-1',
    sellerName: 'NexaTech Global Store',
    sellerVerified: true,
    images: [
      'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Heavy duty 350L chest freezer with 100-hour cooling retention during power failures. Features fast freezing turbo copper coils and interior LED lighting.',
    keyFeatures: [
      '100-Hour Cool Retention After Outage',
      'Tropicalized Heavy Duty Compressor',
      'Super Freezing Function with Basket',
      'Safety Key Lock System'
    ],
    specifications: {
      'Capacity': '350 Liters',
      'Cooling Retention': '100 Hours',
      'Defrost Type': 'Manual Drain'
    },
    energyRating: 'A+',
    capacity: '350 Liters',
    warranty: '5 Years Compressor Warranty',
    featured: false,
    isFlashDeal: true,
    isBestSeller: false,
    tags: ['chest freezer', 'freezer', 'refrigerator', 'appliance'],
    createdAt: '2026-01-25T09:00:00Z'
  },
  {
    id: 'prod-8',
    title: 'TurboBlend Pro 2200W Commercial High-Speed Blender',
    brand: 'ElectraHome',
    categoryId: 'blenders',
    price: 59.38, // ₦95,000
    originalPrice: 75,
    discountPercentage: 20,
    currency: 'USD',
    rating: 4.9,
    reviewCount: 88,
    stock: 60,
    sellerId: 'store-2',
    sellerName: 'ElectraHome Hub',
    sellerVerified: true,
    images: [
      'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=800&auto=format&fit=crop&q=80'
    ],
    description: '2200W Commercial copper motor blender with 6-blade hardened stainless steel cutter. Easily crushes ice, beans, nuts, and frozen fruits in 10 seconds.',
    keyFeatures: [
      '2200W Pure Copper High-Torque Motor',
      '2.0L Unbreakable BPA-Free Tritan Jar',
      '6 Steel Blades with Pulse Speed Control',
      'Overheat Thermal Protection Switch'
    ],
    specifications: {
      'Power': '2200 Watts',
      'Capacity': '2.0 Liters',
      'Speed': '32,000 RPM'
    },
    warranty: '2 Years Motor Warranty',
    featured: true,
    isFlashDeal: true,
    isBestSeller: true,
    tags: ['blender', 'kitchen', 'appliance', 'smoothie'],
    createdAt: '2026-01-28T10:00:00Z'
  },
  {
    id: 'prod-9',
    title: 'UltraChef 5-Burner Dual-Fuel Gas Cooker & Electric Oven',
    brand: 'ElectraHome',
    categoryId: 'cookers',
    price: 287.5, // ₦460,000
    originalPrice: 340,
    discountPercentage: 15,
    currency: 'USD',
    rating: 4.85,
    reviewCount: 24,
    stock: 14,
    sellerId: 'store-2',
    sellerName: 'ElectraHome Hub',
    sellerVerified: true,
    images: [
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Premium 90cm 5-burner gas stove with electric convection oven and rotisserie grill. Equipped with auto-ignition and flame failure safety device.',
    keyFeatures: [
      '5 Euro-Type Gas Burners including Wok Burner',
      'Large 110L Electric Convection Oven',
      'Flame Failure Safety Cut-Off Valve',
      'Cast Iron Pan Supports & Glass Top Cover'
    ],
    specifications: {
      'Dimensions': '90 x 60 x 85 cm',
      'Oven Volume': '110 Liters',
      'Fuel Type': 'Dual Fuel (LPG/NG Gas + 220V Electric)'
    },
    warranty: '2 Years Manufacturer Warranty',
    featured: true,
    isFlashDeal: false,
    isBestSeller: false,
    tags: ['gas cooker', 'oven', 'kitchen', 'cooker'],
    createdAt: '2026-02-01T11:00:00Z'
  },
  {
    id: 'prod-10',
    title: 'CrispAir 8.5L Dual-Basket Smart Air Fryer',
    brand: 'NEXOVIRA Tech',
    categoryId: 'blenders',
    price: 78.13, // ₦125,000
    originalPrice: 95,
    discountPercentage: 18,
    currency: 'USD',
    rating: 4.92,
    reviewCount: 56,
    stock: 35,
    sellerId: 'store-1',
    sellerName: 'NexaTech Global Store',
    sellerVerified: true,
    images: [
      'https://images.unsplash.com/photo-1585515320310-259814833e62?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Dual-zone air fryer allowing simultaneous cooking of two different foods with independent temperature and time controls. Reduces oil by 90%.',
    keyFeatures: [
      '8.5L Capacity across 2 Independent Baskets',
      'Match Cook & Smart Finish Sync Technology',
      '8 One-Touch Digital Cooking Presets',
      'Non-Stick Dishwasher Safe Crisper Plates'
    ],
    specifications: {
      'Power': '1800 Watts',
      'Capacity': '8.5 Liters Total (4.25L x 2)',
      'Temperature Range': '40°C to 200°C'
    },
    warranty: '1 Year Warranty',
    featured: true,
    isFlashDeal: true,
    isBestSeller: true,
    tags: ['air fryer', 'kitchen', 'appliance', 'cooking'],
    createdAt: '2026-02-03T14:00:00Z'
  },
  {
    id: 'prod-11',
    title: 'NEXOVIRA WavePro 32L Convection Smart Microwave',
    brand: 'NEXOVIRA Tech',
    categoryId: 'microwaves',
    price: 115.63, // ₦185,000
    originalPrice: 140,
    discountPercentage: 17,
    currency: 'USD',
    rating: 4.82,
    reviewCount: 38,
    stock: 28,
    sellerId: 'store-1',
    sellerName: 'NexaTech Global Store',
    sellerVerified: true,
    images: [
      'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=800&auto=format&fit=crop&q=80'
    ],
    description: '32L Smart Convection Microwave featuring inverter defrosting, grill element, air fry mode, and stainless steel cavity.',
    keyFeatures: [
      '32L Capacity with Stainless Steel Interior',
      'Microwave + Grill + Convection Combo',
      'Smart Sensor Auto Cooking Programs',
      'Child Safety Lock Function'
    ],
    specifications: {
      'Capacity': '32 Liters',
      'Power Output': '1000W Microwave / 1200W Grill'
    },
    capacity: '32 Liters',
    warranty: '2 Years System Warranty',
    featured: false,
    isFlashDeal: false,
    isBestSeller: false,
    tags: ['microwave', 'kitchen', 'appliance', 'convection'],
    createdAt: '2026-02-04T08:00:00Z'
  },
  {
    id: 'prod-12',
    title: 'EcoBreeze 1.5 HP Inverter Window Air Conditioner',
    brand: 'ElectraHome',
    categoryId: 'air-conditioners',
    price: 212.5, // ₦340,000
    originalPrice: 260,
    discountPercentage: 18,
    currency: 'USD',
    rating: 4.75,
    reviewCount: 19,
    stock: 16,
    sellerId: 'store-2',
    sellerName: 'ElectraHome Hub',
    sellerVerified: true,
    images: [
      'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Quiet 1.5 HP window inverter air conditioner designed for easy installation and low energy operation.',
    keyFeatures: [
      '1.5 HP Inverter Compressor',
      'Low Voltage Startup Capability',
      'Washable Anti-Bacterial Air Filter'
    ],
    specifications: {
      'Capacity': '12,000 BTU / 1.5 HP',
      'Refrigerant': 'R32'
    },
    capacity: '1.5 HP',
    warranty: '5 Years Compressor Warranty',
    featured: false,
    isFlashDeal: false,
    isBestSeller: false,
    tags: ['window ac', 'air conditioner', 'cooling'],
    createdAt: '2026-02-05T12:00:00Z'
  },
  {
    id: 'prod-13',
    title: 'PowerPro 5KVA Hybrid Solar Inverter System',
    brand: 'Apex Energy',
    categoryId: 'accessories',
    price: 1218.75, // ₦1,950,000
    originalPrice: 1450,
    discountPercentage: 16,
    currency: 'USD',
    rating: 4.96,
    reviewCount: 45,
    stock: 10,
    sellerId: 'store-3',
    sellerName: 'Apex Computing & Energy',
    sellerVerified: true,
    images: [
      'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Complete 5KVA 48V Pure Sine Wave Hybrid Solar Inverter with built-in 80A MPPT controller for seamless whole-home power protection.',
    keyFeatures: [
      '5000W Continuous Output Pure Sine Wave',
      'Built-in 80A MPPT Solar Charge Controller',
      'Generator Auto-Start Dry Contact Signal',
      'LCD Monitoring Screen & Wi-Fi Dongle'
    ],
    specifications: {
      'Power Rating': '5000W / 5000VA',
      'System Voltage': '48V DC'
    },
    warranty: '3 Years Warranty',
    featured: true,
    isFlashDeal: false,
    isBestSeller: true,
    tags: ['solar', 'inverter', '5kva', 'power station'],
    createdAt: '2026-02-06T10:00:00Z'
  },
  {
    id: 'prod-14',
    title: 'VisionPlus 55" 4K UHD Smart Android TV',
    brand: 'NEXOVIRA Vision',
    categoryId: 'tvs',
    price: 300, // ₦480,000
    originalPrice: 360,
    discountPercentage: 16,
    currency: 'USD',
    rating: 4.82,
    reviewCount: 52,
    stock: 30,
    sellerId: 'store-1',
    sellerName: 'NexaTech Global Store',
    sellerVerified: true,
    images: [
      'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=800&auto=format&fit=crop&q=80'
    ],
    description: '55" Frameless 4K Smart TV running Google Android TV OS with Netflix, YouTube, Prime Video, and voice remote.',
    keyFeatures: [
      '4K Ultra HD 3840 x 2160 Resolution',
      'Licensed Google Android TV OS',
      'Dolby Audio Stereo Sound',
      'Frameless Bezel Design'
    ],
    specifications: {
      'Screen Size': '55 Inches',
      'OS': 'Android TV 11'
    },
    warranty: '2 Years Warranty',
    featured: false,
    isFlashDeal: true,
    isBestSeller: true,
    tags: ['tv', '55 inch', '4k', 'android tv'],
    createdAt: '2026-02-07T09:00:00Z'
  },
  {
    id: 'prod-15',
    title: 'SoundPro Dolby Atmos 5.1 Surround Soundbar System',
    brand: 'NEXOVIRA Vision',
    categoryId: 'audio',
    price: 181.25, // ₦290,000
    originalPrice: 220,
    discountPercentage: 18,
    currency: 'USD',
    rating: 4.88,
    reviewCount: 33,
    stock: 22,
    sellerId: 'store-1',
    sellerName: 'NexaTech Global Store',
    sellerVerified: true,
    images: [
      'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&auto=format&fit=crop&q=80'
    ],
    description: '500W 5.1 channel surround soundbar with wireless subwoofer and rear satellite speakers for true cinema sound.',
    keyFeatures: [
      '500W Total Peak Output Power',
      '8-Inch Wireless Down-Firing Subwoofer',
      'HDMI eARC 4K Pass-Through & Bluetooth 5.3'
    ],
    specifications: {
      'Channels': '5.1 Channel',
      'Total Output': '500 Watts'
    },
    warranty: '1 Year Warranty',
    featured: false,
    isFlashDeal: false,
    isBestSeller: false,
    tags: ['soundbar', 'audio', 'dolby atmos', 'speaker'],
    createdAt: '2026-02-08T11:00:00Z'
  }
];


export const TECH_SERVICES: TechService[] = [];

export const COURSES: Course[] = [];

export const DIGITAL_PRODUCTS: DigitalProduct[] = [
  {
    id: 'ebook-1',
    title: 'The Modern E-Commerce Blueprint: Scaling to $100K GMV',
    author: 'NEXOVIRA Strategy Group',
    category: 'Business & E-Commerce',
    price: 15,
    originalPrice: 35,
    format: 'PDF',
    coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80',
    pageCount: 142,
    fileSize: '12.4 MB',
    description: 'The definitive handbook for online merchants, dropshippers, and appliance distributors. Learn inventory forecasting, multi-channel marketing, customer retention, and logistics.',
    sampleExcerpt: 'Chapter 1: The Core Architecture of High-Converting Digital Storefronts...\nChapter 2: Managing Inventory Cash Flow & Supplier Relations...',
    secureToken: 'DL_TOKEN_9921_EBOOK1',
    rating: 4.95,
    downloadCount: 840
  },
  {
    id: 'ebook-2',
    title: 'Smart Home Solar Inverter & LiFePO4 Installation Guide',
    author: 'Engr. Kunle Adebayo',
    category: 'Technology & Energy',
    price: 20,
    originalPrice: 45,
    format: 'PDF',
    coverImage: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=800&auto=format&fit=crop&q=80',
    pageCount: 98,
    fileSize: '18.2 MB',
    description: 'Technical manual for electrical engineers and homeowners in West Africa. Step-by-step wiring diagrams for pure sine wave inverters, MPPT solar controllers, and battery banks.',
    sampleExcerpt: 'Section 3: Calculating Peak Load for Air Conditioners & Freezers...\nSection 4: Cable Sizing and Circuit Breaker Safety Protocols...',
    secureToken: 'DL_TOKEN_8832_EBOOK2',
    rating: 4.9,
    downloadCount: 620
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-90284',
    customerId: 'cust-1',
    customerName: 'Amina Bello',
    customerEmail: 'amina.bello@example.com',
    items: [
      { product: PRODUCTS[0], quantity: 1 }
    ],
    subtotal: 335,
    shippingFee: 20,
    discount: 0,
    total: 355,
    currency: 'USD',
    status: 'Shipped',
    paymentMethod: 'Paystack Secured Card',
    paymentTransactionId: 'PSTK_TRX_9921048',
    shippingAddress: {
      fullName: 'Amina Bello',
      street: '14 Admiralty Way, Victoria Island',
      city: 'Lagos',
      state: 'Lagos State',
      country: 'Nigeria',
      zipCode: '101241',
      phone: '+234 802 345 6789'
    },
    timeline: [
      { status: 'Pending', timestamp: '2026-08-05 09:12', description: 'Order created in NEXOVIRA system' },
      { status: 'Paid', timestamp: '2026-08-05 09:14', description: 'Payment verified via Paystack Gateway' },
      { status: 'Packed', timestamp: '2026-08-06 11:30', description: 'Inspected and packed at NexaTech Fulfillment Center (Lagos)' },
      { status: 'Shipped', timestamp: '2026-08-07 08:45', description: 'Dispatched via Express Courier (Tracking: NX-882019)' }
    ],
    createdAt: '2026-08-05T09:12:00Z',
    sellerIds: ['store-1']
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    productId: 'prod-1',
    userName: 'Chidi Okafor',
    rating: 5,
    date: '2026-02-01',
    comment: 'This AC cools my sitting room in Lagos under 2 minutes! Power bill dropped significantly on Eco mode.',
    verifiedPurchase: true,
    helpfulCount: 42
  }
];

export const INITIAL_AFFILIATE_DATA: AffiliateData = {
  affiliateCode: 'NEXO-LAGOS88',
  totalClicks: 248,
  conversions: 18,
  pendingCommission: 120,
  approvedCommission: 480,
  withdrawableBalance: 480,
  totalWithdrawn: 850,
  currency: 'USD',
  links: [
    {
      id: 'aff-1',
      title: 'NEXOVIRA Pro-Cool 2.0 HP Split AC',
      type: 'Product',
      targetUrl: '/marketplace/prod-1',
      affiliateCode: 'NEXO-LAGOS88',
      fullAffiliateUrl: 'https://nexovira.com/marketplace/prod-1?ref=NEXO-LAGOS88',
      clicks: 120,
      conversions: 8,
      revenueGenerated: 2680,
      commissionEarned: 268,
      createdAt: '2026-07-15'
    },
    {
      id: 'aff-2',
      title: 'Full-Stack Modern Web Engineering Masterclass',
      type: 'Course',
      targetUrl: '/academy/course-1',
      affiliateCode: 'NEXO-LAGOS88',
      fullAffiliateUrl: 'https://nexovira.com/academy/course-1?ref=NEXO-LAGOS88',
      clicks: 84,
      conversions: 7,
      revenueGenerated: 343,
      commissionEarned: 68.6,
      createdAt: '2026-07-20'
    }
  ],
  recentCommissions: [
    { id: 'com-1', itemTitle: 'NEXOVIRA Pro-Cool AC Purchase', type: 'Product Referral (10%)', date: '2026-08-05', amount: 33.5, status: 'Approved' },
    { id: 'com-2', itemTitle: 'Full-Stack Engineering Course', type: 'Course Referral (20%)', date: '2026-08-06', amount: 9.8, status: 'Approved' },
    { id: 'com-3', itemTitle: 'E-Commerce Blueprint Book', type: 'E-Book Referral (25%)', date: '2026-08-07', amount: 3.75, status: 'Pending' }
  ]
};

export const INITIAL_LEDGER: FinancialLedgerItem[] = [
  { id: 'LEDG-1001', type: 'Payment', amount: 355, currency: 'USD', description: 'Customer Payment - Order ORD-90284', timestamp: '2026-08-05 09:14', status: 'Completed', reference: 'PSTK_TRX_9921048' },
  { id: 'LEDG-1002', type: 'Commission', amount: 33.5, currency: 'USD', description: 'Affiliate Reward Approved - User NEXO-LAGOS88', timestamp: '2026-08-05 09:15', status: 'Completed', reference: 'AFF_COMM_9912' },
  { id: 'LEDG-1003', type: 'Payout', amount: 300, currency: 'USD', description: 'Seller Payout - NexaTech Global Store (Lagos Bank)', timestamp: '2026-08-06 14:00', status: 'Completed', reference: 'BANK_TRF_882190' }
];

export const INITIAL_BRAND_SETTINGS: GlobalBrandSettings = {
  brandName: 'NEXOVIRA',
  tagline: 'Innovation begins with vision. Smart living, better every day.',
  whatsappPhone: '+2348006392832',
  contactEmail: 'support@nexovira.com',
  defaultCurrency: 'NGN',
  ownerProfile: {
    name: 'NEXOVIRA Executive Owner',
    email: 'owner@nexovira.com',
    phone: '+234 800 NEXOVIRA',
    country: 'Nigeria',
    city: 'Lagos',
    hubAddress: 'NEXOVIRA Innovation Center, Victoria Island, Lagos, Nigeria',
    verified: true
  }
};

export const DEFAULT_HOMEPAGE_SECTIONS: HomepageSection[] = [
  { id: 'sec-1', type: 'hero', title: 'Main Hero AI Search', enabled: true, order: 1 },
  { id: 'sec-2', type: 'ecosystem-cards', title: 'Six Ecosystem Core Cards', enabled: true, order: 2 },
  { id: 'sec-3', type: 'categories', title: 'Appliance & Tech Categories', enabled: true, order: 3 },
  { id: 'sec-4', type: 'flash-deals', title: 'NEXOVIRA Flash Deals', enabled: true, order: 4 },
  { id: 'sec-5', type: 'featured-products', title: 'Marketplace Showcase', enabled: true, order: 5 },
  { id: 'sec-6', type: 'services-showcase', title: 'Tech & Digital Services Spotlight', enabled: true, order: 6 },
  { id: 'sec-7', type: 'academy-showcase', title: 'NEXOVIRA Academy Courses', enabled: true, order: 7 },
  { id: 'sec-8', type: 'library-showcase', title: 'Digital Library & Resources', enabled: true, order: 8 },
  { id: 'sec-9', type: 'top-sellers', title: 'Verified Storefront Showcase', enabled: true, order: 9 }
];
