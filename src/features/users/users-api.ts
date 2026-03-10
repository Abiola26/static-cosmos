import api from "@/lib/api";
import { ApiResponse, UserResponseDto } from "@/types";

export const usersApi = {
    getAllUsers: async () => {
        const response = await api.get<ApiResponse<UserResponseDto[]>>("/users");
        return response.data;
    },

    getUserById: async (id: string) => {
        const response = await api.get<ApiResponse<UserResponseDto>>(`/users/${id}`);
        return response.data;
    },

    updateUserRole: async (id: string, role: number) => {
        const response = await api.patch<ApiResponse<UserResponseDto>>(`/users/${id}/role`, { role });
        return response.data;
    },

    deleteUser: async (id: string) => {
        const response = await api.delete<ApiResponse<boolean>>(`/users/${id}`);
        return response.data;
    },

    getMe: async () => {
        const response = await api.get<ApiResponse<UserResponseDto>>("/auth/me");
        return response.data;
    },
};
