"use client";

import { useQuery } from "@tanstack/react-query";
import { reviewsApi } from "./reviews-api";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

// Assuming Avatar components might not be installed, using a simpler implementation or ensuring they are
interface ReviewListProps {
    bookId: string;
}

export function ReviewList({ bookId }: ReviewListProps) {
    const { data: reviewsData, isLoading } = useQuery({
        queryKey: ["reviews", bookId],
        queryFn: () => reviewsApi.getBookReviews(bookId),
    });

    const reviews = reviewsData?.data || [];

    if (isLoading) {
        return (
            <div className="space-y-6">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex gap-4 items-start">
                        <div className="w-12 h-12 rounded-full bg-muted animate-pulse" />
                        <div className="flex-1 space-y-2">
                            <div className="h-4 w-1/4 bg-muted animate-pulse rounded" />
                            <div className="h-4 w-full bg-muted animate-pulse rounded" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (reviews.length === 0) {
        return (
            <div className="py-12 text-center bg-muted/20 rounded-2xl border-2 border-dashed border-muted">
                <p className="text-muted-foreground font-medium italic">No reviews yet. Be the first to share your thoughts!</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {reviews.map((review) => (
                <div key={review.id} className="group relative flex gap-6 items-start pb-8 border-b border-muted last:border-0 last:pb-0">
                    <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center font-bold text-primary font-outfit text-xl shadow-inner border border-white/10 ring-1 ring-black/5">
                        {review.userFullName.charAt(0)}
                    </div>
                    <div className="flex-1 space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div>
                                <h4 className="font-black font-outfit text-lg leading-tight">{review.userFullName}</h4>
                                <div className="flex items-center gap-1 mt-1">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`h-4 w-4 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "fill-muted text-muted"
                                                }`}
                                        />
                                    ))}
                                </div>
                            </div>
                            <time className="text-xs font-bold text-muted-foreground uppercase tracking-widest bg-muted/50 px-2 py-1 rounded">
                                {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
                            </time>
                        </div>
                        <p className="text-muted-foreground leading-relaxed text-lg font-medium italic">
                            &ldquo;{review.comment}&rdquo;
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}
