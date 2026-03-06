"use client";

import { useSession } from "next-auth/react";
import { UserNav } from "@/components/shared/UserNav";
import { Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AdminHeader() {
    const { data: session } = useSession();

    return (
        <header className="h-20 border-b border-white/10 glass-morphism flex items-center justify-between px-8 sticky top-0 z-40">
            <div className="flex items-center gap-4 bg-muted/30 px-4 py-2 rounded-full border border-white/10 w-full max-w-md group focus-within:ring-2 focus-within:ring-primary transition-all">
                <Search className="h-4 w-4 text-muted-foreground group-focus-within:text-primary" />
                <input
                    type="text"
                    placeholder="Global search books, orders..."
                    className="bg-transparent border-none focus:ring-0 text-sm w-full outline-none font-medium"
                />
            </div>

            <div className="flex items-center gap-6">
                <Button variant="ghost" size="icon" className="relative h-12 w-12 rounded-full hover:bg-primary/5 transition-all group">
                    <Bell className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
                    <span className="absolute top-3 right-3 h-2 w-2 rounded-full bg-destructive ring-2 ring-white" />
                </Button>
                <div className="h-8 w-px bg-white/10 mx-2" />
                <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-black font-outfit uppercase tracking-tight">{session?.user?.name}</p>
                        <p className="text-[10px] font-black uppercase text-primary/60 tracking-widest">{session?.user?.role}</p>
                    </div>
                    <UserNav />
                </div>
            </div>
        </header>
    );
}
