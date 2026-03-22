"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Users,
    BookOpen,
    ShoppingBag,
    TrendingUp,
    ArrowUpRight,
    ArrowDownRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { reportService } from "@/lib/api-reports";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminDashboard() {
    const { data: dashboardData, isLoading, error } = useQuery({
        queryKey: ["admin-dashboard"],
        queryFn: () => reportService.getDashboardReport(),
    });

    if (isLoading) {
        return (
            <div className="space-y-12 animate-pulse">
                <header className="space-y-2 border-b-4 border-muted pb-8">
                    <Skeleton className="h-16 w-1/4 mb-2" />
                    <Skeleton className="h-6 w-1/3" />
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <Card key={i} className="border-none shadow-xl glass-morphism p-6 space-y-4">
                            <div className="flex justify-between items-center">
                                <Skeleton className="h-4 w-20" />
                                <Skeleton className="h-8 w-8 rounded-lg" />
                            </div>
                            <Skeleton className="h-10 w-32" />
                            <Skeleton className="h-4 w-24 rounded-full" />
                        </Card>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <Card className="lg:col-span-2 border-none shadow-xl glass-morphism p-8 space-y-6">
                        <Skeleton className="h-8 w-40" />
                        <div className="space-y-4">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <div key={i} className="flex gap-4 py-4 border-b border-muted/20">
                                    <Skeleton className="h-4 flex-1" />
                                    <Skeleton className="h-4 w-20" />
                                    <Skeleton className="h-4 w-16" />
                                    <Skeleton className="h-4 w-24" />
                                </div>
                            ))}
                        </div>
                    </Card>
                    <Card className="border-none shadow-xl glass-morphism p-8 space-y-6">
                        <Skeleton className="h-8 w-40" />
                        <div className="space-y-6">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="flex justify-between items-center">
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-32" />
                                        <Skeleton className="h-3 w-20" />
                                    </div>
                                    <Skeleton className="h-8 w-16" />
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>
        );
    }

    if (error || !dashboardData?.success) {
        return (
            <div className="text-center p-8 bg-destructive/10 text-destructive rounded-xl">
                Failed to load dashboard data.
            </div>
        );
    }

    const report = dashboardData.data!;

    const stats = [
        {
            title: "Total Revenue",
            value: `$${report.totalRevenue.toLocaleString()}`,
            change: "+12.5%", // These could be calculated if backend provides previous period
            trend: "up",
            icon: TrendingUp,
            description: "Total earnings",
        },
        {
            title: "Active Users",
            value: report.totalUsers.toLocaleString(),
            change: "+180.1%",
            trend: "up",
            icon: Users,
            description: "Registered customers",
        },
        {
            title: "Orders Placed",
            value: report.totalOrders.toLocaleString(),
            change: "+19%",
            trend: "up",
            icon: ShoppingBag,
            description: "Total volume",
        },
        {
            title: "Books in Database",
            value: report.totalBooks.toLocaleString(),
            change: "+5.4%",
            trend: "up",
            icon: BookOpen,
            description: "Catalog size",
        },
    ];

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="space-y-2 border-b-4 border-primary pb-8">
                <h1 className="text-5xl lg:text-7xl font-black font-outfit tracking-tighter uppercase">Overview</h1>
                <p className="text-xl text-muted-foreground font-medium italic underline decoration-primary/30 underline-offset-8 decoration-2">Real-time business metrics.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {stats.map((stat, i) => (
                    <Card
                        key={i}
                        className="border-none shadow-xl glass-morphism overflow-hidden group hover:scale-[1.03] transition-all duration-300"
                    >
                        <CardHeader className="p-6 pb-2 flex flex-row items-center justify-between space-y-0">
                            <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">{stat.title}</CardTitle>
                            <div className="bg-primary/10 p-2 rounded-lg ring-1 ring-primary/20 group-hover:rotate-12 transition-transform">
                                <stat.icon className="h-5 w-5 text-primary" />
                            </div>
                        </CardHeader>
                        <CardContent className="p-6 pt-0 space-y-2">
                            <div className="text-3xl font-black font-outfit tracking-tighter">{stat.value}</div>
                            <div className="flex items-center gap-2">
                                <span className={cn(
                                    "flex items-center text-xs font-black px-2 py-0.5 rounded-full",
                                    stat.trend === "up" ? "bg-green-500/10 text-green-600" : "bg-destructive/10 text-destructive"
                                )}>
                                    {stat.trend === "up" ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
                                    {stat.change}
                                </span>
                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{stat.description}</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-2 border-none shadow-xl glass-morphism p-8 min-h-[400px] flex flex-col space-y-6">
                    <h3 className="text-2xl font-black font-outfit uppercase tracking-tight">Recent Sales</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-xs font-black uppercase text-muted-foreground/50 border-b border-white/10">
                                    <th className="pb-4">Customer</th>
                                    <th className="pb-4">Amount</th>
                                    <th className="pb-4 text-center">Status</th>
                                    <th className="pb-4 text-right">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {report.recentSales.map((sale) => (
                                    <tr key={sale.orderId} className="group transition-colors hover:bg-white/5">
                                        <td className="py-4 font-bold">{sale.customerName}</td>
                                        <td className="py-4 font-black text-primary">${sale.amount.toFixed(2)}</td>
                                        <td className="py-4 text-center">
                                            <span className={cn(
                                                "text-[10px] font-black uppercase px-2 py-1 rounded-full",
                                                sale.status === "Completed" ? "bg-green-500/10 text-green-600 border border-green-500/20" :
                                                sale.status === "Pending" ? "bg-yellow-500/10 text-yellow-600 border border-yellow-500/20" :
                                                "bg-muted text-muted-foreground border border-white/10"
                                            )}>
                                                {sale.status}
                                            </span>
                                        </td>
                                        <td className="py-4 text-right text-xs font-bold text-muted-foreground">
                                            {new Date(sale.date).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>

                <Card className="border-none shadow-xl glass-morphism p-8 min-h-[400px] flex flex-col space-y-6">
                    <h3 className="text-2xl font-black font-outfit uppercase tracking-tight">Top Sellers</h3>
                    <div className="space-y-6">
                        {report.topSellingBooks.map((book) => (
                            <div key={book.bookId} className="flex items-center justify-between group">
                                <div className="space-y-1">
                                    <p className="font-black text-sm group-hover:text-primary transition-colors">{book.title}</p>
                                    <p className="text-xs text-muted-foreground font-bold italic">{book.author}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-black text-primary text-sm">{book.unitsSold} sold</p>
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase opacity-50 tracking-tighter">${book.totalRevenue.toLocaleString()}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
}
