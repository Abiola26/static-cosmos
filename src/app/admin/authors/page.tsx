"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { ApiResponse } from "@/types";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Users, Plus, Edit, Trash2, ArrowRight, UserCircle, BookOpen } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function AdminAuthorsPage() {
    // Note: Assuming an authors endpoint exists or using books data to derive
    const { data: authorsData, isLoading } = useQuery({
        queryKey: ["admin-authors"],
        queryFn: async () => {
            // Placeholder: In a real app, this would be a dedicated authors endpoint
            const response = await api.get<ApiResponse<any[]>>("/books");
            // Unique authors from books for demonstration
            if (response.data?.data) {
                const books = (response.data.data as any).items || response.data.data;
                const uniqueAuthors = Array.from(new Set(books.map((b: any) => b.author))).map((name, i) => ({
                    id: String(i + 1),
                    name,
                    bio: "Scholar and visionary in the cosmic library.",
                    bookCount: books.filter((b: any) => b.author === name).length,
                }));
                return { success: true, data: uniqueAuthors, message: "Success", statusCode: 200, errors: [] };
            }
            return response.data;
        }
    });

    const authors = authorsData?.data || [];

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="flex flex-col md:flex-row justify-between items-end gap-6 border-b-4 border-primary pb-8">
                <div className="space-y-2">
                    <h1 className="text-5xl lg:text-7xl font-black font-outfit tracking-tighter uppercase">Creators</h1>
                    <p className="text-xl text-muted-foreground font-medium underline decoration-primary/30 underline-offset-8 decoration-2 italic">Cultivate your roster of literary talent.</p>
                </div>
                <Button className="rounded-full h-16 px-10 text-lg font-black bg-primary shadow-2xl hover:scale-105 transition-all">
                    <Plus className="mr-3 h-6 w-6" />
                    ONBOARD AUTHOR
                </Button>
            </header>

            <div className="bg-card glass-morphism rounded-[2.5rem] border border-white/10 shadow-3xl overflow-hidden ring-1 ring-black/5">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent border-white/10 h-20">
                            <TableHead className="px-8 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 w-[80px]">Profile</TableHead>
                            <TableHead className="px-8 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Information</TableHead>
                            <TableHead className="px-8 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Portfolio</TableHead>
                            <TableHead className="px-8 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            [1, 2, 3].map(i => (
                                <TableRow key={i} className="animate-pulse h-28 border-white/5">
                                    <TableCell className="px-8"><div className="h-12 w-12 bg-muted rounded-full" /></TableCell>
                                    <TableCell className="px-8 flex flex-col gap-2 mt-6">
                                        <div className="h-4 w-48 bg-muted rounded" />
                                        <div className="h-3 w-64 bg-muted rounded opacity-50" />
                                    </TableCell>
                                    <TableCell className="px-8"><div className="h-4 w-24 bg-muted rounded" /></TableCell>
                                    <TableCell className="px-8"><div className="h-4 w-16 bg-muted rounded float-right" /></TableCell>
                                </TableRow>
                            ))
                        ) : authors.map((author: any) => (
                            <TableRow key={author.id} className="group hover:bg-primary/5 transition-colors h-28 border-white/5">
                                <TableCell className="px-8">
                                    <Avatar className="h-14 w-14 rounded-2xl border-2 border-white/20 shadow-lg group-hover:scale-110 transition-transform">
                                        <AvatarFallback className="bg-primary text-white font-black">{author.name[0]}</AvatarFallback>
                                    </Avatar>
                                </TableCell>
                                <TableCell className="px-8">
                                    <div className="space-y-1">
                                        <p className="font-black font-outfit uppercase tracking-tight text-xl">{author.name}</p>
                                        <p className="text-xs font-medium text-muted-foreground italic truncate max-w-md">{author.bio}</p>
                                    </div>
                                </TableCell>
                                <TableCell className="px-8">
                                    <div className="bg-primary/10 px-4 py-2 rounded-full inline-flex items-center gap-2 border border-primary/20">
                                        <BookOpen className="h-4 w-4 text-primary" />
                                        <span className="font-black tabular-nums">{author.bookCount} Publications</span>
                                    </div>
                                </TableCell>
                                <TableCell className="px-8 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <Button variant="ghost" size="icon" className="h-12 w-12 rounded-xl hover:bg-primary hover:text-white transition-all">
                                            <Edit className="h-5 w-5" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-12 w-12 rounded-xl hover:bg-destructive/10 text-destructive hover:bg-destructive hover:text-white transition-all">
                                            <Trash2 className="h-5 w-5" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <div className="flex justify-center pt-8">
                <Button variant="outline" className="rounded-full h-14 px-8 border-2 font-black gap-2 group flex items-center">
                    RECRUIT NEW TALENT
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
            </div>
        </div>
    );
}

// Simple fallback icon import since BookOpen was already used
const BookOpenIcon = BookOpen;
