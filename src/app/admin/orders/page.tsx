"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { ApiResponse, OrderResponseDto, PagedResult } from "@/types";
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
import { formatPrice } from "@/lib/utils";

export default function AdminOrdersPage() {
    const { data: ordersData, isLoading } = useQuery({
        queryKey: ["admin-orders"],
        queryFn: async () => {
            const response = await api.get<ApiResponse<PagedResult<OrderResponseDto>>>("/orders");
            return response.data;
        }
    });

    const orders = ordersData?.data?.items || [];

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case "completed": return "bg-green-500/10 text-green-500 border-green-500/20";
            case "processing": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
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
                        Total Orders: <span className="text-primary">{orders.length}</span>
                    </span>
                </div>
            </header>

            <div className="bg-card glass-morphism rounded-[2.5rem] border border-white/10 shadow-3xl overflow-hidden ring-1 ring-black/5">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent border-white/10 h-20">
                            <TableHead className="px-8 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Order ID</TableHead>
                            <TableHead className="px-8 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Customer</TableHead>
                            <TableHead className="px-8 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Date</TableHead>
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
                        ) : orders.map((order) => (
                            <TableRow key={order.id} className="group hover:bg-primary/5 transition-colors h-24 border-white/5">
                                <TableCell className="px-8 font-black font-outfit uppercase tracking-tighter text-sm">
                                    #{order.id.slice(0, 8)}
                                </TableCell>
                                <TableCell className="px-8">
                                    <div className="font-bold flex flex-col">
                                        <span>{order.userFullName}</span>
                                        <span className="text-[10px] text-muted-foreground uppercase tracking-widest leading-none">ID: {order.userId.slice(0, 8)}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="px-8 font-medium text-muted-foreground">
                                    {format(new Date(order.createdAt), "PPp")}
                                </TableCell>
                                <TableCell className="px-8 font-black font-outfit text-lg tracking-tight text-primary">
                                    {formatPrice(order.totalAmount, order.currency)}
                                </TableCell>
                                <TableCell className="px-8">
                                    <Badge variant="outline" className={getStatusColor(order.status) + " rounded-full px-4 py-1 font-black uppercase tracking-[0.1em] text-[10px]"}>
                                        {order.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="px-8 text-right">
                                    <Button variant="ghost" size="icon" className="h-12 w-12 rounded-xl hover:bg-primary hover:text-white transition-all shadow-hover">
                                        <Eye className="h-5 w-5" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <div className="flex justify-center pt-8">
                <Button variant="outline" className="rounded-full h-14 px-8 border-2 font-black gap-2 group flex items-center">
                    VIEW ORDER HISTORY
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
            </div>
        </div>
    );
}
