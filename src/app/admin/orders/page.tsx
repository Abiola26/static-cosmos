"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import api from "@/lib/api";
import { ordersApi } from "@/features/orders/orders-api";
import { ApiResponse, OrderResponseDto, PagedResult } from "@/types";
import { toast } from "sonner";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, ShoppingBag, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";

export default function AdminOrdersPage() {
    const { data: ordersData, isLoading, refetch } = useQuery({
        queryKey: ["admin-orders"],
        queryFn: () => ordersApi.getAllOrders()
    });

    const orders = ordersData?.data?.items || [];

    const updateStatusMutation = useMutation({
        mutationFn: ({ id, status }: { id: string, status: string }) =>
            ordersApi.updateOrderStatus(id, status),
        onSuccess: () => {
            refetch();
            toast.success("Order status updated!");
        },
        onError: () => {
            toast.error("Failed to update status.");
        }
    });

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case "completed": return "bg-green-500/10 text-green-500 border-green-500/20";
            case "paid": return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
            case "shipped": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
            case "pending": return "bg-amber-500/10 text-amber-500 border-amber-500/20";
            case "cancelled": return "bg-destructive/10 text-destructive border-destructive/20";
            default: return "bg-muted text-muted-foreground";
        }
    };

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="flex flex-col md:flex-row justify-between items-end gap-6 border-b-4 border-primary pb-8">
                <div className="space-y-2">
                    <h1 className="text-5xl lg:text-7xl font-black font-outfit tracking-tighter uppercase">Orders</h1>
                    <p className="text-xl text-muted-foreground font-medium underline decoration-primary/30 underline-offset-8 decoration-2 italic">View and manage customer orders.</p>
                </div>
                <div className="bg-primary/10 px-8 py-4 rounded-full border border-primary/20 flex items-center gap-3">
                    <ShoppingBag className="h-6 w-6 text-primary" />
                    <span className="text-xl font-black font-outfit uppercase tracking-tighter">
                        Total Orders: <span className="text-primary">{ordersData?.data?.totalCount || 0}</span>
                    </span>
                </div>
            </header>

            <div className="bg-card glass-morphism rounded-[2.5rem] border border-white/10 shadow-3xl overflow-hidden ring-1 ring-black/5">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent border-white/10 h-20">
                            <TableHead className="px-8 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Order ID</TableHead>
                            <TableHead className="px-8 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Customer & Shipping</TableHead>
                            <TableHead className="px-8 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Payment</TableHead>
                            <TableHead className="px-8 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Total</TableHead>
                            <TableHead className="px-8 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Status</TableHead>
                            <TableHead className="px-8 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            [1, 2, 3, 4, 5].map(i => (
                                <TableRow key={i} className="animate-pulse h-24 border-white/5">
                                    <TableCell className="px-8"><div className="h-4 w-24 bg-muted rounded" /></TableCell>
                                    <TableCell className="px-8"><div className="h-4 w-40 bg-muted rounded" /></TableCell>
                                    <TableCell className="px-8"><div className="h-4 w-32 bg-muted rounded" /></TableCell>
                                    <TableCell className="px-8"><div className="h-4 w-16 bg-muted rounded" /></TableCell>
                                    <TableCell className="px-8"><div className="h-4 w-20 bg-muted rounded" /></TableCell>
                                    <TableCell className="px-8"><div className="h-4 w-12 bg-muted rounded float-right" /></TableCell>
                                </TableRow>
                            ))
                        ) : orders.map((order: OrderResponseDto) => (
                            <TableRow key={order.id} className="group hover:bg-primary/5 transition-colors h-24 border-white/5">
                                <TableCell className="px-8 font-black font-outfit uppercase tracking-tighter text-sm">
                                    #{order.id.slice(0, 8)}
                                </TableCell>
                                <TableCell className="px-8">
                                    <div className="flex flex-col gap-1">
                                        <span className="font-bold">{order.userFullName}</span>
                                        <span className="text-[10px] text-muted-foreground font-medium">
                                            {format(new Date(order.createdAt), "PPp")}
                                        </span>
                                        <span className="text-[10px] text-primary/60 font-medium max-w-[200px] truncate" title={order.shippingAddress}>
                                            📍 {order.shippingAddress}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell className="px-8">
                                    <div className="flex flex-col gap-1">
                                        <Badge variant="outline" className="w-fit text-[10px] font-bold uppercase py-0">
                                            {order.paymentMethod}
                                        </Badge>
                                        <span className={`text-[10px] font-black uppercase ${order.isPaid ? 'text-green-500' : 'text-amber-500'}`}>
                                            {order.isPaid ? '✓ PAID' : '⌛ UNPAID'}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell className="px-8 font-black font-outfit text-lg tracking-tight text-primary">
                                    {formatPrice(order.totalAmount + order.shippingFee, order.currency)}
                                </TableCell>
                                <TableCell className="px-8">
                                    <select
                                        value={order.status}
                                        onChange={(e) => updateStatusMutation.mutate({ id: order.id, status: e.target.value })}
                                        className={`rounded-full px-4 py-1 font-black uppercase tracking-[0.1em] text-[10px] border-2 outline-none cursor-pointer appearance-none ${getStatusColor(order.status)}`}
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Paid">Paid</option>
                                        <option value="Shipped">Shipped</option>
                                        <option value="Completed">Completed</option>
                                        <option value="Cancelled">Cancelled</option>
                                    </select>
                                </TableCell>
                                <TableCell className="px-8 text-right">
                                    <Button asChild variant="ghost" size="icon" className="h-12 w-12 rounded-xl hover:bg-primary hover:text-white transition-all shadow-hover">
                                        <Link href={`/admin/orders/${order.id}`}>
                                            <Eye className="h-5 w-5" />
                                        </Link>
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
