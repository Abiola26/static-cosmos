"use client";

import { useQuery } from "@tanstack/react-query";
import { booksApi } from "@/features/books/books-api";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Star, ArrowLeft, ShoppingCart, Heart, Share2, BookOpen } from "lucide-react";
import { toast } from "sonner";

import { ReviewList } from "@/features/reviews/ReviewList";
import { ReviewForm } from "@/features/reviews/ReviewForm";
import { useCartStore } from "@/store/cartStore";
import { WishlistButton } from "@/features/wishlist/WishlistButton";
import { formatPrice, cn } from "@/lib/utils";

export default function BookDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const addItem = useCartStore((state) => state.addItem);
    const [imgError, setImgError] = useState(false);

    const { data: bookData, isLoading } = useQuery({
        queryKey: ["book", id],
        queryFn: () => booksApi.getBookById(id as string),
        enabled: !!id,
    });

    const book = bookData?.data;

    const handleAddToCart = () => {
        if (book) {
            addItem(book);
            toast.success(`${book.title} added to cart!`);
        }
    };

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8 max-w-7xl animate-pulse">
                <Skeleton className="h-10 w-24 rounded-full mb-8" />
                <div className="flex flex-col lg:flex-row gap-12 items-start mb-24">
                    <div className="w-full lg:w-[450px]">
                        <Skeleton className="aspect-[3/4] rounded-3xl w-full" />
                    </div>
                    <div className="flex-1 space-y-10 w-full">
                        <div className="space-y-4">
                            <Skeleton className="h-6 w-24 rounded-full" />
                            <Skeleton className="h-16 md:h-20 w-full rounded-xl" />
                            <div className="flex gap-6">
                                <Skeleton className="h-8 w-40 rounded-full" />
                                <Skeleton className="h-8 w-32 rounded-full" />
                            </div>
                        </div>
                        <div className="flex gap-4 items-baseline">
                            <Skeleton className="h-16 w-32 rounded-xl" />
                            <Skeleton className="h-8 w-24 rounded-xl" />
                        </div>
                        <div className="space-y-4">
                            <Skeleton className="h-4 w-24" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-2/3" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 py-10 border-y border-muted-foreground/10">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="space-y-2">
                                    <Skeleton className="h-3 w-12" />
                                    <Skeleton className="h-5 w-20" />
                                </div>
                            ))}
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <Skeleton className="flex-1 h-20 rounded-full" />
                            <Skeleton className="h-20 w-full sm:w-20 rounded-full" />
                            <Skeleton className="h-20 w-full sm:w-20 rounded-full" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!book) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <h2 className="text-2xl font-bold font-outfit">Book not found</h2>
                <Button onClick={() => router.push("/books")} className="mt-4 rounded-full">
                    Back to Library
                </Button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Button
                variant="ghost"
                className="mb-8 hover:bg-primary/10 hover:text-primary transition-all group rounded-full"
                onClick={() => router.back()}
            >
                <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                Back
            </Button>

            <div className="flex flex-col lg:flex-row gap-12 items-start mb-24">
                {/* Cover Image */}
                <div className="w-full lg:w-[450px] lg:sticky lg:top-24">
                    <div className="relative aspect-[3/4] rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.3)] group border border-white/10 ring-1 ring-black/5">
                        {book.coverImageUrl && book.coverImageUrl !== "string" && !imgError ? (
                            <Image
                                src={book.coverImageUrl}
                                alt={book.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-700"
                                priority
                                onError={() => setImgError(true)}
                            />
                        ) : (
                            <div className="w-full h-full bg-muted flex flex-col items-center justify-center text-center p-8">
                                <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                                <span className="font-bold text-lg">Cover not available</span>
                            </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 space-y-10">
                    <div className="space-y-4">
                        <Badge className={cn(
                            "border-none px-4 py-1.5 text-xs font-black uppercase tracking-widest",
                            book.totalQuantity > 0 ? "bg-primary/20 text-primary hover:bg-primary/30" : "bg-destructive text-white"
                        )}>
                            {book.totalQuantity > 0 ? book.categoryName : "OUT OF STOCK"}
                        </Badge>
                        <h1 className="text-4xl md:text-5xl lg:text-7xl font-black font-outfit tracking-tighter leading-[0.9] text-balance">
                            {book.title}
                        </h1>
                        <div className="flex flex-wrap items-center gap-6 pt-2">
                            <p className="text-xl font-medium text-muted-foreground">by <span className="text-foreground font-black underline decoration-primary/50 underline-offset-8">{book.author}</span></p>
                            <div className="flex items-center gap-2 bg-yellow-400/10 px-4 py-2 rounded-full border border-yellow-400/30 backdrop-blur-sm">
                                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                                <span className="font-black text-xl leading-none">{book.averageRating.toFixed(1)}</span>
                                <span className="text-sm text-yellow-600/80 font-bold uppercase tracking-wider ml-1">{book.reviewCount} REVIEWS</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-4 items-baseline">
                        <span className="text-6xl font-black font-outfit text-primary tracking-tighter">
                            {formatPrice(book.price, book.currency)}
                        </span>
                        <span className="text-2xl font-bold text-muted-foreground/40 line-through decoration-destructive/30 decoration-4">
                            {formatPrice(book.price * 1.5, book.currency)}
                        </span>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground/60">Description</h3>
                        <p className="text-xl leading-relaxed text-muted-foreground/90 font-medium max-w-2xl">
                            {book.description}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 py-10 border-y border-muted-foreground/10">
                        <div className="space-y-1">
                            <span className="text-[10px] font-black uppercase text-muted-foreground/50 tracking-widest mb-2 block">ISBN</span>
                            <p className="font-bold text-lg">{book.isbn}</p>
                        </div>
                        <div className="space-y-1">
                            <span className="text-[10px] font-black uppercase text-muted-foreground/50 tracking-widest mb-2 block">Pages</span>
                            <p className="font-bold text-lg">{book.pages}</p>
                        </div>
                        <div className="space-y-1">
                            <span className="text-[10px] font-black uppercase text-muted-foreground/50 tracking-widest mb-2 block">Publisher</span>
                            <p className="font-bold text-lg">{book.publisher || "N/A"}</p>
                        </div>
                        <div className="space-y-1">
                            <span className="text-[10px] font-black uppercase text-muted-foreground/50 tracking-widest mb-2 block">Language</span>
                            <p className="font-bold text-lg uppercase">{book.language || "English"}</p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <Button
                            size="lg"
                            onClick={handleAddToCart}
                            disabled={book.totalQuantity <= 0}
                            className={cn(
                                "flex-1 rounded-full h-20 text-xl font-black transition-all active:scale-95",
                                book.totalQuantity > 0
                                    ? "bg-primary hover:bg-primary/90 shadow-[0_15px_30px_rgba(var(--primary-rgb),0.3)] hover:shadow-[0_20px_40px_rgba(var(--primary-rgb),0.4)]"
                                    : "bg-muted text-muted-foreground cursor-not-allowed"
                            )}
                        >
                            {book.totalQuantity > 0 ? (
                                <>
                                    <ShoppingCart className="mr-3 h-6 w-6" />
                                    ADD TO CART
                                </>
                            ) : (
                                "OUT OF STOCK"
                            )}
                        </Button>
                        <WishlistButton book={book} variant="full" />
                        <Button size="lg" variant="outline" className="rounded-full h-20 w-full sm:w-20 p-0 border-2 transition-all hover:bg-primary/10 hover:text-primary">
                            <Share2 className="h-7 w-7" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Reviews Section */}
            <section className="mt-32 space-y-16 max-w-4xl">
                <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b-4 border-primary pb-8">
                    <div className="space-y-2">
                        <h2 className="text-5xl lg:text-7xl font-black font-outfit tracking-tighter">Reader Reviews</h2>
                        <div className="flex items-center gap-2">
                            <div className="flex gap-0.5">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <Star key={i} className={`h-5 w-5 ${i < Math.round(book.averageRating) ? "fill-yellow-400 text-yellow-400" : "fill-muted text-muted"}`} />
                                ))}
                            </div>
                            <p className="text-lg font-bold text-muted-foreground">
                                <span className="text-foreground">{book.averageRating.toFixed(1)}</span> out of 5 based on <span className="text-foreground">{book.reviewCount}</span> ratings
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                    <div className="space-y-8">
                        <h3 className="text-2xl font-black font-outfit uppercase tracking-widest text-muted-foreground/60">Community Thoughts</h3>
                        <ReviewList bookId={book.id} />
                    </div>
                    <div className="lg:sticky lg:top-8">
                        <ReviewForm bookId={book.id} />
                    </div>
                </div>
            </section>
        </div>
    );
}
