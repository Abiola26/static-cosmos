/**
 * Base API Response wrapper
 */
export interface ApiResponse<T = any> {
    success: boolean;
    data: T | null;
    message: string;
    errors: string[];
    statusCode: number;
}

/**
 * Paginated Result wrapper
 */
export interface PagedResult<T> {
    items: T[];
    pageNumber: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
}

/**
 * Authentication Types
 */
export interface AuthResponseDto {
    userId: string;
    fullName: string;
    email: string;
    role: string;
    token: string;
    expiresAt: string;
}

export interface UserLoginDto {
    email: string;
    password: string;
}

export interface UserRegisterDto {
    fullName: string;
    email: string;
    password: string;
    phoneNumber?: string;
}

export interface UserResponseDto {
    id: string;
    fullName: string;
    email: string;
    phoneNumber?: string;
    role: string;
    createdAt: string;
}

/**
 * Book Types
 */
export interface BookResponseDto {
    id: string;
    title: string;
    description: string;
    isbn: string;
    publisher?: string;
    publicationDate?: string;
    price: number;
    currency: string;
    author: string;
    pages: number;
    language?: string;
    coverImageUrl?: string;
    totalQuantity: number;
    categoryId: string;
    categoryName: string;
    averageRating: number;
    reviewCount: number;
    createdAt: string;
    updatedAt: string;
}

export interface BookCreateDto {
    title: string;
    description: string;
    isbn: string;
    publisher?: string;
    publicationDate?: string;
    price: number;
    currency?: string;
    author: string;
    pages: number;
    language?: string;
    coverImageUrl?: string;
    totalQuantity: number;
    categoryId: string;
}

export interface BookUpdateDto {
    title?: string;
    description?: string;
    publisher?: string;
    publicationDate?: string;
    price?: number;
    currency?: string;
    author?: string;
    pages?: number;
    language?: string;
    coverImageUrl?: string;
    totalQuantity?: number;
    categoryId?: string;
}

/**
 * Category Types
 */
export interface CategoryResponseDto {
    id: string;
    name: string;
    bookCount: number;
    createdAt: string;
    updatedAt: string;
}

export interface CategoryCreateDto {
    name: string;
}

/**
 * Review Types
 */
export interface ReviewResponseDto {
    id: string;
    bookId: string;
    userId: string;
    userFullName: string;
    rating: number;
    comment: string;
    createdAt: string;
}

export interface ReviewCreateDto {
    rating: number;
    comment: string;
}

export interface BookReviewSummaryDto {
    averageRating: number;
    reviewCount: number;
    recentReviews: ReviewResponseDto[];
}

/**
 * Shopping Cart Types
 */
export interface ShoppingCartItemResponseDto {
    id: string;
    bookId: string;
    bookTitle: string;
    isbn: string;
    quantity: number;
    unitPrice: number;
    currency: string;
    subTotal: number;
}

export interface ShoppingCartResponseDto {
    id: string;
    userId: string;
    totalPrice: number;
    currency: string;
    itemCount: number;
    isEmpty: boolean;
    items: ShoppingCartItemResponseDto[];
    lastModified: string;
}

export interface AddToCartDto {
    bookId: string;
    quantity: number;
}

export interface UpdateCartItemDto {
    quantity: number;
}

/**
 * Order Types
 */
export interface OrderItemResponseDto {
    id: string;
    bookId: string;
    bookTitle: string;
    isbn: string;
    quantity: number;
    unitPrice: number;
    currency: string;
    subTotal: number;
}

export interface OrderResponseDto {
    id: string;
    userId: string;
    userFullName: string;
    totalAmount: number;
    shippingFee: number;
    shippingAddress: string;
    paymentMethod: string;
    paymentReference?: string;
    isPaid: boolean;
    currency: string;
    status: string;
    items: OrderItemResponseDto[];
    createdAt: string;
    updatedAt: string;
}

export interface OrderCreateDto {
    items: { bookId: string; quantity: number }[];
    shippingAddress: string;
    paymentMethod: string;
}

export interface OrderUpdateStatusDto {
    status: string;
}

/**
 * Report Types
 */
export interface SalesSummaryDto {
    orderId: string;
    customerName: string;
    amount: number;
    status: string;
    date: string;
}

export interface TopBookDto {
    bookId: string;
    title: string;
    author: string;
    unitsSold: number;
    totalRevenue: number;
}

export interface MonthlySalesDto {
    month: string;
    revenue: number;
    orderCount: number;
}

export interface CategorySalesDto {
    categoryName: string;
    revenue: number;
    unitsSold: number;
}

export interface DashboardReportDto {
    totalOrders: number;
    totalBooks: number;
    totalUsers: number;
    totalRevenue: number;
    recentSales: SalesSummaryDto[];
    topSellingBooks: TopBookDto[];
    monthlySales: MonthlySalesDto[];
    salesByCategory: CategorySalesDto[];
}

export interface LowStockBookDto {
    bookId: string;
    title: string;
    currentStock: number;
}

export interface CategoryStockDto {
    categoryName: string;
    bookCount: number;
    totalStock: number;
}

export interface InventoryReportDto {
    totalStock: number;
    lowStockBooks: LowStockBookDto[];
    stockByCategory: CategoryStockDto[];
}

export interface TopCustomerDto {
    userId: string;
    fullName: string;
    totalOrders: number;
    totalSpent: number;
}

export interface UserGrowthDto {
    month: string;
    newUsers: number;
}

export interface UserEngagementReportDto {
    totalRegisteredUsers: number;
    activeUsersLast30Days: number;
    topCustomers: TopCustomerDto[];
    userGrowth: UserGrowthDto[];
}

export interface RatingCountDto {
    rating: number;
    count: number;
}

export interface TopRatedBookDto {
    bookId: string;
    title: string;
    averageRating: number;
    reviewCount: number;
}

export interface ReviewAnalyticsReportDto {
    averageRating: number;
    totalReviews: number;
    ratingDistribution: RatingCountDto[];
    topRatedBooks: TopRatedBookDto[];
}
