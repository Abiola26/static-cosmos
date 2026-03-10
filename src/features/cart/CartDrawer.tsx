"use client";

import { useCartStore } from "@/store/cartStore";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetFooter,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ShoppingCart, ShoppingBag, ArrowRight, Trash2 } from "lucide-react";
import { CartItemElement } from "./CartItem";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";

export function CartDrawer() {
    const { items, totalItems, totalPrice, clearCart } = useCartStore();
    const count = totalItems();
    const total = totalPrice();

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="relative h-12 w-12 rounded-full hover:bg-primary/10 group transition-all">
                    <ShoppingCart className="h-6 w-6 group-hover:scale-110 transition-transform" />
                    {count > 0 && (
                        <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 rounded-full bg-primary text-[10px] font-black animate-in zoom-in">
                            {count}
                        </Badge>
                    )}
                </Button>
            </SheetTrigger>
            <SheetContent className="flex flex-col w-full sm:max-w-md glass-morphism border-l border-white/10 p-0">
                <SheetHeader className="p-6 border-b border-white/10">
                    <div className="flex items-center justify-between">
                        <SheetTitle className="text-3xl font-black font-outfit flex items-center gap-3">
                            <ShoppingBag className="h-8 w-8 text-primary" />
                            Your Bag
                        </SheetTitle>
                        {count > 0 && (
                            <Button variant="ghost" size="sm" onClick={clearCart} className="text-muted-foreground hover:text-destructive gap-2 rounded-full">
                                <Trash2 className="h-4 w-4" />
                                Clear
                            </Button>
                        )}
                    </div>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {items.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50">
                            <div className="bg-muted rounded-full p-8">
                                <ShoppingCart className="h-12 w-12 text-muted-foreground" />
                            </div>
                            <p className="text-xl font-bold font-outfit">Your bag is empty</p>
                            <p className="text-sm">Start adding some amazing books!</p>
                        </div>
                    ) : (
                        items.map((item) => (
                            <CartItemElement key={item.bookId} item={item} />
                        ))
                    )}
                </div>

                {items.length > 0 && (
                    <SheetFooter className="block p-6 bg-muted/50 border-t border-white/10 space-y-6">
                        <div className="flex items-center justify-between">
                            <span className="text-lg font-bold text-muted-foreground uppercase tracking-widest">Total</span>
                            <span className="text-3xl font-black font-outfit text-primary">
                                {formatPrice(total, items[0]?.currency || "USD")}
                            </span>
                        </div>
                        <Button asChild className="w-full h-16 rounded-full text-lg font-black bg-primary hover:bg-primary/90 shadow-xl group">
                            <Link href="/checkout">
                                PROCEED TO CHECKOUT
                                <ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </Button>
                        <p className="text-center text-[10px] uppercase font-black tracking-widest text-muted-foreground">
                            Taxes and shipping calculated at checkout
                        </p>
                    </SheetFooter>
                )}
            </SheetContent>
        </Sheet>
    );
}
