"use client";

import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, BookMarked, Home, Library, Tags, Percent, Heart, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const mobileLinks = [
    { href: "/", label: "Home", icon: Home },
    { href: "/books", label: "Library", icon: Library },
    { href: "/categories", label: "Categories", icon: Tags },
    { href: "/deals", label: "Today's Deals", icon: Percent },
    { href: "/wishlist", label: "Wishlist", icon: Heart },
    { href: "/orders", label: "My Orders", icon: ShoppingBag },
];

export function MobileNav() {
    const [open, setOpen] = useState(false);
    const pathname = usePathname();

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden rounded-full hover:bg-primary/5">
                    <Menu className="h-6 w-6" />
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] glass-morphism border-r border-white/10 p-0 flex flex-col">
                <SheetHeader className="p-8 border-b border-white/10">
                    <Link href="/" onClick={() => setOpen(false)} className="flex items-center gap-2 group">
                        <div className="bg-primary p-2 rounded-xl group-hover:rotate-6 transition-transform">
                            <BookMarked className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-2xl font-black font-outfit tracking-tighter uppercase">
                            Static<span className="text-primary/60">Cosmos</span>
                        </span>
                    </Link>
                </SheetHeader>

                <nav className="flex-1 px-4 py-8 space-y-2">
                    {mobileLinks.map((link) => {
                        const isActive = pathname === link.href;
                        const Icon = link.icon;

                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setOpen(false)}
                                className={cn(
                                    "flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 font-bold group",
                                    isActive
                                        ? "bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02]"
                                        : "text-muted-foreground hover:bg-primary/5 hover:text-primary"
                                )}
                            >
                                <Icon className={cn("h-5 w-5", isActive ? "scale-110" : "group-hover:scale-110 transition-transform")} />
                                <span className="text-lg">{link.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-8 border-t border-white/10 bg-muted/30">
                    <p className="text-[10px] font-black uppercase text-muted-foreground tracking-[0.2em] mb-4">Account</p>
                    <div className="grid grid-cols-2 gap-3">
                        <Button asChild variant="outline" className="rounded-xl font-bold h-12 shadow-sm border-2">
                            <Link href="/auth/login" onClick={() => setOpen(false)}>Login</Link>
                        </Button>
                        <Button asChild className="rounded-xl font-black h-12 shadow-md">
                            <Link href="/auth/register" onClick={() => setOpen(false)}>Join</Link>
                        </Button>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
