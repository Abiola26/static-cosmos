import api from './api';
import { ApiResponse, DashboardReportDto, InventoryReportDto, UserEngagementReportDto, ReviewAnalyticsReportDto } from '@/types';

export const reportService = {
    getDashboardReport: async () => {
        const response = await api.get<ApiResponse<DashboardReportDto>>('/reports/dashboard');
        return response.data;
    },

    getInventoryReport: async () => {
        const response = await api.get<ApiResponse<InventoryReportDto>>('/reports/inventory');
        return response.data;
    },

    getUserEngagementReport: async () => {
        const response = await api.get<ApiResponse<UserEngagementReportDto>>('/reports/user-engagement');
        return response.data;
    },

    getReviewAnalyticsReport: async () => {
        const response = await api.get<ApiResponse<ReviewAnalyticsReportDto>>('/reports/reviews');
        return response.data;
    },

    exportSalesReport: async (startDate?: string, endDate?: string) => {
        const response = await api.get('/reports/export/sales', {
            params: { startDate, endDate },
            responseType: 'blob',
        });
        return response.data;
    }
};
