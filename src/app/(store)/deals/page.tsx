"use client";

import { useQuery } from "@tanstack/react-query";
import { booksApi } from "@/features/books/books-api";
import { BookGrid } from "@/features/books/BookGrid";
import { Sparkles, Percent } from "lucide-react";

export default function DealsPage() {
    const { data: booksData, isLoading } = useQuery({
        queryKey: ["deals"],
        queryFn: () => booksApi.getBooks(1, 12),
    });

    const books = (booksData?.success && booksData.data && "items" in booksData.data)
        ? booksData.data.items
        : [];

    return (
        <div className="container mx-auto px-4 py-12 min-h-screen space-y-12 animate-in fade-in duration-700">
            <header className="flex flex-col md:flex-row justify-between items-end gap-6 border-b-4 border-primary pb-8">
                <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 bg-yellow-400/10 px-4 py-2 rounded-full border border-yellow-400/20">
                        <Sparkles className="h-4 w-4 text-yellow-600" />
                        <span className="text-xs font-black uppercase tracking-widest text-yellow-700">Limited Time Offers</span>
                    </div>
                    <h1 className="text-5xl lg:text-7xl font-black font-outfit tracking-tighter uppercase">Today&apos;s Deals</h1>
                    <p className="text-xl text-muted-foreground font-medium italic underline decoration-primary/30 underline-offset-8 decoration-2 max-w-xl">
                        Exclusive discounts on the world&apos;s most influential literature.
                    </p>
                </div>
                <div className="bg-primary p-6 rounded-3xl shadow-xl shadow-primary/20 flex flex-col items-center justify-center text-white">
                    <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-black font-outfit">UP TO</span>
                        <span className="text-6xl font-black font-outfit tracking-tight">50</span>
                        <Percent className="h-8 w-8" />
                    </div>
                    <span className="text-sm font-bold uppercase tracking-widest mt-1 opacity-80">OFF SELECT COLLECTIONS</span>
                </div>
            </header>

            <BookGrid books={books} isLoading={isLoading} />
        </div>
    );
}
