"use client";

import { useWishlistStore } from "@/store/wishlistStore";
import { BookResponseDto } from "@/types";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface WishlistButtonProps {
    book: BookResponseDto;
    variant?: "icon" | "full";
    className?: string;
}

export function WishlistButton({ book, variant = "icon", className }: WishlistButtonProps) {
    const { toggleItem, isInWishlist } = useWishlistStore();
    const wishlisted = isInWishlist(book.id);

    const handleToggle = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        toggleItem(book);

        if (wishlisted) {
            toast.info(`Removed ${book.title} from wishlist`);
        } else {
            toast.success(`Saved ${book.title} to wishlist!`);
        }
    };

    if (variant === "full") {
        return (
            <Button
                variant="outline"
                size="lg"
                onClick={handleToggle}
                className={cn(
                    "rounded-full h-16 w-full sm:w-16 p-0 border-2 transition-all group",
                    wishlisted ? "bg-destructive/10 text-destructive border-destructive" : "hover:bg-destructive/10 hover:text-destructive hover:border-destructive",
                    className
                )}
            >
                <Heart className={cn("h-7 w-7 transition-all", wishlisted ? "fill-destructive" : "group-hover:fill-destructive")} />
            </Button>
        );
    }

    return (
        <Button
            size="icon"
            variant="secondary"
            onClick={handleToggle}
            className={cn(
                "rounded-full shadow-lg backdrop-blur-md border-none transition-all duration-300",
                wishlisted ? "bg-destructive text-white scale-110" : "bg-white/80 hover:bg-primary hover:text-white",
                className
            )}
        >
            <Heart className={cn("h-4 w-4 transition-all", wishlisted ? "fill-current" : "")} />
        </Button>
    );
}
