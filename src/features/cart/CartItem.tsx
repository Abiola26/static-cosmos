"use client";

import { useCartStore } from "@/store/cartStore";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2 } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface CartItemProps {
    item: any; // We'll use the type from cartStore
}

export function CartItemElement({ item }: { item: any }) {
    const { updateQuantity, removeItem } = useCartStore();

    return (
        <div className="flex gap-4 items-center p-4 bg-muted/30 rounded-2xl border border-white/10 group transition-all hover:bg-muted/50">
            <div className="flex-1 space-y-1">
                <h4 className="font-bold font-outfit line-clamp-1">{item.bookTitle}</h4>
                <p className="text-xs text-muted-foreground uppercase tracking-widest font-black">ISBN: {item.isbn}</p>
                <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2 bg-background/50 rounded-full p-1 border border-white/10 shadow-inner">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 rounded-full hover:bg-primary hover:text-white transition-all"
                            onClick={() => updateQuantity(item.bookId, item.quantity - 1)}
                        >
                            <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-6 text-center text-sm font-black">{item.quantity}</span>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 rounded-full hover:bg-primary hover:text-white transition-all"
                            onClick={() => updateQuantity(item.bookId, item.quantity + 1)}
                        >
                            <Plus className="h-3 w-3" />
                        </Button>
                    </div>
                    <span className="font-black font-outfit text-primary">
                        {formatPrice(item.subTotal, item.currency)}
                    </span>
                </div>
            </div>
            <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl"
                onClick={() => removeItem(item.bookId)}
            >
                <Trash2 className="h-5 w-5" />
            </Button>
        </div>
    );
}
