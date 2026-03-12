"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    BarChart3,
    BookOpen,
    Tags,
    Users,
    ShoppingBag,
    Settings,
    ChevronLeft,
    ChevronRight,
    PenLine,
    User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const sidebarLinks = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/reports", label: "Reports", icon: BarChart3 },
    { href: "/admin/books", label: "Books", icon: BookOpen },
    { href: "/admin/categories", label: "Categories", icon: Tags },
    { href: "/admin/authors", label: "Authors", icon: PenLine },
    { href: "/admin/users", label: "Users", icon: Users },
    { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
    { href: "/profile", label: "My Profile", icon: User },
    { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminSidebar() {
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <aside
            className={cn(
                "relative h-screen border-r border-white/10 glass-morphism transition-all duration-500 flex flex-col pt-8",
                isCollapsed ? "w-20" : "w-72"
            )}
        >
            <div className={cn("px-6 mb-12 flex items-center gap-3", isCollapsed && "justify-center")}>
                <div className="bg-primary p-2 rounded-xl">
                    <BookOpen className="h-6 w-6 text-white" />
                </div>
                {!isCollapsed && (
                    <span className="text-xl font-black font-outfit uppercase tracking-tighter">
                        ADMIN<span className="text-primary/60">HUB</span>
                    </span>
                )}
            </div>

            <nav className="flex-1 px-3 space-y-2">
                {sidebarLinks.map((link) => {
                    const isActive = pathname === link.href;
                    const Icon = link.icon;

                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 font-bold group",
                                isActive
                                    ? "bg-primary text-white shadow-lg shadow-primary/20 scale-105"
                                    : "text-muted-foreground hover:bg-primary/5 hover:text-primary",
                                isCollapsed && "justify-center px-0 h-12 w-12 mx-auto"
                            )}
                        >
                            <Icon className={cn("h-5 w-5", isActive ? "scale-110" : "group-hover:scale-110 transition-transform")} />
                            {!isCollapsed && <span>{link.label}</span>}
                            {isActive && !isCollapsed && (
                                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                            )}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-white/10">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="w-full h-12 rounded-xl hover:bg-primary/5 text-muted-foreground transition-all"
                >
                    {isCollapsed ? <ChevronRight /> : <ChevronLeft className="mr-2" />}
                    {!isCollapsed && <span className="font-bold">Collapse</span>}
                </Button>
            </div>
        </aside>
    );
}
