"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { CartDrawer } from "@/features/cart/CartDrawer";
import { UserNav } from "./UserNav";
import { MobileNav } from "./MobileNav";
import { Button } from "@/components/ui/button";
import { BookMarked, Search, Menu } from "lucide-react";

export function Header() {
    const { data: session } = useSession();

    return (
        <header className="sticky top-0 z-50 w-full border-b border-white/10 glass-morphism transition-all duration-300">
            <div className="container mx-auto px-4 h-20 flex items-center justify-between">
                <div className="flex items-center gap-8">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="bg-primary p-2 rounded-xl group-hover:rotate-6 transition-transform">
                            <BookMarked className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-2xl font-black font-outfit tracking-tighter uppercase">
                            Static<span className="text-primary/60">Cosmos</span>
                        </span>
                    </Link>

                    <nav className="hidden md:flex items-center gap-6">
                        <Link href="/books" className="text-sm font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">
                            Library
                        </Link>
                        <Link href="/categories" className="text-sm font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">
                            Categories
                        </Link>
                        <Link href="/deals" className="text-sm font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">
                            Today&apos;s Deals
                        </Link>
                    </nav>
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden sm:flex items-center bg-muted/50 rounded-full px-4 py-2 border border-white/10 mr-2 group focus-within:ring-2 focus-within:ring-primary transition-all">
                        <Search className="h-4 w-4 text-muted-foreground group-focus-within:text-primary" />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="bg-transparent border-none focus:ring-0 text-sm w-32 lg:w-48 ml-2 outline-none font-medium"
                        />
                    </div>

                    <CartDrawer />

                    {session ? (
                        <UserNav />
                    ) : (
                        <div className="flex items-center gap-2">
                            <Button asChild variant="ghost" className="hidden sm:inline-flex rounded-full font-bold">
                                <Link href="/auth/login">Sign In</Link>
                            </Button>
                            <Button asChild className="rounded-full font-black px-6 shadow-lg shadow-primary/20">
                                <Link href="/auth/register">Join</Link>
                            </Button>
                        </div>
                    )}

                    <MobileNav />
                </div>
            </div>
        </header>
    );
}
