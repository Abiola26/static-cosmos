import api from "@/lib/api";
import { ApiResponse, OrderResponseDto, OrderCreateDto, PagedResult, OrderConfigurationResponseDto } from "@/types";

export const ordersApi = {
    createOrder: async (order: OrderCreateDto) => {
        const response = await api.post<ApiResponse<OrderResponseDto>>("/orders", order);
        return response.data;
    },

    getUserOrders: async (pageNumber = 1, pageSize = 10) => {
        const response = await api.get<ApiResponse<PagedResult<OrderResponseDto>>>(
            `/orders/my-orders?pageNumber=${pageNumber}&pageSize=${pageSize}`
        );
        return response.data;
    },

    getOrderById: async (id: string) => {
        const response = await api.get<ApiResponse<OrderResponseDto>>(`/orders/${id}`);
        return response.data;
    },

    verifyPayment: async (id: string, reference: string) => {
        const response = await api.post<ApiResponse<OrderResponseDto>>(
            `/orders/${id}/verify-payment?reference=${reference}`
        );
        return response.data;
    },

    getAllOrders: async (pageNumber = 1, pageSize = 10) => {
        const response = await api.get<ApiResponse<PagedResult<OrderResponseDto>>>(
            `/orders?pageNumber=${pageNumber}&pageSize=${pageSize}`
        );
        return response.data;
    },

    updateOrderStatus: async (id: string, status: string) => {
        const response = await api.patch<ApiResponse<OrderResponseDto>>(
            `/orders/${id}/status`,
            { status }
        );
        return response.data;
    },

    deleteOrder: async (id: string) => {
        const response = await api.delete<ApiResponse<void>>(`/orders/${id}`);
        return response.data;
    },

    cancelOrder: async (id: string) => {
        const response = await api.delete<ApiResponse<void>>(`/orders/${id}/cancel`);
        return response.data;
    },

    getOrderConfiguration: async () => {
        const response = await api.get<ApiResponse<OrderConfigurationResponseDto>>("/orders/configuration");
        return response.data;
    },
};
