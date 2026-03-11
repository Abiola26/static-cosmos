"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { ordersApi } from "@/features/orders/orders-api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
    Printer, 
    Download, 
    ArrowLeft, 
    CheckCircle2, 
    Clock, 
    Truck, 
    XCircle,
    CreditCard,
    MapPin,
    Calendar,
    Hash,
    ShoppingBag
} from "lucide-react";
import { format } from "date-fns";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import { useRef } from "react";

export default function OrderDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;
    const invoiceRef = useRef<HTMLDivElement>(null);

    const { data: response, isLoading, error } = useQuery({
        queryKey: ["order", id],
        queryFn: () => ordersApi.getOrderById(id),
    });

    const order = response?.data;

    const handlePrint = () => {
        window.print();
    };

    const getStatusIcon = (status: string) => {
        switch (status.toLowerCase()) {
            case "completed": return <CheckCircle2 className="h-5 w-5 text-green-500" />;
            case "paid": return <CheckCircle2 className="h-5 w-5 text-emerald-500" />;
            case "shipped": return <Truck className="h-5 w-5 text-blue-500" />;
            case "pending": return <Clock className="h-5 w-5 text-amber-500" />;
            case "cancelled": return <XCircle className="h-5 w-5 text-destructive" />;
            default: return null;
        }
    };

    const getStatusBadgeClass = (status: string) => {
        switch (status.toLowerCase()) {
            case "completed": return "bg-green-500/10 text-green-600 border-green-200";
            case "paid": return "bg-emerald-500/10 text-emerald-600 border-emerald-200";
            case "shipped": return "bg-blue-500/10 text-blue-600 border-blue-200";
            case "pending": return "bg-amber-500/10 text-amber-600 border-amber-200";
            case "cancelled": return "bg-destructive/10 text-destructive border-destructive-200";
            default: return "bg-muted text-muted-foreground";
        }
    };

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-12 max-w-4xl space-y-8">
                <Skeleton className="h-12 w-48" />
                <Skeleton className="h-[600px] w-full rounded-3xl" />
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="container mx-auto px-4 py-24 text-center space-y-6">
                <XCircle className="h-16 w-16 text-destructive mx-auto" />
                <h2 className="text-3xl font-black font-outfit">Order Not Found</h2>
                <p className="text-muted-foreground">We couldn't retrieve the details for this order.</p>
                <Button asChild className="rounded-full px-8">
                    <Link href="/orders">BACK TO ORDERS</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Action Bar (Hidden on print) */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 print:hidden">
                <Button 
                    variant="ghost" 
                    onClick={() => router.back()}
                    className="rounded-full gap-2 font-bold group"
                >
                    <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Orders
                </Button>
                <div className="flex gap-3">
                    <Button 
                        variant="outline" 
                        onClick={handlePrint}
                        className="rounded-full gap-2 font-bold border-2"
                    >
                        <Printer className="h-4 w-4" />
                        Print Invoice
                    </Button>
                </div>
            </div>

            {/* Main Invoice Card */}
            <div 
                ref={invoiceRef}
                className="bg-white text-black p-8 sm:p-12 md:p-16 rounded-[2.5rem] shadow-2xl border border-black/5 flex flex-col gap-12 print:shadow-none print:p-0 print:border-none print:rounded-none"
            >
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start gap-8 border-b-2 border-dashed border-black/10 pb-12">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 bg-black text-white px-4 py-2 rounded-xl font-black font-outfit text-xl uppercase tracking-tighter">
                            <ShoppingBag className="h-5 w-5" />
                            BookStore
                        </div>
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-muted-foreground font-black uppercase text-[10px] tracking-widest">
                                <Hash className="h-3 w-3" />
                                Invoice No.
                            </div>
                            <h2 className="text-3xl font-black font-outfit tracking-tighter uppercase underline decoration-primary decoration-4 underline-offset-4">
                                ORD-{order.id.slice(0, 8)}
                            </h2>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-x-12 gap-y-4 text-sm font-medium">
                        <div className="space-y-1">
                            <p className="text-[10px] font-black uppercase text-muted-foreground/60 tracking-widest">Order Date</p>
                            <p className="flex items-center gap-2 font-bold">
                                <Calendar className="h-3.5 w-3.5 text-primary" />
                                {format(new Date(order.createdAt), "MMMM dd, yyyy")}
                            </p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-black uppercase text-muted-foreground/60 tracking-widest">Order Status</p>
                            <div className={`flex items-center gap-2 px-3 py-1 rounded-full border w-fit font-black text-[10px] uppercase ${getStatusBadgeClass(order.status)}`}>
                                {getStatusIcon(order.status)}
                                {order.status}
                            </div>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-black uppercase text-muted-foreground/60 tracking-widest">Payment</p>
                            <p className="flex items-center gap-2 font-bold">
                                <CreditCard className="h-3.5 w-3.5 text-primary" />
                                {order.paymentMethod}
                                <span className={order.isPaid ? "text-green-600" : "text-amber-600"}>
                                    ({order.isPaid ? "PAID" : "UNPAID"})
                                </span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Shipping Section */}
                <div className="grid md:grid-cols-2 gap-12">
                    <div className="space-y-4 p-8 rounded-3xl bg-muted/20 border-2 border-dashed border-muted print:bg-transparent">
                        <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2 text-primary">
                            <MapPin className="h-4 w-4" />
                            Shipping Details
                        </h3>
                        <div className="space-y-1 text-sm">
                            <p className="font-bold text-lg">{order.userFullName}</p>
                            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                {order.shippingAddress}
                            </p>
                        </div>
                    </div>
                    
                    <div className="flex flex-col justify-center items-end text-right">
                        <p className="text-[10px] font-black uppercase text-muted-foreground/60 tracking-widest mb-2">Total Paid</p>
                        <p className="text-6xl font-black font-outfit tracking-tighter text-primary">
                            {formatPrice(order.totalAmount, order.currency)}
                        </p>
                    </div>
                </div>

                {/* Items Table */}
                <div className="space-y-6">
                    <h3 className="text-sm font-black uppercase tracking-widest border-l-4 border-primary pl-4 py-1">Order Items</h3>
                    <div className="border border-black/5 rounded-[2rem] overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-black text-white h-16">
                                    <th className="px-8 text-[10px] font-black uppercase tracking-widest">Description</th>
                                    <th className="px-8 text-[10px] font-black uppercase tracking-widest text-center">Qty</th>
                                    <th className="px-8 text-[10px] font-black uppercase tracking-widest text-right">Price</th>
                                    <th className="px-8 text-[10px] font-black uppercase tracking-widest text-right">Subtotal</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-black/5">
                                {order.items.map((item) => (
                                    <tr key={item.id} className="h-20 hover:bg-muted/50 transition-colors">
                                        <td className="px-8">
                                            <div className="flex flex-col">
                                                <span className="font-black text-sm uppercase">{item.bookTitle}</span>
                                                <span className="text-[10px] text-muted-foreground font-medium italic">ISBN: {item.isbn}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 text-center font-bold">{item.quantity}</td>
                                        <td className="px-8 text-right font-medium">{formatPrice(item.unitPrice, item.currency)}</td>
                                        <td className="px-8 text-right font-black text-primary">{formatPrice(item.subTotal, item.currency)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Summary Section */}
                <div className="flex flex-col items-end gap-3 pt-8 border-t-2 border-dashed border-black/10 print:pt-4 print:gap-1 break-inside-avoid">
                    <div className="flex justify-between w-full max-w-[300px] text-sm font-medium print:text-xs">
                        <span className="text-muted-foreground uppercase tracking-widest">Subtotal</span>
                        <span>{formatPrice(order.totalAmount, order.currency)}</span>
                    </div>
                    <div className="flex justify-between w-full max-w-[300px] text-sm font-medium print:text-xs">
                        <span className="text-muted-foreground uppercase tracking-widest">Shipping Fee</span>
                        <span>{formatPrice(order.shippingFee, order.currency)}</span>
                    </div>
                    <div className="flex justify-between w-full max-w-[400px] text-3xl font-black font-outfit border-t-2 border-black pt-4 mt-2 print:text-xl print:pt-2">
                        <span className="uppercase tracking-tighter">TOTAL</span>
                        <span className="text-primary tracking-tighter">{formatPrice(order.totalAmount + order.shippingFee, order.currency)}</span>
                    </div>
                </div>

                {/* Footer Section */}
                <div className="text-center space-y-4 pt-12 print:pt-6 print:space-y-1 break-inside-avoid">
                    <p className="text-sm font-medium text-muted-foreground italic print:text-[10px]">
                        Thank you for your purchase from BookStore! If you have any questions, please contact our support team.
                    </p>
                    <div className="flex items-center justify-center gap-8 py-6 rounded-2xl bg-black/5 opacity-50 grayscale print:hidden">
                        <img src="/paystack-logo.png" className="h-4 object-contain" alt="Paystack" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em]">Secure Transaction</span>
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
                    nav, footer, header, .action-buttons, .print\\:hidden { display: none !important; }
                    body { background: white !important; margin: 0 !important; padding: 0 !important; color: black !important; }
                    .container { max-width: 100% !important; padding: 0 !important; margin: 0 !important; }
                    * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; box-shadow: none !important; }
                    
                    /* Tighten layout for print */
                    .rounded-\\[2\\.5rem\\] { border-radius: 0 !important; border: none !important; }
                    .p-8, .p-12, .p-16 { padding: 0 !important; }
                    .gap-12 { gap: 1.5rem !important; }
                    .pb-12 { pb-4 !important; }
                    .h-20 { h-12 !important; }
                    .h-16 { h-10 !important; }
                    .text-6xl { font-size: 2.5rem !important; }
                    .text-3xl { font-size: 1.5rem !important; }
                    
                    .break-inside-avoid {
                        page-break-inside: avoid;
                        break-inside: avoid;
                    }
                }
            `}</style>
        </div>
    );
}
