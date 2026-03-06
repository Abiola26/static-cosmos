import api from "@/lib/api";
import { ApiResponse, OrderResponseDto, OrderCreateDto, PagedResult } from "@/types";

export const ordersApi = {
    createOrder: async (order: OrderCreateDto) => {
        const response = await api.post<ApiResponse<OrderResponseDto>>("/orders", order);
        return response.data;
    },

    getUserOrders: async (pageNumber = 1, pageSize = 10) => {
        const response = await api.get<ApiResponse<PagedResult<OrderResponseDto>>>(
            `/orders?pageNumber=${pageNumber}&pageSize=${pageSize}`
        );
        return response.data;
    },

    getOrderById: async (id: string) => {
        const response = await api.get<ApiResponse<OrderResponseDto>>(`/orders/${id}`);
        return response.data;
    },
};
