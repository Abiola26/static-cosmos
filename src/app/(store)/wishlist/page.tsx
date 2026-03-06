"use client";

import { useWishlistStore } from "@/store/wishlistStore";
import { BookGrid } from "@/features/books/BookGrid";
import { Button } from "@/components/ui/button";
import { Heart, Search } from "lucide-react";
import Link from "next/link";

export default function WishlistPage() {
    const { items, clearWishlist } = useWishlistStore();

    return (
        <div className="container mx-auto px-4 py-12 min-h-screen space-y-12 animate-in fade-in duration-700">
            <header className="flex flex-col md:flex-row justify-between items-end gap-6 border-b-4 border-primary pb-8">
                <div className="space-y-2 text-center md:text-left">
                    <h1 className="text-5xl lg:text-7xl font-black font-outfit tracking-tighter">Your Wishlist</h1>
                    <p className="text-xl text-muted-foreground font-medium">Items you&apos;ve saved for later.</p>
                </div>
                {items.length > 0 && (
                    <Button
                        variant="ghost"
                        onClick={clearWishlist}
                        className="rounded-full font-bold hover:text-destructive hover:bg-destructive/5"
                    >
                        Clear All
                    </Button>
                )}
            </header>

            {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center space-y-6 bg-muted/20 rounded-3xl border-2 border-dashed border-muted">
                    <div className="bg-muted rounded-full p-8 shadow-inner">
                        <Heart className="h-16 w-16 text-muted-foreground/40" />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-3xl font-black font-outfit">Your wishlist is empty</h2>
                        <p className="text-muted-foreground max-w-xs mx-auto">Found something you love? Save it here to keep track of it.</p>
                    </div>
                    <Button asChild className="rounded-full h-14 px-8 text-lg font-black shadow-xl">
                        <Link href="/books">
                            <Search className="mr-2 h-5 w-5" />
                            EXPLORE BOOKS
                        </Link>
                    </Button>
                </div>
            ) : (
                <div className="animate-in slide-in-from-bottom-8 duration-700">
                    <BookGrid books={items} />
                </div>
            )}
        </div>
    );
}
