import api from "@/lib/api";
import { ApiResponse, PagedResult, BookResponseDto, CategoryResponseDto, BookCreateDto, BookUpdateDto, CategoryCreateDto } from "@/types";

export const booksApi = {
    getBooks: async (pageNumber = 1, pageSize = 12) => {
        const response = await api.get<ApiResponse<PagedResult<BookResponseDto>>>(
            `/books?pageNumber=${pageNumber}&pageSize=${pageSize}`
        );
        return response.data;
    },

    getBookById: async (id: string) => {
        const response = await api.get<ApiResponse<BookResponseDto>>(`/books/${id}`);
        return response.data;
    },

    searchBooks: async (title: string) => {
        const response = await api.get<ApiResponse<BookResponseDto[]>>(`/books/search/${title}`);
        return response.data;
    },

    getBooksByCategory: async (categoryId: string, pageNumber = 1, pageSize = 12) => {
        const response = await api.get<ApiResponse<PagedResult<BookResponseDto>>>(
            `/books/category/${categoryId}?pageNumber=${pageNumber}&pageSize=${pageSize}`
        );
        return response.data;
    },

    getCategories: async () => {
        const response = await api.get<ApiResponse<CategoryResponseDto[]>>("/categories");
        return response.data;
    },

    createBook: async (book: BookCreateDto) => {
        const response = await api.post<ApiResponse<BookResponseDto>>("/books", book);
        return response.data;
    },

    updateBook: async (id: string, book: BookUpdateDto) => {
        const response = await api.put<ApiResponse<BookResponseDto>>(`/books/${id}`, book);
        return response.data;
    },

    deleteBook: async (id: string) => {
        const response = await api.delete<ApiResponse<boolean>>(`/books/${id}`);
        return response.data;
    },

    bulkUpload: async (file: File) => {
        const formData = new FormData();
        formData.append("file", file);
        const response = await api.post<ApiResponse<any>>("/books/bulk-upload", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    },

    uploadCover: async (id: string, file: File) => {
        const formData = new FormData();
        formData.append("file", file);
        const response = await api.post<ApiResponse<string>>(`/books/${id}/cover`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    },

    createCategory: async (category: CategoryCreateDto) => {
        const response = await api.post<ApiResponse<CategoryResponseDto>>("/categories", category);
        return response.data;
    },

    updateCategory: async (id: string, category: CategoryCreateDto) => {
        const response = await api.put<ApiResponse<CategoryResponseDto>>(`/categories/${id}`, category);
        return response.data;
    },

    deleteCategory: async (id: string) => {
        const response = await api.delete<ApiResponse<boolean>>(`/categories/${id}`);
        return response.data;
    },
};
