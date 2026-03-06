"use client";

import { useQuery } from "@tanstack/react-query";
import { booksApi } from "@/features/books/books-api";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronRight, Layers } from "lucide-react";

export default function CategoriesPage() {
    const { data: categoriesData, isLoading } = useQuery({
        queryKey: ["categories"],
        queryFn: booksApi.getCategories,
    });

    const categories = categoriesData?.data || [];

    return (
        <div className="container mx-auto px-4 py-12 min-h-screen space-y-12 animate-in fade-in duration-700">
            <header className="space-y-4 border-b-4 border-primary pb-8">
                <h1 className="text-5xl lg:text-7xl font-black font-outfit tracking-tighter uppercase">Categories</h1>
                <p className="text-xl text-muted-foreground font-medium italic underline decoration-primary/30 underline-offset-8 decoration-2">
                    Browse our universe by genre and subject.
                </p>
            </header>

            {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <Skeleton key={i} className="h-40 rounded-3xl" />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {categories.map((category) => (
                        <Link key={category.id} href={`/books?categoryId=${category.id}`}>
                            <Card className="group relative overflow-hidden h-40 bg-card glass-morphism border-white/10 hover:border-primary/50 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl active:scale-95">
                                <CardContent className="h-full flex flex-col justify-center p-8 space-y-2">
                                    <div className="bg-primary/10 w-10 h-10 rounded-xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                        <Layers className="h-5 w-5" />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-2xl font-black font-outfit tracking-tight">{category.name}</h3>
                                        <ChevronRight className="h-6 w-6 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                                    </div>
                                </CardContent>
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
                            </Card>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
