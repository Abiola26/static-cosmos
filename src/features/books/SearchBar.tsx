"use client";

import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchBarProps {
    onSearch: (query: string) => void;
    defaultValue?: string;
}

export function SearchBar({ onSearch, defaultValue = "" }: SearchBarProps) {
    const [query, setQuery] = useState(defaultValue);

    useEffect(() => {
        const timer = setTimeout(() => {
            onSearch(query);
        }, 500);

        return () => clearTimeout(timer);
    }, [query, onSearch]);

    return (
        <div className="relative group max-w-xl w-full">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            </div>
            <Input
                type="text"
                placeholder="Search by title, author, or ISBN..."
                className="pl-10 pr-10 h-12 rounded-full border-none bg-muted/50 focus-visible:ring-2 focus-visible:ring-primary transition-all shadow-inner"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
            {query && (
                <button
                    onClick={() => setQuery("")}
                    className="absolute inset-y-0 right-3 flex items-center"
                >
                    <X className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
                </button>
            )}
        </div>
    );
}
