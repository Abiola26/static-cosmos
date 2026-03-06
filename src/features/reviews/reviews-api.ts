import api from "@/lib/api";
import { ApiResponse, ReviewResponseDto, ReviewCreateDto, BookReviewSummaryDto } from "@/types";

export const reviewsApi = {
    getBookReviews: async (bookId: string) => {
        const response = await api.get<ApiResponse<ReviewResponseDto[]>>(`/books/${bookId}/reviews`);
        return response.data;
    },

    getReviewSummary: async (bookId: string) => {
        const response = await api.get<ApiResponse<BookReviewSummaryDto>>(`/books/${bookId}/reviews/summary`);
        return response.data;
    },

    addReview: async (bookId: string, review: ReviewCreateDto) => {
        const response = await api.post<ApiResponse<ReviewResponseDto>>(`/books/${bookId}/reviews`, review);
        return response.data;
    },

    updateReview: async (reviewId: string, review: Partial<ReviewCreateDto>) => {
        const response = await api.put<ApiResponse<ReviewResponseDto>>(`/reviews/${reviewId}`, review);
        return response.data;
    },

    deleteReview: async (reviewId: string) => {
        const response = await api.delete<ApiResponse<void>>(`/reviews/${reviewId}`);
        return response.data;
    },
};
