"use client";

import { useQuery } from "@tanstack/react-query";
import { ordersApi } from "@/features/orders/orders-api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ShoppingBag, Calendar, Package, ChevronRight, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/utils";

export default function OrdersPage() {
    const router = useRouter();
    const { data: ordersData, isLoading } = useQuery({
        queryKey: ["orders"],
        queryFn: () => ordersApi.getUserOrders(),
    });

    const orders = ordersData?.data?.items || [];

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-12 space-y-8">
                <header className="space-y-2 border-b-4 border-primary pb-8">
                    <Skeleton className="h-16 w-1/3" />
                    <Skeleton className="h-6 w-1/4" />
                </header>
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-32 w-full rounded-3xl" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12 max-w-5xl space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="flex flex-col md:flex-row justify-between items-end gap-6 border-b-4 border-primary pb-8">
                <div className="space-y-2">
                    <h1 className="text-5xl lg:text-7xl font-black font-outfit tracking-tighter uppercase">Your Orders</h1>
                    <p className="text-xl text-muted-foreground font-medium">View and track your previous orders.</p>
                </div>
                <div className="bg-primary/5 px-6 py-3 rounded-2xl border border-primary/10">
                    <p className="text-sm font-black uppercase tracking-widest text-primary">Total Orders: {orders.length}</p>
                </div>
            </header>

            {orders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center space-y-8 bg-muted/20 rounded-[3rem] border-2 border-dashed border-muted">
                    <div className="bg-muted rounded-full p-12 shadow-inner ring-1 ring-black/5">
                        <ShoppingBag className="h-20 w-20 text-muted-foreground/40" />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-4xl font-black font-outfit tracking-tight">No orders yet</h2>
                        <p className="text-muted-foreground max-w-xs mx-auto text-lg">You haven't placed any orders yet. Start shopping to build your collection.</p>
                    </div>
                    <Button asChild className="rounded-full h-16 px-12 text-xl font-black shadow-2xl hover:scale-105 transition-all">
                        <Link href="/books">GO TO LIBRARY</Link>
                    </Button>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map((order) => (
                        <div
                            key={order.id}
                            className="group relative bg-card glass-morphism p-8 rounded-3xl border border-white/10 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.01] flex flex-col md:flex-row items-center justify-between gap-8 border-l-8 border-l-primary"
                        >
                            <div className="flex flex-col sm:flex-row gap-8 items-center text-center sm:text-left">
                                <div className="bg-primary/10 p-5 rounded-2xl ring-1 ring-primary/20">
                                    <Package className="h-10 w-10 text-primary" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black uppercase text-secondary-foreground/40 tracking-[0.2em]">Order Number</p>
                                    <p className="text-xl font-black font-outfit">ORD-{order.id.slice(0, 8).toUpperCase()}</p>
                                    <div className="flex items-center justify-center sm:justify-start gap-4 pt-1">
                                        <div className="flex items-center text-xs font-bold text-muted-foreground gap-1.5 uppercase tracking-wider">
                                            <Calendar className="h-3.5 w-3.5" />
                                            {format(new Date(order.createdAt), "MMM dd, yyyy")}
                                        </div>
                                        <Badge className="bg-primary/95 text-white hover:bg-black rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-widest border-none">
                                            {order.status}
                                        </Badge>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-12 justify-between w-full md:w-auto border-t md:border-t-0 pt-6 md:pt-0 border-white/10">
                                <div className="space-y-1 text-center md:text-right">
                                    <p className="text-[10px] font-black uppercase text-secondary-foreground/40 tracking-[0.2em]">Total Amount</p>
                                    <p className="text-3xl font-black font-outfit text-primary tracking-tighter">
                                        {formatPrice(order.totalAmount, order.currency)}
                                    </p>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-14 w-14 rounded-2xl bg-muted/50 hover:bg-primary hover:text-white transition-all group-hover:translate-x-1"
                                >
                                    <ChevronRight className="h-8 w-8" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="pt-12">
                <Button
                    variant="ghost"
                    onClick={() => router.push("/books")}
                    className="rounded-full gap-2 font-bold hover:bg-primary/5 group"
                >
                    <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                    Continue Shopping
                </Button>
            </div>
        </div>
    );
}
