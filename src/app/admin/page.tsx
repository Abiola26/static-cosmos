"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Users,
    BookOpen,
    ShoppingBag,
    TrendingUp,
    ArrowUpRight,
    ArrowDownRight
} from "lucide-react";
import { cn } from "@/lib/utils";

const stats = [
    {
        title: "Total Revenue",
        value: "$45,231.89",
        change: "+20.1%",
        trend: "up",
        icon: TrendingUp,
        description: "vs last month",
    },
    {
        title: "Active Users",
        value: "2,350",
        change: "+180.1%",
        trend: "up",
        icon: Users,
        description: "vs last month",
    },
    {
        title: "Books Sold",
        value: "12,234",
        change: "+19%",
        trend: "up",
        icon: ShoppingBag,
        description: "vs last month",
    },
    {
        title: "Active Licenses",
        value: "+573",
        change: "-12.5%",
        trend: "down",
        icon: BookOpen,
        description: "vs last month",
    },
];

export default function AdminDashboard() {
    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="space-y-2 border-b-4 border-primary pb-8">
                <h1 className="text-5xl lg:text-7xl font-black font-outfit tracking-tighter uppercase">Overview</h1>
                <p className="text-xl text-muted-foreground font-medium italic underline decoration-primary/30 underline-offset-8 decoration-2">Business metrics at a glance.</p>
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="border-none shadow-xl glass-morphism p-8 min-h-[400px] flex flex-col items-center justify-center text-center space-y-4">
                    <div className="bg-primary/5 rounded-full p-12">
                        <TrendingUp className="h-24 w-24 text-primary/20" />
                    </div>
                    <h3 className="text-2xl font-black font-outfit">Sales Performance</h3>
                    <p className="text-muted-foreground font-medium italic underline decoration-primary/10 underline-offset-4">Advanced analytics charts integration in the next iteration.</p>
                </Card>
                <Card className="border-none shadow-xl glass-morphism p-8 min-h-[400px] flex flex-col items-center justify-center text-center space-y-4">
                    <div className="bg-primary/5 rounded-full p-12">
                        <Users className="h-24 w-24 text-primary/20" />
                    </div>
                    <h3 className="text-2xl font-black font-outfit">Audience Retention</h3>
                    <p className="text-muted-foreground font-medium italic underline decoration-primary/10 underline-offset-4">User behavior metrics pending real-time data flow.</p>
                </Card>
            </div>
        </div>
    );
}
