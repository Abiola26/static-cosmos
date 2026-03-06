"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { reviewsApi } from "./reviews-api";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Star, Send, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import Link from "next/link";

const reviewSchema = z.object({
    rating: z.number().min(1, "Please select a rating").max(5),
    comment: z.string().min(10, "Comment must be at least 10 characters").max(1000),
});

type ReviewFormValues = z.infer<typeof reviewSchema>;

interface ReviewFormProps {
    bookId: string;
}

export function ReviewForm({ bookId }: ReviewFormProps) {
    const { data: session } = useSession();
    const queryClient = useQueryClient();
    const [hoveredRating, setHoveredRating] = useState(0);

    const form = useForm<ReviewFormValues>({
        resolver: zodResolver(reviewSchema),
        defaultValues: {
            rating: 0,
            comment: "",
        },
    });

    const mutation = useMutation({
        mutationFn: (values: ReviewFormValues) => reviewsApi.addReview(bookId, values),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["reviews", bookId] });
            queryClient.invalidateQueries({ queryKey: ["book", bookId] });
            toast.success("Review submitted! Thank you for your feedback.");
            form.reset();
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || "Failed to submit review.";
            toast.error(message);
        },
    });

    if (!session) {
        return (
            <div className="bg-muted/30 p-8 rounded-2xl border-2 border-dashed border-muted text-center space-y-4">
                <p className="text-muted-foreground font-medium">Want to share your thoughts?</p>
                <Button asChild variant="outline" className="rounded-full">
                    <Link href="/auth/login">Sign in to write a review</Link>
                </Button>
            </div>
        );
    }

    function onSubmit(values: ReviewFormValues) {
        mutation.mutate(values);
    }

    return (
        <div className="bg-card glass-morphism p-8 rounded-3xl border border-white/10 shadow-xl space-y-6">
            <div className="space-y-1">
                <h3 className="text-2xl font-black font-outfit tracking-tight">Write a Review</h3>
                <p className="text-muted-foreground text-sm">Your feedback helps others discover great books.</p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="rating"
                        render={({ field }) => (
                            <FormItem className="space-y-3">
                                <FormLabel className="text-base font-bold uppercase tracking-widest text-muted-foreground">Rating</FormLabel>
                                <FormControl>
                                    <div className="flex gap-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                className="transition-all active:scale-90"
                                                onMouseEnter={() => setHoveredRating(star)}
                                                onMouseLeave={() => setHoveredRating(0)}
                                                onClick={() => field.onChange(star)}
                                            >
                                                <Star
                                                    className={`h-8 w-8 transition-colors ${star <= (hoveredRating || field.value)
                                                            ? "fill-yellow-400 text-yellow-400"
                                                            : "text-muted hover:text-yellow-200"
                                                        }`}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="comment"
                        render={({ field }) => (
                            <FormItem className="space-y-3">
                                <FormLabel className="text-base font-bold uppercase tracking-widest text-muted-foreground">Comment</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="What did you think of this book? Did it move you? Would you recommend it?"
                                        className="min-h-[150px] rounded-2xl bg-muted/50 border-none focus-visible:ring-2 focus-visible:ring-primary p-4 text-lg leading-relaxed shadow-inner"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button
                        type="submit"
                        className="w-full h-14 rounded-full text-lg font-black bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all"
                        disabled={mutation.isPending}
                    >
                        {mutation.isPending ? (
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        ) : (
                            <Send className="mr-2 h-5 w-5" />
                        )}
                        POST REVIEW
                    </Button>
                </form>
            </Form>
        </div>
    );
}
