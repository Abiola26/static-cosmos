"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ordersApi } from "@/features/orders/orders-api";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
} from "@/components/ui/dialog";
import { 
    Eye, 
    Search, 
    Filter, 
    ChevronLeft, 
    ChevronRight, 
    Loader2,
    Calendar,
    Hash,
    User,
    CreditCard,
    Trash2
} from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import { formatPrice, cn } from "@/lib/utils";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminOrdersPage() {
    const queryClient = useQueryClient();
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize] = useState(10);
    const [filterStatus, setFilterStatus] = useState<string>("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const { data: ordersData, isLoading, isFetching } = useQuery({
        queryKey: ["admin-orders", pageNumber, pageSize],
        queryFn: () => ordersApi.getAllOrders(pageNumber, pageSize)
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => ordersApi.deleteOrder(id),
        onSuccess: (res) => {
            if (res.success) {
                toast.success("Order deleted successfully.");
                queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
            } else {
                toast.error(res.message || "Failed to delete order.");
            }
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || "Error deleting order.");
        },
        onSettled: () => {
            setIsDeleteDialogOpen(false);
            setSelectedOrder(null);
        }
    });

    const orders = ordersData?.data?.items || [];
    const totalCount = ordersData?.data?.totalCount || 0;
    const totalPages = ordersData?.data?.totalPages || 1;

    // Filter displayed orders locally if needed, though server-side is preferred
    // For now, search and status filter are handled locally on the fetched page, 
    // or we could implement server-side search if the API supports it.
    const filteredOrders = orders.filter(order => {
        const matchesStatus = filterStatus === "All" || order.status.toLowerCase() === filterStatus.toLowerCase();
        const matchesSearch = order.userFullName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             order.id.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    const getStatusStyles = (status: string) => {
        switch (status.toLowerCase()) {
            case "completed": return "bg-green-100 text-green-700 border-green-200";
            case "paid": return "bg-emerald-100 text-emerald-700 border-emerald-200";
            case "shipped": return "bg-blue-100 text-blue-700 border-blue-200";
            case "pending": return "bg-amber-100 text-amber-700 border-amber-200";
            case "cancelled": return "bg-red-100 text-red-700 border-red-200";
            default: return "bg-gray-100 text-gray-700 border-gray-200";
        }
    };

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-12 space-y-8">
                <Skeleton className="h-16 w-1/3 rounded-2xl" />
                <Skeleton className="h-64 w-full rounded-3xl" />
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12 space-y-12 animate-in fade-in duration-700">
            <header className="flex flex-col md:flex-row justify-between items-end gap-6 border-b-4 border-primary pb-8">
                <div className="space-y-2">
                    <h1 className="text-5xl lg:text-7xl font-black font-outfit tracking-tighter uppercase">Management Console</h1>
                    <p className="text-xl text-muted-foreground font-medium">Monitoring and fulfilling customer orders.</p>
                </div>
                <div className="flex gap-4">
                    <div className="bg-primary/5 px-6 py-3 rounded-2xl border border-primary/10 text-center">
                        <p className="text-[10px] font-black uppercase tracking-widest text-primary">Total Entries</p>
                        <p className="text-3xl font-black font-outfit">{totalCount}</p>
                    </div>
                </div>
            </header>

            {/* Filters & Search */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center bg-card glass-morphism p-6 rounded-[2rem] border border-white/10 shadow-xl">
                <div className="lg:col-span-4 relative group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <input 
                        type="text"
                        placeholder="Search ID or Name..."
                        className="w-full h-14 pl-12 pr-6 rounded-2xl border-2 border-transparent bg-white/5 focus:border-primary/30 outline-none transition-all font-bold text-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                
                <div className="lg:col-span-6 flex flex-wrap gap-2">
                    {["All", "Pending", "Paid", "Shipped", "Completed", "Cancelled"].map((status) => (
                        <Button
                            key={status}
                            variant={filterStatus === status ? "default" : "outline"}
                            onClick={() => {
                                setFilterStatus(status);
                                setPageNumber(1);
                            }}
                            className={cn(
                                "rounded-full h-10 px-6 font-bold uppercase text-[10px] tracking-widest transition-all",
                                filterStatus === status ? "shadow-lg shadow-primary/20 scale-105" : "hover:border-primary/50"
                            )}
                        >
                            {status}
                        </Button>
                    ))}
                </div>

                <div className="lg:col-span-2 flex justify-end">
                    {isFetching && <Loader2 className="h-6 w-6 text-primary animate-spin" />}
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-card glass-morphism rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden overflow-x-auto ring-1 ring-black/5">
                <table className="w-full text-left border-collapse min-w-[1000px]">
                    <thead>
                        <tr className="bg-primary/95 text-white h-20">
                            <th className="px-8 text-[10px] font-black uppercase tracking-widest"><Hash className="h-3 w-3 inline mr-2" />Order ID</th>
                            <th className="px-8 text-[10px] font-black uppercase tracking-widest"><User className="h-3 w-3 inline mr-2" />Customer</th>
                            <th className="px-8 text-[10px] font-black uppercase tracking-widest"><Calendar className="h-3 w-3 inline mr-2" />Date</th>
                            <th className="px-8 text-[10px] font-black uppercase tracking-widest"><CreditCard className="h-3 w-3 inline mr-2" />Amount</th>
                            <th className="px-8 text-[10px] font-black uppercase tracking-widest"><Filter className="h-3 w-3 inline mr-2" />Status</th>
                            <th className="px-8 text-[10px] font-black uppercase tracking-widest text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {filteredOrders.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="py-24 text-center">
                                    <p className="text-xl font-black font-outfit text-muted-foreground uppercase opacity-20 tracking-widest">No matching orders found</p>
                                </td>
                            </tr>
                        ) : filteredOrders.map((order) => (
                            <tr key={order.id} className="h-24 hover:bg-white/5 transition-all group">
                                <td className="px-8 font-mono text-xs font-bold text-muted-foreground">
                                    ORD-{order.id.slice(0, 8).toUpperCase()}
                                </td>
                                <td className="px-8">
                                    <div className="flex flex-col">
                                        <span className="font-black font-outfit uppercase tracking-tight text-lg">{order.userFullName}</span>

                                    </div>
                                </td>
                                <td className="px-8 font-bold text-muted-foreground text-sm">
                                    {format(new Date(order.createdAt), "MMM dd, yyyy")}
                                </td>
                                <td className="px-8">
                                    <span className="font-black text-xl font-outfit text-primary">
                                        {formatPrice(order.totalAmount + order.shippingFee, order.currency)}
                                    </span>
                                </td>
                                <td className="px-8">
                                    <Badge className={cn(
                                        "rounded-full px-4 py-1 text-[10px] font-black uppercase tracking-widest border shadow-sm",
                                        getStatusStyles(order.status)
                                    )}>
                                        {order.status}
                                    </Badge>
                                </td>
                                <td className="px-8 text-center">
                                    <div className="flex items-center justify-center gap-2">
                                        <Button asChild variant="ghost" size="icon" className="h-12 w-12 rounded-2xl hover:bg-primary hover:text-white transition-all hover:scale-110 active:scale-90 border border-white/10 shadow-md">
                                            <Link href={`/admin/orders/${order.id}`}>
                                                <Eye className="h-6 w-6" />
                                            </Link>
                                        </Button>
                                        <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            className="h-12 w-12 rounded-2xl hover:bg-destructive hover:text-white transition-all hover:scale-110 active:scale-90 border border-white/10 shadow-md text-destructive"
                                            onClick={() => {
                                                setSelectedOrder(order);
                                                setIsDeleteDialogOpen(true);
                                            }}
                                        >
                                            <Trash2 className="h-6 w-6" />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination footer */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-8 border-t-2 border-white/5">
                <p className="text-sm font-bold text-muted-foreground">
                    Showing <span className="text-primary font-black">{((pageNumber - 1) * pageSize) + 1}</span> to <span className="text-primary font-black">{Math.min(pageNumber * pageSize, totalCount)}</span> of <span className="text-white font-black">{totalCount}</span> orders
                </p>
                
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="icon"
                        disabled={pageNumber === 1 || isFetching}
                        onClick={() => setPageNumber(p => p - 1)}
                        className="h-12 w-12 rounded-xl border-2 hover:bg-primary hover:text-white transition-all"
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </Button>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                        <Button
                            key={p}
                            variant={pageNumber === p ? "default" : "outline"}
                            onClick={() => setPageNumber(p)}
                            disabled={isFetching}
                            className={cn(
                                "h-12 min-w-[3rem] rounded-xl font-bold border-2 transition-all",
                                pageNumber === p ? "shadow-lg shadow-primary/20 scale-105" : "hover:border-primary/50"
                            )}
                        >
                            {p}
                        </Button>
                    ))}

                    <Button
                        variant="outline"
                        size="icon"
                        disabled={pageNumber === totalPages || isFetching}
                        onClick={() => setPageNumber(p => p + 1)}
                        className="h-12 w-12 rounded-xl border-2 hover:bg-primary hover:text-white transition-all"
                    >
                        <ChevronRight className="h-5 w-5" />
                    </Button>
                </div>
            </div>

            {/* Delete Confirmation Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent className="sm:max-w-[500px] glass-morphism border-white/10 p-0 overflow-hidden text-white">
                    <div className="p-8 space-y-8">
                        <DialogHeader>
                            <DialogTitle className="text-4xl font-black font-outfit uppercase tracking-tighter text-destructive">Delete Order</DialogTitle>
                            <DialogDescription asChild className="space-y-4 text-left">
                                <div className="text-muted-foreground">
                                    <p className="text-lg font-medium">Are you sure you want to permanently delete this order?</p>
                                    <div className="p-6 bg-destructive/10 border border-destructive/20 rounded-3xl mt-3">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-destructive/60">Order ID</p>
                                                <p className="font-black font-outfit text-xl uppercase tracking-tight text-destructive">ORD-{selectedOrder?.id.slice(0, 8).toUpperCase()}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] font-black uppercase tracking-widest text-destructive/60">Customer</p>
                                                <p className="font-black font-outfit text-xl uppercase tracking-tight text-destructive">{selectedOrder?.userFullName}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-sm italic mt-3">This action is irreversible and will remove the order data from the system.</p>
                                </div>
                            </DialogDescription>
                        </DialogHeader>
                        <div className="flex gap-4 pt-4 border-t border-white/10">
                            <Button
                                variant="outline"
                                className="flex-1 h-14 rounded-2xl font-black uppercase tracking-widest"
                                onClick={() => setIsDeleteDialogOpen(false)}
                            >
                                CANCEL
                            </Button>
                            <Button
                                className="flex-1 h-14 rounded-2xl font-black uppercase tracking-widest bg-destructive hover:bg-destructive/90 text-white shadow-lg shadow-destructive/20"
                                onClick={() => {
                                    if (selectedOrder) {
                                        deleteMutation.mutate(selectedOrder.id);
                                    }
                                }}
                                disabled={deleteMutation.isPending}
                            >
                                {deleteMutation.isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : "DELETE NOW"}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
