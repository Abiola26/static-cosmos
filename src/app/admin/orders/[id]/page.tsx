"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { ordersApi } from "@/features/orders/orders-api";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
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
    Printer, 
    ArrowLeft, 
    CheckCircle2, 
    Clock, 
    Truck, 
    XCircle,
    CreditCard,
    MapPin,
    Calendar,
    Hash,
    UserCircle,
    ShoppingBag,
    Database,
    Fingerprint,
    Boxes,
    Trash2,
    Loader2
} from "lucide-react";
import { format } from "date-fns";
import { formatPrice, cn } from "@/lib/utils";
import Link from "next/link";
import { useState, useRef } from "react";

export default function AdminOrderDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;
    const invoiceRef = useRef<HTMLDivElement>(null);

    const { data: response, isLoading, error, refetch } = useQuery({
        queryKey: ["admin-order", id],
        queryFn: () => ordersApi.getOrderById(id),
    });

    const updateStatusMutation = useMutation({
        mutationFn: (status: string) => ordersApi.updateOrderStatus(id, status),
        onSuccess: () => {
            refetch();
            toast.success("Order status updated!");
        },
        onError: () => toast.error("Failed to update status."),
    });

    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const deleteMutation = useMutation({
        mutationFn: () => ordersApi.deleteOrder(id),
        onSuccess: () => {
            toast.success("Order deleted successfully.");
            router.push("/admin/orders");
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || "Error deleting order.");
        }
    });

    const order = response?.data;

    const handlePrint = () => {
        window.print();
    };

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-12 max-w-5xl space-y-8">
                <Skeleton className="h-12 w-48" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <Skeleton className="md:col-span-2 h-[800px] rounded-[3rem]" />
                    <Skeleton className="h-[400px] rounded-[3rem]" />
                </div>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="container mx-auto px-4 py-24 text-center space-y-6">
                <XCircle className="h-16 w-16 text-destructive mx-auto" />
                <h2 className="text-3xl font-black font-outfit uppercase">Order Not Found</h2>
                <Button asChild className="rounded-full px-8">
                    <Link href="/admin/orders">BACK TO LIST</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Action Bar (Hidden on print) */}
            <div className="flex flex-col sm:flex-row justify-between items-end gap-6 border-b-4 border-primary pb-8 print:hidden">
                <div className="space-y-4">
                    <Button 
                        variant="ghost" 
                        onClick={() => router.push("/admin/orders")}
                        className="rounded-full h-10 gap-2 font-bold group hover:bg-primary/5 px-0"
                    >
                        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Orders
                    </Button>
                    <div className="space-y-1">
                        <h1 className="text-5xl lg:text-7xl font-black font-outfit tracking-tighter uppercase">Order Details</h1>
                        <p className="text-xl text-muted-foreground font-medium underline decoration-primary/30 underline-offset-8 decoration-2 italic italic">
                            ORD-{order.id.slice(0, 8).toUpperCase()}
                        </p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <Button 
                        variant="destructive" 
                        onClick={() => setIsDeleteDialogOpen(true)}
                        className="rounded-full h-14 px-8 gap-3 font-black uppercase tracking-widest border-2 hover:scale-105 transition-all shadow-xl"
                    >
                        <Trash2 className="h-5 w-5" />
                        Delete Order
                    </Button>
                    <Button 
                        variant="outline" 
                        onClick={handlePrint}
                        className="rounded-full h-14 px-8 gap-3 font-black uppercase tracking-widest border-2 hover:scale-105 transition-all shadow-xl"
                    >
                        <Printer className="h-5 w-5" />
                        Print Invoice
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                {/* Main Order Info / Invoice (lg:span-8) */}
                <div 
                    ref={invoiceRef}
                    className="lg:col-span-8 bg-card glass-morphism p-10 md:p-16 rounded-[3rem] border border-white/10 shadow-3xl print:shadow-none print:p-0 print:border-none print:rounded-none"
                >
                    {/* Invoice/Bill Format Section */}
                    <div className="space-y-12">
                         {/* Header Section */}
                        <div className="flex flex-col md:flex-row justify-between items-start gap-12 border-b-2 border-dashed border-white/10 pb-12">
                            <div className="space-y-6">
                                <div className="inline-flex items-center gap-3 bg-primary text-white px-6 py-3 rounded-2xl font-black font-outfit text-2xl uppercase tracking-tighter shadow-xl">
                                    <ShoppingBag className="h-6 w-6" />
                                    BookStore
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-muted-foreground font-black uppercase text-xs tracking-widest">
                                        <Hash className="h-4 w-4 text-primary" />
                                        Official Invoice
                                    </div>
                                    <h2 className="text-4xl font-black font-outfit tracking-tighter uppercase underline decoration-primary decoration-4 underline-offset-4">
                                        ORD-{order.id.slice(0, 8)}
                                    </h2>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-x-12 gap-y-6 text-sm">
                                <div className="space-y-1 text-right sm:text-left">
                                    <p className="text-[10px] font-black uppercase text-muted-foreground/60 tracking-widest">Date Issued</p>
                                    <p className="flex items-center gap-2 font-black uppercase tracking-tight">
                                        <Calendar className="h-4 w-4 text-primary" />
                                        {format(new Date(order.createdAt), "MMM dd, yyyy")}
                                    </p>
                                </div>
                                <div className="space-y-1 text-right sm:text-left">
                                    <p className="text-[10px] font-black uppercase text-muted-foreground/60 tracking-widest">Payment Method</p>
                                    <p className="flex items-center gap-2 font-black uppercase tracking-tight">
                                        <CreditCard className="h-4 w-4 text-primary" />
                                        {order.paymentMethod}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Customer & Shipping Section */}
                        <div className="grid md:grid-cols-2 gap-12">
                            <div className="space-y-6 p-10 rounded-[2.5rem] bg-white/5 border-2 border-dashed border-white/10">
                                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2 text-primary">
                                    <MapPin className="h-5 w-5" />
                                    Shipping Destination
                                </h3>
                                <div className="space-y-2">
                                    <p className="font-black text-2xl font-outfit uppercase tracking-tight">{order.userFullName}</p>
                                    <p className="text-muted-foreground leading-relaxed text-sm whitespace-pre-wrap font-medium">
                                        {order.shippingAddress}
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex flex-col justify-center items-end text-right">
                                <p className="text-xs font-black uppercase text-muted-foreground/60 tracking-widest mb-2">Total Amount</p>
                                <p className="text-7xl md:text-8xl font-black font-outfit tracking-tighter text-primary group-hover:scale-105 transition-transform">
                                    {formatPrice(order.totalAmount + order.shippingFee, order.currency)}
                                </p>
                            </div>
                        </div>

                        {/* Items Breakdown */}
                        <div className="space-y-6">
                            <h3 className="text-xs font-black uppercase tracking-widest border-l-4 border-primary pl-4 py-1">Order Items</h3>
                            <div className="border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-primary text-white h-20">
                                            <th className="px-10 text-[10px] font-black uppercase tracking-[0.2em]">Product Details</th>
                                            <th className="px-10 text-[10px] font-black uppercase tracking-[0.2em] text-center">Qty</th>
                                            <th className="px-10 text-[10px] font-black uppercase tracking-[0.2em] text-right">Unit Price</th>
                                            <th className="px-10 text-[10px] font-black uppercase tracking-[0.2em] text-right">Subtotal</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5 text-sm">
                                        {order.items.map((item) => (
                                            <tr key={item.id} className="h-24 hover:bg-white/5 transition-all">
                                                <td className="px-10">
                                                    <div className="flex flex-col gap-1">
                                                        <span className="font-black text-lg font-outfit tracking-tight leading-tight">{item.bookTitle}</span>
                                                        <span className="text-[10px] text-primary/60 font-black uppercase tracking-widest italic">{item.isbn}</span>
                                                    </div>
                                                </td>
                                                <td className="px-10 text-center font-black text-xl font-outfit">{item.quantity}</td>
                                                <td className="px-10 text-right font-bold text-muted-foreground">{formatPrice(item.unitPrice, item.currency)}</td>
                                                <td className="px-10 text-right font-black text-2xl font-outfit text-primary">{formatPrice(item.subTotal, item.currency)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Final Calculation Section */}
                        <div className="flex flex-col items-end gap-4 pt-10 border-t-2 border-dashed border-white/10 print:pt-4 print:gap-1 break-inside-avoid">
                            <div className="flex justify-between w-full max-w-[350px] text-sm font-bold print:text-xs">
                                <span className="text-muted-foreground uppercase tracking-widest">SUBTOTAL</span>
                                <span>{formatPrice(order.totalAmount, order.currency)}</span>
                            </div>
                            <div className="flex justify-between w-full max-w-[350px] text-sm font-bold print:text-xs">
                                <span className="text-muted-foreground uppercase tracking-widest">SHIPPING FEE</span>
                                <span>{formatPrice(order.shippingFee, order.currency)}</span>
                            </div>
                            <div className="flex justify-between w-full max-w-[500px] text-4xl lg:text-5xl font-black font-outfit border-t-4 border-primary pt-6 mt-4 print:text-2xl print:pt-2">
                                <span className="uppercase tracking-tighter">ORDER TOTAL</span>
                                <span className="text-primary tracking-tighter underline decoration-primary/20">{formatPrice(order.totalAmount + order.shippingFee, order.currency)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Info & Controls (lg:span-4) print:hidden */}
                <div className="lg:col-span-4 space-y-8 print:hidden">
                    {/* Management Controls */}
                    <div className="bg-card glass-morphism p-10 rounded-[3rem] border border-white/10 shadow-3xl space-y-8">
                        <header className="space-y-1">
                            <h3 className="text-xs font-black uppercase tracking-widest text-primary flex items-center gap-2">
                                <Truck className="h-5 w-5" />
                                Order Management
                            </h3>
                            <p className="text-sm font-bold text-muted-foreground">Manage order fulfillment status.</p>
                        </header>

                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block">Update Fulfillment Status</label>
                            <div className="grid grid-cols-1 gap-3">
                                {["Pending", "Paid", "Shipped", "Completed", "Cancelled"].map((status) => (
                                    <Button
                                        key={status}
                                        variant={order.status === status ? "default" : "outline"}
                                        onClick={() => updateStatusMutation.mutate(status)}
                                        disabled={updateStatusMutation.isPending || order.status === "Cancelled" || order.status === "Completed"}
                                        className={cn(
                                            "rounded-2xl h-14 font-black uppercase tracking-widest text-xs transition-all",
                                            order.status === status ? "shadow-xl scale-[1.02]" : "hover:border-primary/50"
                                        )}
                                    >
                                        {status}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        <div className="pt-6 border-t border-white/10">
                             <div className="flex items-center gap-3">
                                 <div className={cn("h-4 w-4 rounded-full animate-pulse", order.isPaid ? "bg-green-500" : "bg-amber-500")} />
                                 <span className="font-black uppercase text-xs tracking-widest">
                                     Payment Status: <span className={order.isPaid ? "text-green-500" : "text-amber-500"}>
                                         {order.isPaid ? "Received" : "Awaiting Payment"}
                                     </span>
                                 </span>
                             </div>
                        </div>
                    </div>

                    {/* Customer Info Card */}
                    <div className="bg-card glass-morphism p-10 rounded-[3rem] border border-white/10 shadow-3xl space-y-8">
                        <header className="space-y-1">
                            <h3 className="text-xs font-black uppercase tracking-widest text-primary flex items-center gap-2">
                                <UserCircle className="h-5 w-5" />
                                Customer Details
                            </h3>
                            <p className="text-sm font-bold text-muted-foreground">Account information.</p>
                        </header>

                        <div className="space-y-4">
                           <div className="space-y-1">
                               <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Full Name</p>
                               <p className="font-black uppercase font-outfit text-xl">{order.userFullName}</p>
                           </div>

                        </div>
                    </div>
                </div>
            </div>

             {/* Print Styles Override */}
             <style jsx global>{`
                @media print {
                    @page {
                        margin: 1cm;
                        size: auto;
                    }
                    aside, nav, footer, header, .sidebar-info, .print-hidden, .print\\:hidden { display: none !important; }
                    body { background: white !important; margin: 0 !important; padding: 0 !important; color: black !important; }
                    .container { max-width: 100% !important; padding: 0 !important; margin: 0 !important; }
                    * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; box-shadow: none !important; }
                    .lg\\:col-span-8 { width: 100% !important; }

                    /* Tighten layout for print */
                    .rounded-\\[3rem\\], .rounded-\\[2\\.5rem\\] { border-radius: 0 !important; border: none !important; }
                    .p-10, .md\\:p-16 { padding: 0 !important; }
                    .gap-12 { gap: 1.5rem !important; }
                    .pb-12 { pb-4 !important; }
                    .h-24 { h-12 !important; }
                    .h-20 { h-10 !important; }
                    .text-7xl, .text-8xl { font-size: 3rem !important; }
                    .text-4xl, .text-5xl { font-size: 1.5rem !important; }
                    
                    .break-inside-avoid {
                        page-break-inside: avoid;
                        break-inside: avoid;
                    }
                }
            `}</style>
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
                                                <p className="font-black font-outfit text-xl uppercase tracking-tight text-destructive">ORD-{order?.id.slice(0, 8).toUpperCase()}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] font-black uppercase tracking-widest text-destructive/60">Customer</p>
                                                <p className="font-black font-outfit text-xl uppercase tracking-tight text-destructive">{order?.userFullName}</p>
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
                                onClick={() => deleteMutation.mutate()}
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
