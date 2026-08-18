export type CategoryId = 
  | 'refrigerators'
  | 'freezers'
  | 'washing-machines'
  | 'air-conditioners'
  | 'fans'
  | 'microwaves'
  | 'cookers'
  | 'blenders'
  | 'air-fryers'
  | 'vacuums'
  | 'tvs'
  | 'audio'
  | 'laptops'
  | 'gaming'
  | 'accessories'
  | 'ebooks'
  | string;

export interface Category {
  id: CategoryId;
  name: string;
  group: 'appliances' | 'electronics' | 'smart-home';
  icon: string;
  itemCount: number;
  description: string;
}

export type CurrencyCode = 'NGN' | 'USD' | 'EUR' | 'GBP' | 'CAD' | 'AUD' | 'GHS' | 'KES' | 'ZAR' | 'AED';

export interface CurrencyInfo {
  code: CurrencyCode;
  symbol: string;
  name: string;
  flag: string;
  rateToUSD: number;
  region: string;
}

export type EcosystemIntent = 
  | 'PRODUCT' 
  | 'SERVICE' 
  | 'COURSE' 
  | 'EBOOK' 
  | 'AI' 
  | 'AFFILIATE' 
  | 'STORE' 
  | 'GENERAL_SEARCH';

export interface ProductAttribute {
  name: string;
  value: string;
}

export interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  attributes: Record<string, string>;
}

export interface ProductImage {
  id: string;
  url: string;
  displayOrder: number;
  isPrimary: boolean;
  createdAt?: string;
  fileName?: string;
  fileSize?: string;
}

export interface Product {
  id: string;
  title: string;
  brand: string;
  categoryId: CategoryId;
  price: number;
  originalPrice?: number;
  discountPercentage?: number;
  currency: string;
  rating: number;
  reviewCount: number;
  stock: number;
  sellerId: string;
  seller_id?: string;
  sellerName: string;
  sellerVerified: boolean;
  images: string[];
  productImages?: ProductImage[];
  videoUrl?: string;
  description: string;
  keyFeatures: string[];
  specifications: Record<string, string>;
  energyRating?: string;
  capacity?: string;
  warranty: string;
  featured?: boolean;
  isFlashDeal?: boolean;
  isBestSeller?: boolean;
  tags: string[];
  variants?: ProductVariant[];
  affiliateCommissionRate?: number;
  affiliateEnabled?: boolean;
  createdAt: string;

  // Digital E-book Fields
  productType?: 'physical' | 'digital_ebook';
  isDigital?: boolean;
  author?: string;
  pdfUrl?: string;
  pdfFileName?: string;
  pdfFileSize?: string;
  publisher?: string;
  publicationYear?: string;
  isbn?: string;
  pagesCount?: number;
  language?: string;
  previewPagesCount?: number;

  // Soft Deletion & Audit Fields
  deleted_at?: string;
  deleted_by?: string;
  deleted_by_email?: string;
  deletion_reason?: string;
  status?: 'active' | 'deleted' | 'draft' | 'archived' | 'out_of_stock' | string;
  publicly_visible?: boolean;
  digitalAccessRevoked?: boolean;
}

export interface SecurityAuditLog {
  id: string;
  userId: string;
  userEmail: string;
  userRole: 'admin' | 'seller' | 'customer' | 'system';
  action: 
    | 'PRODUCT_CREATED'
    | 'PRODUCT_UPDATED'
    | 'PRODUCT_DELETED'
    | 'ADMIN_PRODUCT_DELETED'
    | 'ADMIN_LOGIN'
    | 'SELLER_LOGIN'
    | 'ROLE_CHANGE'
    | 'PASSWORD_CHANGE'
    | 'PAYOUT_REQUESTED'
    | 'PAYOUT_COMPLETED'
    | 'WALLET_ADJUSTMENT'
    | 'BANK_ACCOUNT_UPDATED'
    | 'SECURITY_EVENT';
  resourceId: string;
  resourceType: 'product' | 'order' | 'user' | 'payout' | 'service' | 'course' | 'wallet' | 'bank_account';
  result: 'SUCCESS' | 'DENIED' | 'FAILED';
  errorMessage?: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export type ItemStatus = 'draft' | 'published' | 'unpublished' | 'coming_soon';

export interface ServicePackage {
  name: 'Basic' | 'Pro' | 'Enterprise' | string;
  price: number;
  deliveryDays: number;
  revisions: string;
  features: string[];
}

export interface TechService {
  id: string;
  title: string;
  category: 'Software & Web' | 'App Development' | 'UI/UX Design' | 'Branding & Graphics' | 'Digital Marketing' | 'AI & Data' | string;
  providerName: string;
  providerVerified: boolean;
  providerAvatar: string;
  location: string;
  startingPrice: number;
  deliveryDays: number;
  rating: number;
  reviewCount: number;
  image: string;
  description: string;
  keyFeatures: string[];
  packages: ServicePackage[];
  published?: boolean;
  status?: ItemStatus;
  providerId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CourseLesson {
  id: string;
  title: string;
  duration: string;
  videoUrl?: string;
  textContent?: string;
  previewAvailable?: boolean;
  downloadableResources?: { name: string; url: string }[];
}

export interface CourseModule {
  id: string;
  title: string;
  lessons: CourseLesson[];
}

export interface Course {
  id: string;
  title: string;
  category: string;
  instructor: string;
  instructorAvatar: string;
  instructorTitle: string;
  price: number;
  originalPrice?: number;
  priceType?: 'paid' | 'free';
  currency?: string;
  rating: number;
  reviewCount: number;
  studentCount: number;
  lessonsCount: number;
  totalHours: string;
  thumbnail: string;
  description: string;
  learningOutcomes: string[];
  requirements?: string[];
  modules: CourseModule[];
  certificateAvailable: boolean;
  published?: boolean;
  status?: ItemStatus;
  allowAffiliatePromotion?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CourseEnrollment {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  courseId: string;
  courseTitle: string;
  courseThumbnail?: string;
  instructor?: string;
  enrolledAt: string;
  paymentStatus: 'free' | 'paid' | 'verified';
  paymentTransactionId?: string;
  progressPercent: number;
  completedLessonIds: string[];
  lastAccessedAt: string;
  certificateUrl?: string;
  completedAt?: string;
}

export interface DigitalProduct {
  id: string;
  title: string;
  author: string;
  category: string;
  price: number;
  originalPrice?: number;
  format: 'PDF' | 'EPUB' | 'ZIP' | 'DOCX';
  coverImage: string;
  pageCount?: number;
  fileSize: string;
  description: string;
  sampleExcerpt: string;
  secureToken: string;
  rating: number;
  downloadCount: number;
  published?: boolean;
}

export interface Store {
  id: string;
  name: string;
  logo: string;
  banner: string;
  verified: boolean;
  status: 'verified' | 'pending' | 'suspended';
  rating: number;
  reviewCount: number;
  joinedDate: string;
  productsCount: number;
  description: string;
  location: string;
  country: string;
  currency: CurrencyCode;
  contactEmail: string;
  contactPhone: string;
  payoutMethod: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariantId?: string;
}

export type OrderStatus =
  | 'Pending'
  | 'pending'
  | 'Pending Order'
  | 'Confirmed'
  | 'Payment Processing'
  | 'Paid'
  | 'Processing'
  | 'Packed'
  | 'Shipped'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled'
  | 'Refunded';

export interface OrderTimelineEvent {
  status: OrderStatus;
  timestamp: string;
  description: string;
  location?: string;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  items: CartItem[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  currency: string;
  status: OrderStatus;
  paymentMethod: string;
  paymentTransactionId: string;
  shippingAddress: {
    fullName: string;
    street: string;
    city: string;
    state?: string;
    country: string;
    zipCode?: string;
    phone: string;
  };
  timeline: OrderTimelineEvent[];
  createdAt: string;
  sellerIds: string[];
  affiliateId?: string;
  affiliateCode?: string;
  selfReferral?: boolean;
}

export interface Review {
  id: string;
  productId: string;
  orderId?: string;
  customerId?: string;
  title?: string;
  userName: string;
  userAvatar?: string;
  images?: string[];
  rating: number;
  date: string;
  comment: string;
  verifiedPurchase: boolean;
  helpfulCount: number;
  createdAt?: string;
  sellerReply?: { comment: string; date: string };
}

export interface AIRecommendation {
  productId?: string;
  serviceId?: string;
  courseId?: string;
  digitalProductId?: string;
  matchScore: number;
  reason: string;
  intent: EcosystemIntent;
  suggestedAction?: string;
}

export interface AIMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  intent?: EcosystemIntent;
  suggestedProducts?: Product[];
  suggestedServices?: TechService[];
  suggestedCourses?: Course[];
  suggestedEbooks?: DigitalProduct[];
  compareProducts?: Product[];
  actions?: { label: string; actionQuery: string }[];
}

export interface AffiliateLinkItem {
  id: string;
  title: string;
  type: 'Product' | 'Course' | 'Ebook' | 'Service' | 'Campaign';
  targetUrl: string;
  affiliateCode: string;
  fullAffiliateUrl: string;
  clicks: number;
  conversions: number;
  revenueGenerated: number;
  commissionEarned: number;
  createdAt: string;
}

export interface AffiliateData {
  affiliateCode: string;
  totalClicks: number;
  conversions: number;
  pendingCommission: number;
  approvedCommission: number;
  withdrawableBalance: number;
  totalWithdrawn: number;
  currency: CurrencyCode;
  links: AffiliateLinkItem[];
  recentCommissions: {
    id: string;
    itemTitle: string;
    type: string;
    date: string;
    amount: number;
    status: 'Pending' | 'Approved' | 'Withdrawn';
  }[];
}

export interface FinancialLedgerItem {
  id: string;
  type: 'Payment' | 'Refund' | 'Commission' | 'Payout' | 'Adjustment' | 'Fee';
  amount: number;
  currency: CurrencyCode;
  description: string;
  timestamp: string;
  status: 'Completed' | 'Pending' | 'Flagged';
  reference: string;
}

export interface OwnerProfile {
  name: string;
  email: string;
  phone: string;
  country: 'Nigeria';
  city: 'Lagos';
  hubAddress: string;
  verified: true;
}

export interface GlobalBrandSettings {
  brandName: string;
  tagline: string;
  whatsappPhone: string;
  contactEmail: string;
  defaultCurrency: CurrencyCode;
  ownerProfile: OwnerProfile;
}

export type UserRole = 'customer' | 'seller' | 'affiliate' | 'admin';

export interface CategoryRequest {
  id: string;
  sellerId: string;
  sellerName: string;
  categoryName: string;
  group: 'appliances' | 'electronics' | 'smart-home';
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'replied';
  createdAt: string;
}

export interface SellerNotification {
  id: string;
  sellerId?: string;
  userId?: string;
  title: string;
  message: string;
  type: string;
  orderId?: string;
  read: boolean;
  createdAt: string;
}

export interface AffiliateConfig {
  minCommissionRate: number; // e.g. 1%
  maxCommissionRate: number; // e.g. 30%
  attributionWindowDays: number; // e.g. 30 days
  attributionRule: 'last-click';
  marketplaceCommissionRate: number; // e.g. 5%
  settlementPeriodHours: number; // e.g. 24, 48, 72, 168 hours
  minWithdrawalAmount: number; // e.g. 1000 NGN or $10 USD
  defaultCommissionRate: number; // e.g. 10%
  defaultCommissionType: 'percentage' | 'fixed';
  conversionFeePercent?: number; // e.g. 0% or 1%
}

export interface OrderFinancials {
  id: string;
  orderId: string;
  productId: string;
  sellerId: string;
  affiliateId?: string;
  affiliateCode?: string;
  productPriceSnapshot: number;
  marketplaceRateSnapshot: number;
  affiliateRateSnapshot: number;
  marketplaceCommissionSnapshot: number;
  affiliateCommissionSnapshot: number;
  sellerEarningsSnapshot: number;
  paymentFeeSnapshot: number;
  selfReferral: boolean;
  createdAt: string;
}

export interface AffiliateProfile {
  id: string; // e.g. AFF-8K4P2M
  uid: string;
  userName: string;
  userEmail: string;
  affiliateCode: string; // e.g. JOHN8K4P2M
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  promotionalChannels?: string;
  totalClicks: number;
  totalConversions: number;
  pendingCommission: number;
  approvedCommission: number;
  withdrawableBalance: number;
  totalWithdrawn: number;
  balances?: Record<string, { available: number; pending: number; totalEarned: number; totalWithdrawn: number }>;
  bankDetails?: {
    bankName: string;
    accountNumber: string;
    accountName: string;
    swiftCode?: string;
    payoutProvider?: string;
  };
  createdAt: string;
  updatedAt?: string;
}

export interface AffiliateLinkRecord {
  id: string;
  affiliateUid: string;
  affiliateCode: string;
  targetId: string;
  targetTitle: string;
  contentType: 'PRODUCT' | 'SERVICE' | 'COURSE' | 'EBOOK' | 'CUSTOM';
  targetPath: string;
  url: string;
  clicks: number;
  conversions: number;
  revenueGenerated: number;
  commissionEarned: number;
  status?: 'active' | 'archived';
  createdAt: string;
  updatedAt?: string;
}

export interface AffiliateCommissionRecord {
  id: string;
  affiliateUid: string;
  affiliateId?: string;
  affiliateCode: string;
  productId: string;
  productTitle: string;
  sellerId: string;
  orderId: string;
  saleAmount: number;
  commissionRate: number;
  commissionType?: 'percentage' | 'fixed';
  commissionAmount: number;
  currency?: CurrencyCode;
  status: 'PENDING' | 'APPROVED' | 'AVAILABLE' | 'PAID' | 'REVERSED' | 'FAILED' | 'Pending' | 'Approved' | 'Withdrawn' | 'Rejected';
  selfReferral?: boolean;
  availableAt?: string; // Timestamp when settlement completes
  createdAt: string;
  updatedAt?: string;
}

export interface AffiliateLedger {
  id: string;
  affiliateId: string;
  affiliateUid?: string;
  type: 'COMMISSION_EARNED' | 'COMMISSION_SETTLED' | 'COMMISSION_APPROVED' | 'PAYOUT_REQUESTED' | 'PAYOUT_COMPLETED' | 'PAYOUT_FAILED' | 'COMMISSION_REVERSED';
  amount: number;
  currency?: CurrencyCode;
  orderId?: string;
  commissionId?: string;
  payoutId?: string;
  description: string;
  createdAt: string;
}

export interface PayoutRequest {
  id: string;
  affiliateId: string;
  affiliateUid?: string;
  affiliateCode: string;
  affiliateName: string;
  userEmail: string;
  amount: number;
  currency: CurrencyCode;
  targetCurrency?: CurrencyCode;
  convertedAmount?: number;
  exchangeRate?: number;
  conversionFee?: number;
  bankDetails: {
    bankName: string;
    accountNumber: string;
    accountName: string;
    swiftCode?: string;
    payoutProvider?: string;
  };
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'PAID' | 'REJECTED' | 'FAILED' | 'CANCELLED';
  rejectionReason?: string;
  createdAt: string;
  paidAt?: string;
}

export interface AffiliateNotification {
  id: string;
  affiliateUid: string;
  title: string;
  message: string;
  type: 'sale' | 'available' | 'payout_requested' | 'payout_completed' | 'payout_failed' | 'reversed' | 'system';
  read: boolean;
  createdAt: string;
}

export interface PriceAlert {
  id: string;
  userId: string;
  userEmail: string;
  userName?: string;
  productId: string;
  productTitle: string;
  productImage: string;
  productCategory: string;
  initialPriceUSD: number;     // Base price when alert was created
  targetPriceUSD: number;      // Threshold price in USD
  currency: CurrencyCode;      // Currency preferred when alert was set
  targetPriceNative: number;   // Formatted price in native currency
  status: 'ACTIVE' | 'TRIGGERED' | 'DISMISSED';
  triggeredAt?: string;
  triggeredPriceUSD?: number;
  currentProductPriceUSD?: number;
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

export interface PriceAlertNotification {
  id: string;
  userId: string;
  alertId: string;
  productId: string;
  productTitle: string;
  productImage: string;
  oldPriceUSD: number;
  newPriceUSD: number;
  targetPriceUSD: number;
  discountPercent: number;
  currency: CurrencyCode;
  read: boolean;
  createdAt: string;
}

export type ActiveEcosystemView = 
  | 'home' 
  | 'marketplace' 
  | 'services' 
  | 'academy' 
  | 'library' 
  | 'ai' 
  | 'affiliate' 
  | 'seller' 
  | 'admin' 
  | 'account'
  | 'signin'
  | 'signup'
  | 'about'
  | 'privacy'
  | 'terms'
  | 'contact'
  | 'presentation';

export interface SellerBankAccount {
  bankName: string;
  bankCode?: string;
  accountNumber: string; // 10 digit NUBAN
  maskedAccountNumber?: string; // e.g. ••••••6789
  accountName: string;   // Real provider-verified official account holder name (NON-EDITABLE)
  verificationStatus: 'unverified' | 'verified' | 'failed' | 'mismatch';
  providerReference?: string; // e.g. NEXO_NUBAN_REF_17238491
  verifiedAt?: string;
  nameMatchStatus?: 'compatible' | 'mismatch' | 'unchecked';
  nameMatchScore?: number;
  nameMatchNotes?: string;
  verificationMessage?: string;
}

export interface SellerBankAccountAuditLog {
  id: string;
  sellerId: string;
  adminId?: string;
  action: 'BANK_VERIFIED' | 'BANK_CHANGED' | 'ADMIN_OVERRIDE' | 'PAYOUT_HELD';
  previousAccountName?: string;
  newAccountName: string;
  bankName: string;
  accountNumberMasked: string;
  providerReference?: string;
  reason?: string;
  timestamp: string;
}

export interface SellerWalletSummary {
  sellerId: string;
  availableBalanceNGN: number;  // Amount currently available for payout in ₦ NGN
  pendingBalanceNGN: number;    // Earnings still within settlement window in ₦ NGN
  totalSalesNGN: number;        // Total gross value of qualifying sales in ₦ NGN
  totalEarnedNGN: number;       // Total net seller earnings after deductions in ₦ NGN
  totalPaidOutNGN: number;      // Total sent to bank account in ₦ NGN
  nextPayoutAmountNGN: number;  // Amount available for next payout
  nextPayoutDate?: string;      // Expected settlement date
  currency: 'NGN';              // Permanently ₦ NGN
}

export interface SellerConfig {
  settlementPeriodHours: number; // e.g. 24 hours
  minWithdrawalAmount: number;   // e.g. 5000 NGN
  autoPayoutEnabled: boolean;    // true/false
  platformFeePercent: number;    // e.g. 5%
}

export interface SellerLedgerEntry {
  id: string;
  sellerId: string;
  sellerUid?: string;
  type: 
    | 'SALE_EARNING' 
    | 'SETTLEMENT_CREDIT' 
    | 'PLATFORM_FEE' 
    | 'PAYOUT_REQUESTED' 
    | 'PAYOUT_COMPLETED' 
    | 'PAYOUT_FAILED' 
    | 'REFUND_REVERSAL';
  amountNGN: number;             // Amount in ₦ NGN (positive for credit, negative for debit)
  currency: 'NGN';
  orderId?: string;
  payoutId?: string;
  description: string;
  conversionDetails?: {
    originalCurrency: string;     // e.g. 'USD'
    originalAmount: number;       // e.g. 100
    exchangeRate: number;         // e.g. 1600 (₦1600 / USD)
    conversionFee: number;        // e.g. 0
    convertedGrossNGN: number;    // e.g. 160,000 NGN
    platformFeeNGN: number;       // e.g. 8,000 NGN
    netSellerEarningNGN: number;  // e.g. 152,000 NGN
  };
  createdAt: string;
}

export interface SellerPayoutRecord {
  id: string;
  payoutId?: string;
  sellerId: string;
  sellerUid?: string;
  sellerName: string;
  contactEmail: string;
  amountNGN: number;
  currency: 'NGN';
  bankDetails: SellerBankAccount;
  status: 'Pending' | 'Processing' | 'Completed' | 'Failed' | 'Reversed' | 'Cancelled' | 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'REVERSED' | 'CANCELLED';
  transferReference?: string;
  failureReason?: string;
  createdAt: string;
  completedAt?: string;
}

export interface HomepageSection {
  id: string;
  type: 'hero' | 'ecosystem-cards' | 'ai-prompt' | 'categories' | 'flash-deals' | 'featured-products' | 'services-showcase' | 'academy-showcase' | 'library-showcase' | 'top-sellers';
  title: string;
  enabled: boolean;
  order: number;
}
