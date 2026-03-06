"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { booksApi } from "@/features/books/books-api";
import { BookGrid } from "@/features/books/BookGrid";
import { SearchBar } from "@/features/books/SearchBar";
import { PagedResult, BookResponseDto } from "@/types";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";

export default function BooksPage() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [categoryId, setCategoryId] = useState<string>("all");

    const { data: booksData, isLoading: isLoadingBooks } = useQuery({
        queryKey: ["books", page, categoryId, search],
        queryFn: async () => {
            if (search && search.length >= 3) {
                return await booksApi.searchBooks(search);
            }
            if (categoryId !== "all") {
                return await booksApi.getBooksByCategory(categoryId, page);
            }
            return await booksApi.getBooks(page);
        },
    });

    const { data: categoriesData } = useQuery({
        queryKey: ["categories"],
        queryFn: booksApi.getCategories,
    });

    // Safe data extraction with type narrowing
    const getBooks = () => {
        if (!booksData?.success || !booksData.data) return [];

        // If it's a search result, it's a direct array
        if (Array.isArray(booksData.data)) {
            return booksData.data;
        }

        // If it's a paged result, it has an items property
        if ("items" in booksData.data) {
            return booksData.data.items;
        }

        return [];
    };

    const books = getBooks();

    const pagination = booksData?.success && booksData.data && !Array.isArray(booksData.data) && "totalPages" in booksData.data
        ? booksData.data as PagedResult<BookResponseDto>
        : null;

    return (
        <div className="container mx-auto px-4 py-8 space-y-8 min-h-screen">
            <header className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="space-y-1 text-center md:text-left">
                    <h1 className="text-4xl font-extrabold font-outfit tracking-tight">Explore Library</h1>
                    <p className="text-muted-foreground">Find your next favorite story today.</p>
                </div>
                <SearchBar onSearch={setSearch} />
            </header>

            <section className="flex flex-col md:flex-row gap-4 justify-between items-center bg-card/30 backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-lg">
                <div className="flex gap-4 items-center">
                    <Button variant="outline" size="sm" className="rounded-full flex items-center gap-2">
                        <SlidersHorizontal className="h-4 w-4" />
                        Filters
                    </Button>
                    <Select value={categoryId} onValueChange={setCategoryId}>
                        <SelectTrigger className="w-[180px] rounded-full bg-transparent border-muted">
                            <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            {categoriesData?.data?.map((cat) => (
                                <SelectItem key={cat.id} value={cat.id}>
                                    {cat.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="text-sm text-muted-foreground font-medium">
                    Showing <span className="text-foreground">{books.length}</span> results
                </div>
            </section>

            <BookGrid books={books} isLoading={isLoadingBooks} />

            {pagination && pagination.totalPages > 1 && (
                <div className="flex justify-center gap-2 pt-8">
                    <Button
                        variant="outline"
                        disabled={page === 1}
                        onClick={() => setPage((p) => p - 1)}
                        className="rounded-full px-6"
                    >
                        Previous
                    </Button>
                    <div className="flex items-center px-4 font-bold">
                        Page {page} of {pagination.totalPages}
                    </div>
                    <Button
                        variant="outline"
                        disabled={page === pagination.totalPages}
                        onClick={() => setPage((p) => p + 1)}
                        className="rounded-full px-6"
                    >
                        Next
                    </Button>
                </div>
            )}
        </div>
    );
}
