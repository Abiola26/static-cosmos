"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { booksApi } from "@/features/books/books-api";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Edit, Trash2, Tags, ArrowRight, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { toast } from "sonner";

export default function AdminCategoriesPage() {
    const queryClient = useQueryClient();
    const [newCategoryName, setNewCategoryName] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<{ id: string, name: string } | null>(null);
    const [editCategoryName, setEditCategoryName] = useState("");

    const { data: categoriesData, isLoading } = useQuery({
        queryKey: ["categories"],
        queryFn: booksApi.getCategories,
    });

    const categories = categoriesData?.data || [];

    const createMutation = useMutation({
        mutationFn: (name: string) => booksApi.createCategory({ name }),
        onSuccess: (response) => {
            if (response.success) {
                toast.success("Category created successfully.");
                queryClient.invalidateQueries({ queryKey: ["categories"] });
                setNewCategoryName("");
                setIsDialogOpen(false);
            } else {
                toast.error(response.message || "Failed to create category.");
            }
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "An error occurred.");
        }
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, name }: { id: string; name: string }) => booksApi.updateCategory(id, { name }),
        onSuccess: (response) => {
            if (response.success) {
                toast.success("Category updated successfully.");
                queryClient.invalidateQueries({ queryKey: ["categories"] });
                setIsEditDialogOpen(false);
                setEditingCategory(null);
            } else {
                toast.error(response.message || "Failed to update category.");
            }
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => booksApi.deleteCategory(id),
        onSuccess: (response) => {
            if (response.success) {
                toast.success("Category deleted successfully.");
                queryClient.invalidateQueries({ queryKey: ["categories"] });
            } else {
                toast.error(response.message || "Failed to delete category.");
            }
        },
    });

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        if (newCategoryName.trim()) {
            createMutation.mutate(newCategoryName);
        }
    };

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="flex flex-col md:flex-row justify-between items-end gap-6 border-b-4 border-primary pb-8">
                <div className="space-y-2">
                    <h1 className="text-5xl lg:text-7xl font-black font-outfit tracking-tighter uppercase">Categories</h1>
                    <p className="text-xl text-muted-foreground font-medium underline decoration-primary/30 underline-offset-8 decoration-2 italic">Organize your books into categories.</p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="rounded-full h-16 px-10 text-lg font-black bg-primary shadow-2xl hover:scale-105 transition-all">
                            <Plus className="mr-3 h-6 w-6" />
                            ADD CATEGORY
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px] glass-morphism border-white/10 p-8">
                        <DialogHeader>
                            <DialogTitle className="text-3xl font-black font-outfit uppercase tracking-tighter">New Category</DialogTitle>
                            <DialogDescription className="text-muted-foreground italic">Add a new category to your book collection.</DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleCreate} className="space-y-6 pt-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-4">Category Name</label>
                                <Input
                                    placeholder="e.g. Cyberpunk, Space Opera..."
                                    className="h-14 rounded-2xl border-white/10 glass-morphism shadow-inner"
                                    value={newCategoryName}
                                    onChange={(e) => setNewCategoryName(e.target.value)}
                                />
                            </div>
                            <Button className="w-full h-14 rounded-full font-black uppercase tracking-widest shadow-xl" disabled={createMutation.isPending}>
                                {createMutation.isPending ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        SAVING...
                                    </>
                                ) : (
                                    "SAVE"
                                )}
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </header>

            <div className="bg-card glass-morphism rounded-[2.5rem] border border-white/10 shadow-3xl overflow-hidden ring-1 ring-black/5">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent border-white/10 h-20">
                            <TableHead className="px-8 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Category Name</TableHead>
                            <TableHead className="px-8 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Book Count</TableHead>
                            <TableHead className="px-8 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Last Updated</TableHead>
                            <TableHead className="px-8 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            [1, 2, 3].map(i => (
                                <TableRow key={i} className="animate-pulse h-24 border-white/5">
                                    <TableCell className="px-8"><div className="h-4 w-48 bg-muted rounded" /></TableCell>
                                    <TableCell className="px-8"><div className="h-4 w-24 bg-muted rounded" /></TableCell>
                                    <TableCell className="px-8"><div className="h-4 w-32 bg-muted rounded" /></TableCell>
                                    <TableCell className="px-8"><div className="h-4 w-16 bg-muted rounded float-right" /></TableCell>
                                </TableRow>
                            ))
                        ) : categories.map((cat) => (
                            <TableRow key={cat.id} className="group hover:bg-primary/5 transition-colors h-24 border-white/5">
                                <TableCell className="px-8 font-black font-outfit text-xl uppercase tracking-tight">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-primary/10 p-2 rounded-lg">
                                            <Tags className="h-5 w-5 text-primary" />
                                        </div>
                                        {cat.name}
                                    </div>
                                </TableCell>
                                <TableCell className="px-8 font-black tabular-nums text-muted-foreground">
                                    {cat.bookCount} Books
                                </TableCell>
                                <TableCell className="px-8 font-bold text-sm text-muted-foreground">
                                    {format(new Date(cat.updatedAt), "PPP")}
                                </TableCell>
                                <TableCell className="px-8 text-right">
                                    <div className="flex items-center justify-end gap-2 text-white">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-12 w-12 rounded-xl hover:bg-primary hover:text-white transition-all"
                                            onClick={() => {
                                                setEditingCategory({ id: cat.id, name: cat.name });
                                                setEditCategoryName(cat.name);
                                                setIsEditDialogOpen(true);
                                            }}
                                        >
                                            <Edit className="h-5 w-5" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-12 w-12 rounded-xl hover:bg-destructive/10 text-destructive hover:bg-destructive hover:text-white transition-all"
                                            onClick={() => {
                                                if (confirm(`Are you sure you want to delete category "${cat.name}"? This will affect all books in this category.`)) {
                                                    deleteMutation.mutate(cat.id);
                                                }
                                            }}
                                            disabled={deleteMutation.isPending}
                                        >
                                            {deleteMutation.isPending && deleteMutation.variables === cat.id ? (
                                                <Loader2 className="h-5 w-5 animate-spin" />
                                            ) : (
                                                <Trash2 className="h-5 w-5" />
                                            )}
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
                    BROWSE ALL CATEGORIES
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
            </div>

            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="sm:max-w-[425px] glass-morphism border-white/10 p-8">
                    <DialogHeader>
                        <DialogTitle className="text-3xl font-black font-outfit uppercase tracking-tighter">Edit Category</DialogTitle>
                        <DialogDescription className="text-muted-foreground italic">Update category details.</DialogDescription>
                    </DialogHeader>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            if (editingCategory && editCategoryName.trim() && editCategoryName !== editingCategory.name) {
                                updateMutation.mutate({ id: editingCategory.id, name: editCategoryName });
                            }
                        }}
                        className="space-y-6 pt-4"
                    >
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-4">Category Name</label>
                            <Input
                                placeholder="Update name..."
                                className="h-14 rounded-2xl border-white/10 glass-morphism shadow-inner"
                                value={editCategoryName}
                                onChange={(e) => setEditCategoryName(e.target.value)}
                            />
                        </div>
                        <Button className="w-full h-14 rounded-full font-black uppercase tracking-widest shadow-xl" disabled={updateMutation.isPending}>
                            {updateMutation.isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    SAVING...
                                </>
                            ) : (
                                "SAVE CHANGES"
                            )}
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
