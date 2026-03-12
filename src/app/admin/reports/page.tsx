"use client";

import { useQuery } from "@tanstack/react-query";
import { reportService } from "@/lib/api-reports";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
    Download, 
    BarChart3, 
    TrendingUp, 
    Package, 
    AlertTriangle,
    Loader2,
    Calendar,
    FileText,
    Users,
    Star,
    ArrowUpRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { toast } from "sonner";

export default function ReportsPage() {
    const [isExporting, setIsExporting] = useState(false);

    const { data: dashboardData, isLoading: dashLoading } = useQuery({
        queryKey: ["admin-dashboard"],
        queryFn: () => reportService.getDashboardReport(),
    });

    const { data: inventoryData, isLoading: invLoading } = useQuery({
        queryKey: ["admin-inventory"],
        queryFn: () => reportService.getInventoryReport(),
    });

    const { data: userData, isLoading: userLoading } = useQuery({
        queryKey: ["admin-user-engagement"],
        queryFn: () => reportService.getUserEngagementReport(),
    });

    const { data: reviewData, isLoading: reviewLoading } = useQuery({
        queryKey: ["admin-review-analytics"],
        queryFn: () => reportService.getReviewAnalyticsReport(),
    });

    const handleExport = async () => {
        setIsExporting(true);
        try {
            const data = await reportService.exportSalesReport();
            const url = window.URL.createObjectURL(new Blob([data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `sales_report_${new Date().toISOString().split('T')[0]}.csv`);
            document.body.appendChild(link);
            link.click();
            link.parentNode?.removeChild(link);
            toast.success("Sales report exported successfully");
        } catch (error) {
            console.error("Export failed", error);
            toast.error("Failed to export sales report");
        } finally {
            setIsExporting(false);
        }
    };

    if (dashLoading || invLoading || userLoading || reviewLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-12 w-12 text-primary animate-spin" />
            </div>
        );
    }

    const dashboard = dashboardData?.data;
    const inventory = inventoryData?.data;
    const userEngagement = userData?.data;
    const reviewAnalytics = reviewData?.data;

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b-4 border-primary pb-8">
                <div className="space-y-2">
                    <h1 className="text-5xl lg:text-7xl font-black font-outfit tracking-tighter uppercase">Reports</h1>
                    <p className="text-xl text-muted-foreground font-medium italic underline decoration-primary/30 underline-offset-8 decoration-2">Deep dive into business performance.</p>
                </div>
                <Button 
                    onClick={handleExport} 
                    disabled={isExporting}
                    className="h-16 px-8 rounded-2xl font-black uppercase tracking-widest text-lg shadow-xl shadow-primary/20 hover:scale-105 transition-transform group"
                >
                    {isExporting ? <Loader2 className="mr-2 h-6 w-6 animate-spin" /> : <Download className="mr-2 h-6 w-6 group-hover:-translate-y-1 transition-transform" />}
                    Export CSV
                </Button>
            </header>

            {/* User Engagement & Reviews Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <Card className="border-none shadow-2xl glass-morphism p-10 space-y-8">
                    <div className="flex items-center gap-4">
                        <div className="bg-blue-500/10 p-3 rounded-2xl">
                            <Users className="h-8 w-8 text-blue-500" />
                        </div>
                        <h3 className="text-3xl font-black font-outfit uppercase tracking-tight">Audience Retention</h3>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="p-6 bg-white/5 rounded-3xl border border-white/10 space-y-2">
                            <p className="text-4xl font-black font-outfit tracking-tighter">{userEngagement?.totalRegisteredUsers.toLocaleString()}</p>
                            <p className="text-xs font-black uppercase text-muted-foreground/60 tracking-widest text-nowrap">Total Users</p>
                        </div>
                        <div className="p-6 bg-primary/5 rounded-3xl border border-primary/20 space-y-2">
                            <div className="flex items-center gap-2">
                                <span className="text-4xl font-black font-outfit tracking-tighter text-primary">{userEngagement?.activeUsersLast30Days.toLocaleString()}</span>
                                <span className="flex items-center text-[10px] font-black bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                                    <ArrowUpRight className="h-3 w-3 mr-1" /> Active
                                </span>
                            </div>
                            <p className="text-xs font-black uppercase text-muted-foreground/60 tracking-widest text-nowrap">Last 30 Days</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground/40 border-b border-white/5 pb-2">Top Customers</h4>
                        <div className="space-y-3 max-h-[250px] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-white/10">
                            {userEngagement?.topCustomers.slice(0, 5).map((customer, idx) => (
                                <div key={customer.userId} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-primary/30 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center font-black text-primary text-xs">
                                            #{idx + 1}
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm tracking-tight">{customer.fullName}</p>
                                            <p className="text-[10px] font-black uppercase text-muted-foreground/50">{customer.totalOrders} Orders</p>
                                        </div>
                                    </div>
                                    <span className="font-black text-primary">${customer.totalSpent.toLocaleString()}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </Card>

                <Card className="border-none shadow-2xl glass-morphism p-10 space-y-8">
                    <div className="flex items-center gap-4">
                        <div className="bg-yellow-500/10 p-3 rounded-2xl">
                            <Star className="h-8 w-8 text-yellow-500" />
                        </div>
                        <h3 className="text-3xl font-black font-outfit uppercase tracking-tight">Review Analytics</h3>
                    </div>

                    <div className="flex items-center gap-8 p-6 bg-white/5 rounded-3xl border border-white/10">
                        <div className="space-y-2 text-center border-r border-white/10 pr-8">
                            <p className="text-6xl font-black font-outfit tracking-tighter text-yellow-500">{reviewAnalytics?.averageRating.toFixed(1)}</p>
                            <div className="flex justify-center text-yellow-500">
                                {[1, 2, 3, 4, 5].map((s) => (
                                    <Star key={s} className={cn("h-4 w-4", s <= Math.round(reviewAnalytics?.averageRating || 0) ? "fill-current" : "text-muted-foreground/20")} />
                                ))}
                            </div>
                            <p className="text-xs font-black uppercase text-muted-foreground/60 tracking-widest text-nowrap">Average Rating</p>
                        </div>
                        <div className="flex-1 space-y-3">
                            {/* Rating Distribution Bars */}
                            {[5, 4, 3, 2, 1].map((rating) => {
                                const count = reviewAnalytics?.ratingDistribution.find(d => d.rating === rating)?.count || 0;
                                const maxCount = Math.max(...(reviewAnalytics?.ratingDistribution.map(d => d.count) || [1]));
                                const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;
                                
                                return (
                                    <div key={rating} className="flex items-center gap-3">
                                        <span className="text-xs font-black text-muted-foreground flex items-center gap-1 w-8">
                                            {rating} <Star className="h-3 w-3" />
                                        </span>
                                        <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                                            <div 
                                                className={cn(
                                                    "h-full rounded-full transition-all duration-1000",
                                                    rating >= 4 ? "bg-green-500" : rating === 3 ? "bg-yellow-500" : "bg-destructive"
                                                )}
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                        <span className="text-xs font-bold w-6 text-right">{count}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground/40 border-b border-white/5 pb-2">Highest Rated</h4>
                        <div className="space-y-3">
                            {reviewAnalytics?.topRatedBooks.slice(0, 3).map((book) => (
                                <div key={book.bookId} className="flex flex-col p-4 bg-white/5 rounded-2xl border border-white/5 group hover:border-white/20 transition-all">
                                    <div className="flex items-start justify-between">
                                        <span className="font-bold text-sm tracking-tight pr-4">{book.title}</span>
                                        <span className="flex items-center text-sm font-black text-yellow-500">
                                            {book.averageRating.toFixed(1)} <Star className="ml-1 h-3 w-3 fill-current" />
                                        </span>
                                    </div>
                                    <span className="text-[10px] font-black uppercase text-muted-foreground/40 mt-1">Based on {book.reviewCount} reviews</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Sales by Category (CSS Visual) */}
                <Card className="border-none shadow-2xl glass-morphism p-10 space-y-8">
                    <div className="flex items-center gap-4">
                        <div className="bg-primary/10 p-3 rounded-2xl">
                            <BarChart3 className="h-8 w-8 text-primary" />
                        </div>
                        <h3 className="text-3xl font-black font-outfit uppercase tracking-tight">Revenue by Category</h3>
                    </div>
                    
                    <div className="space-y-8">
                        {dashboard?.salesByCategory.map((item, i) => (
                            <div key={item.categoryName} className="space-y-3">
                                <div className="flex justify-between items-end">
                                    <span className="font-black text-lg uppercase tracking-tight">{item.categoryName}</span>
                                    <span className="font-bold text-primary">${item.revenue.toLocaleString()}</span>
                                </div>
                                <div className="h-4 bg-primary/5 rounded-full overflow-hidden p-1 border border-white/5">
                                    <div 
                                        className="h-full bg-gradient-to-r from-primary to-primary/60 rounded-full transition-all duration-1000"
                                        style={{ width: `${(item.revenue / (dashboard.salesByCategory[0]?.revenue || 1)) * 100}%` }}
                                    />
                                </div>
                                <div className="flex justify-between py-1 px-2 bg-white/5 rounded-lg border border-white/5">
                                    <span className="text-[10px] font-black uppercase text-muted-foreground/60">Units Sold</span>
                                    <span className="text-[10px] font-black">{item.unitsSold}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Inventory Status */}
                <Card className="border-none shadow-2xl glass-morphism p-10 space-y-8">
                    <div className="flex items-center gap-4">
                        <div className="bg-yellow-500/10 p-3 rounded-2xl">
                            <AlertTriangle className="h-8 w-8 text-yellow-500" />
                        </div>
                        <h3 className="text-3xl font-black font-outfit uppercase tracking-tight">Inventory Health</h3>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="p-6 bg-white/5 rounded-3xl border border-white/10 space-y-2">
                            <Package className="h-6 w-6 text-primary" />
                            <p className="text-4xl font-black font-outfit tracking-tighter">{inventory?.totalStock.toLocaleString()}</p>
                            <p className="text-xs font-black uppercase text-muted-foreground/60 tracking-widest text-nowrap">Total Items In Stock</p>
                        </div>
                        <div className="p-6 bg-destructive/5 rounded-3xl border border-destructive/10 space-y-2">
                            <AlertTriangle className="h-6 w-6 text-destructive" />
                            <p className="text-4xl font-black font-outfit tracking-tighter text-destructive">{inventory?.lowStockBooks.length}</p>
                            <p className="text-xs font-black uppercase text-muted-foreground/60 tracking-widest text-nowrap">Low Stock Alerts</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground/40 border-b border-white/5 pb-2">Critical Restock Needed</h4>
                        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-white/10">
                            {inventory?.lowStockBooks.map((book) => (
                                <div key={book.bookId} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-destructive/30 transition-colors">
                                    <span className="font-bold text-sm">{book.title}</span>
                                    <span className="bg-destructive/10 text-destructive text-[10px] font-black px-3 py-1 rounded-full border border-destructive/20">
                                        {book.currentStock} REMAINING
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Monthly Sales Trend Visual */}
                <Card className="lg:col-span-2 border-none shadow-2xl glass-morphism p-10 space-y-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="bg-primary/10 p-3 rounded-2xl">
                                <TrendingUp className="h-8 w-8 text-primary" />
                            </div>
                            <h3 className="text-3xl font-black font-outfit uppercase tracking-tight">Sales Trends</h3>
                        </div>
                        <div className="flex gap-2">
                            <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
                                <span className="w-2 h-2 rounded-full bg-primary" />
                                <span className="text-[10px] font-black uppercase">Revenue</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-end justify-between h-64 gap-4 px-4 border-b border-white/5 pb-2 pt-8">
                        {dashboard?.monthlySales.map((item, i) => (
                            <div key={item.month} className="flex-1 flex flex-col items-center gap-4 h-full justify-end group">
                                <div className="relative w-full flex justify-center">
                                    <div 
                                        className="w-full max-w-[40px] bg-primary/20 rounded-t-xl transition-all duration-1000 group-hover:bg-primary/40"
                                        style={{ height: `${(item.revenue / (Math.max(...dashboard.monthlySales.map(m => m.revenue)) || 1)) * 100}%` }}
                                    />
                                    <div className="absolute -top-10 scale-0 group-hover:scale-100 transition-transform bg-primary text-white text-[10px] font-black p-2 rounded-lg shadow-xl z-10 pointer-events-none">
                                        ${item.revenue.toLocaleString()}
                                    </div>
                                </div>
                                <span className="text-[10px] font-black uppercase text-muted-foreground/40 rotate-45 origin-left mt-4 text-nowrap">{item.month}</span>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Quick Reports */}
                <div className="space-y-8">
                    <Card className="border-none shadow-2xl glass-morphism p-8 space-y-6">
                        <h4 className="text-xl font-black font-outfit uppercase tracking-tight">Snapshot</h4>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                                <div className="flex items-center gap-3">
                                    <Calendar className="h-4 w-4 text-primary" />
                                    <span className="text-xs font-bold uppercase text-muted-foreground">This Month</span>
                                </div>
                                <span className="font-black text-primary">${dashboard?.monthlySales[dashboard.monthlySales.length - 1]?.revenue.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                                <div className="flex items-center gap-3">
                                    <FileText className="h-4 w-4 text-primary" />
                                    <span className="text-xs font-bold uppercase text-muted-foreground">Avg. Order Value</span>
                                </div>
                                <span className="font-black">${((dashboard?.totalRevenue || 0) / (dashboard?.totalOrders || 1)).toFixed(2)}</span>
                            </div>
                        </div>
                    </Card>

                    <Card className="border-none shadow-2xl glass-morphism p-8 bg-primary/5 border border-primary/10">
                        <h4 className="text-lg font-black font-outfit uppercase tracking-tight mb-4">Pro Tip</h4>
                        <p className="text-sm text-muted-foreground italic leading-relaxed">
                            "Users tend to buy more on weekends. Consider running category-specific promotions for <span className="text-primary font-bold">{dashboard?.salesByCategory[0]?.categoryName}</span> to boost engagement."
                        </p>
                    </Card>
                </div>
            </div>
        </div>
    );
}
