"use client";

import { useState } from "react";
import { useCartStore } from "@/store/cartStore";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { ordersApi } from "@/features/orders/orders-api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { BookOpen, CreditCard, ShieldCheck, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

export default function CheckoutPage() {
    const { items, totalPrice, clearCart } = useCartStore();
    const { data: session } = useSession();
    const router = useRouter();
    const [isSuccess, setIsSuccess] = useState(false);

    const total = totalPrice();

    const mutation = useMutation({
        mutationFn: (order: any) => ordersApi.createOrder(order),
        onSuccess: () => {
            setIsSuccess(true);
            clearCart();
            toast.success("Order placed successfully!");
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || "Failed to place order.";
            toast.error(message);
        },
    });

    if (items.length === 0 && !isSuccess) {
        return (
            <div className="container mx-auto px-4 py-24 text-center space-y-6">
                <h1 className="text-4xl font-black font-outfit">Your cart is empty</h1>
                <Button onClick={() => router.push("/books")} className="rounded-full h-14 px-8 text-lg font-black shadow-xl">
                    BACK TO SHOPPING
                </Button>
            </div>
        );
    }

    if (isSuccess) {
        return (
            <div className="container mx-auto px-4 py-24 text-center max-w-2xl space-y-8 animate-in zoom-in duration-500">
                <div className="bg-primary/5 rounded-full p-12 inline-block shadow-inner ring-1 ring-primary/20">
                    <CheckCircle2 className="h-24 w-24 text-primary" />
                </div>
                <div className="space-y-4">
                    <h1 className="text-6xl font-black font-outfit tracking-tighter">SUCCESS!</h1>
                    <p className="text-xl text-muted-foreground font-medium">Your order has been placed and is being prepared with love.</p>
                </div>
                <div className="flex gap-4 justify-center">
                    <Button onClick={() => router.push("/orders")} variant="outline" className="rounded-full h-14 px-8 text-lg font-black border-2">
                        VIEW ORDERS
                    </Button>
                    <Button onClick={() => router.push("/books")} className="rounded-full h-14 px-8 text-lg font-black shadow-xl">
                        KEEP EXPLORING
                    </Button>
                </div>
            </div>
        );
    }

    const handlePlaceOrder = () => {
        const orderItems = items.map((item) => ({
            bookId: item.bookId,
            quantity: item.quantity,
        }));

        mutation.mutate({ items: orderItems });
    };

    return (
        <div className="container mx-auto px-4 py-12 max-w-6xl space-y-12">
            <header className="space-y-2 border-b-4 border-primary pb-8">
                <h1 className="text-5xl lg:text-7xl font-black font-outfit tracking-tighter uppercase">Checkout</h1>
                <p className="text-xl text-muted-foreground font-medium italic underline decoration-primary/30 underline-offset-8 decoration-2">Complete your purchase journey.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
                <div className="lg:col-span-7 space-y-12">
                    <section className="space-y-6">
                        <h3 className="text-2xl font-black font-outfit uppercase tracking-widest text-muted-foreground/60 flex items-center gap-3">
                            <span className="bg-primary text-white h-8 w-8 rounded-full flex items-center justify-center text-sm">1</span>
                            Shipping Information
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-muted/20 p-8 rounded-3xl border-2 border-dashed border-muted">
                            <div className="space-y-2">
                                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Recipient</p>
                                <p className="text-lg font-bold">{session?.user?.name}</p>
                            </div>
                            <div className="space-y-2">
                                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Email</p>
                                <p className="text-lg font-bold">{session?.user?.email}</p>
                            </div>
                            <div className="sm:col-span-2 py-4 border-t border-muted-foreground/10">
                                <p className="text-xs font-bold text-muted-foreground italic italic">Shipping address is currently handled via your profile defaults.</p>
                            </div>
                        </div>
                    </section>

                    <section className="space-y-6">
                        <h3 className="text-2xl font-black font-outfit uppercase tracking-widest text-muted-foreground/60 flex items-center gap-3">
                            <span className="bg-primary text-white h-8 w-8 rounded-full flex items-center justify-center text-sm">2</span>
                            Payment Method
                        </h3>
                        <div className="bg-card glass-morphism p-8 rounded-3xl border border-white/10 shadow-xl flex items-center justify-between border-l-8 border-l-primary">
                            <div className="flex items-center gap-4">
                                <div className="bg-primary/10 p-4 rounded-2xl">
                                    <CreditCard className="h-8 w-8 text-primary" />
                                </div>
                                <div>
                                    <p className="text-xl font-black font-outfit">Pay on Delivery</p>
                                    <p className="text-sm text-muted-foreground">Secure payment upon arrival.</p>
                                </div>
                            </div>
                            <div className="h-6 w-6 rounded-full border-4 border-primary bg-primary ring-2 ring-primary/20" />
                        </div>
                    </section>

                    <div className="flex items-center gap-3 text-muted-foreground font-medium bg-muted/30 p-4 rounded-2xl border border-white/10">
                        <ShieldCheck className="h-6 w-6 text-green-500" />
                        Your payment and data are secured with 256-bit encryption.
                    </div>
                </div>

                <div className="lg:col-span-5">
                    <div className="bg-card glass-morphism p-8 rounded-[2rem] border border-white/10 shadow-2xl space-y-8 sticky top-24 ring-1 ring-black/5">
                        <h3 className="text-3xl font-black font-outfit tracking-tighter">Order Summary</h3>
                        <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 scrollbar-hide">
                            {items.map((item) => (
                                <div key={item.bookId} className="flex justify-between items-start gap-4 pb-4 border-b border-muted last:border-0 last:pb-0">
                                    <div className="space-y-1">
                                        <p className="font-bold line-clamp-1 text-sm">{item.bookTitle}</p>
                                        <p className="text-[10px] font-black text-muted-foreground uppercase">Qty: {item.quantity}</p>
                                    </div>
                                    <span className="font-black text-sm whitespace-nowrap">
                                        {new Intl.NumberFormat("en-US", {
                                            style: "currency",
                                            currency: item.currency,
                                        }).format(item.subTotal)}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <Separator className="bg-white/10" />

                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-muted-foreground font-bold">
                                <span>Subtotal</span>
                                <span>{new Intl.NumberFormat("en-US", { style: "currency", currency: items[0]?.currency || "USD" }).format(total)}</span>
                            </div>
                            <div className="flex justify-between items-center text-muted-foreground font-bold">
                                <span>Shipping</span>
                                <span className="text-green-500 uppercase tracking-widest text-xs">Free</span>
                            </div>
                            <div className="flex justify-between items-center pt-4 border-t-2 border-primary border-dashed">
                                <span className="text-2xl font-black font-outfit tracking-tight">TOTAL</span>
                                <span className="text-4xl font-black font-outfit text-primary tracking-tighter">
                                    {new Intl.NumberFormat("en-US", {
                                        style: "currency",
                                        currency: items[0]?.currency || "USD",
                                    }).format(total)}
                                </span>
                            </div>
                        </div>

                        <Button
                            className="w-full h-20 rounded-full text-xl font-black bg-primary hover:bg-primary/90 shadow-[0_15px_30px_rgba(var(--primary-rgb),0.3)] hover:shadow-[0_20px_40px_rgba(var(--primary-rgb),0.4)] transition-all active:scale-95 group"
                            onClick={handlePlaceOrder}
                            disabled={mutation.isPending}
                        >
                            {mutation.isPending ? (
                                <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                            ) : (
                                <>
                                    PLACE ORDER
                                    <CheckCircle2 className="ml-3 h-7 w-7 group-hover:scale-110 transition-transform" />
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
