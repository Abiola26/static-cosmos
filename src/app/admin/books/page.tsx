"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { booksApi } from "@/features/books/books-api";
import { BulkUploadDialog } from "@/features/books/BulkUploadDialog";
import { BookForm } from "@/features/books/BookForm";
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
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Plus,
    Edit,
    Trash2,
    MoreVertical,
    Image as ImageIcon,
    Search,
    Filter,
    ArrowRight,
    Loader2
} from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { BookResponseDto, PagedResult } from "@/types";
import { cn, formatPrice } from "@/lib/utils";

function BookCover({ src, alt }: { src: string | null | undefined, alt: string }) {
    const [error, setError] = useState(false);

    return (
        <div className="relative h-16 w-12 rounded-lg overflow-hidden border border-white/20 shadow-lg group-hover:scale-110 transition-transform">
            {src && src !== "string" && !error ? (
                <Image
                    src={src}
                    alt={alt}
                    fill
                    className="object-cover"
                    onError={() => setError(true)}
                />
            ) : (
                <div className="h-full w-full bg-muted flex items-center justify-center">
                    <ImageIcon className="h-4 w-4 text-muted-foreground" />
                </div>
            )}
        </div>
    );
}

export default function AdminBooksPage() {
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(1);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedBook, setSelectedBook] = useState<BookResponseDto | null>(null);

    const { data: booksData, isLoading } = useQuery({
        queryKey: ["admin-books", page, searchTerm],
        queryFn: async () => {
            if (searchTerm && searchTerm.length >= 3) {
                return await booksApi.searchBooks(searchTerm);
            }
            return await booksApi.getBooks(page);
        }
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => booksApi.deleteBook(id),
        onSuccess: (response) => {
            if (response.success) {
                toast.success("Book deleted successfully.");
            } else {
                toast.error(response.message || "Failed to delete book.");
            }
        },
        onError: (error: any) => {
            // If 404, it might already be deleted, which is technically what we wanted
            if (error.response?.status === 404) {
                toast.success("Book removed successfully.");
            } else {
                toast.error(error.response?.data?.message || "Error deleting book.");
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-books"] });
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            setIsDeleteDialogOpen(false);
            setSelectedBook(null);
        }
    });

    const books = Array.isArray(booksData?.data)
        ? booksData.data
        : (booksData?.data as any)?.items || [];

    const pagination = booksData?.success && booksData.data && !Array.isArray(booksData.data) && "totalPages" in booksData.data
        ? booksData.data as PagedResult<BookResponseDto>
        : null;

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="flex flex-col md:flex-row justify-between items-end gap-6 border-b-4 border-primary pb-8">
                <div className="space-y-2">
                    <h1 className="text-5xl lg:text-7xl font-black font-outfit tracking-tighter uppercase">Books</h1>
                    <p className="text-xl text-muted-foreground font-medium underline decoration-primary/30 underline-offset-8 decoration-2 italic">Update and manage your book collection.</p>
                </div>
                <div className="flex items-center gap-4">
                    <BulkUploadDialog />
                    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="rounded-full h-16 px-10 text-lg font-black bg-primary shadow-2xl hover:scale-105 transition-all">
                                <Plus className="mr-3 h-6 w-6" />
                                ADD NEW BOOK
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[800px] glass-morphism border-white/10 p-0 overflow-hidden">
                            <div className="p-8 space-y-8">
                                <DialogHeader>
                                    <DialogTitle className="text-4xl font-black font-outfit uppercase tracking-tighter">ADD BOOK</DialogTitle>
                                    <DialogDescription className="text-muted-foreground">Enter the details for the new book addition.</DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 max-h-[70vh] overflow-y-auto px-1">
                                    <BookForm onSuccess={() => setIsAddDialogOpen(false)} />
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </header>

            <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-muted/20 p-6 rounded-[2rem] border border-white/10 ring-1 ring-black/5">
                <div className="relative w-full md:w-96 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                        placeholder="Filter by title, author, or ISBN..."
                        className="pl-12 h-14 rounded-full border-2 border-transparent bg-white/50 focus:bg-white focus:border-primary transition-all shadow-inner"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-4">
                    <Button variant="outline" className="rounded-full h-14 px-6 border-2 font-bold gap-2">
                        <Filter className="h-4 w-4" />
                        Filters
                    </Button>
                    <div className="bg-white/50 px-6 py-4 rounded-full border border-white font-black text-sm uppercase tracking-widest text-primary">
                        Total Books: {books.length}
                    </div>
                </div>
            </div>

            <div className="bg-card glass-morphism rounded-[2.5rem] border border-white/10 shadow-3xl overflow-hidden ring-1 ring-black/5">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent border-white/10 h-20">
                            <TableHead className="px-8 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 w-[100px]">Cover</TableHead>
                            <TableHead className="px-8 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Category</TableHead>
                            <TableHead className="px-8 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 w-[120px]">Inventory</TableHead>
                            <TableHead className="px-8 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 text-right">Price</TableHead>
                            <TableHead className="px-8 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            [1, 2, 3, 4, 5].map(i => (
                                <TableRow key={i} className="animate-pulse h-28 border-white/5">
                                    <TableCell className="px-8"><div className="h-16 w-12 bg-muted rounded-lg" /></TableCell>
                                    <TableCell className="px-8"><div className="h-4 w-48 bg-muted rounded" /></TableCell>
                                    <TableCell className="px-8"><div className="h-4 w-24 bg-muted rounded" /></TableCell>
                                    <TableCell className="px-8"><div className="h-4 w-16 bg-muted rounded float-right" /></TableCell>
                                    <TableCell className="px-8"><div className="h-4 w-16 bg-muted rounded float-right" /></TableCell>
                                </TableRow>
                            ))
                        ) : books.length === 0 ? (
                            <TableRow className="h-64 border-white/5">
                                <TableCell colSpan={5} className="px-8 text-center pt-20 pb-20">
                                    <div className="flex flex-col items-center gap-4 text-muted-foreground">
                                        <Search className="h-16 w-16 opacity-10" />
                                        <div className="space-y-1">
                                            <p className="font-black font-outfit text-2xl uppercase tracking-tighter">No books found</p>
                                            <p className="italic">No books match your current search criteria.</p>
                                        </div>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : books.map((book: BookResponseDto) => (
                            <TableRow key={book.id} className="group hover:bg-primary/5 transition-colors h-28 border-white/5">
                                <TableCell className="px-8">
                                    <BookCover src={book.coverImageUrl} alt={book.title} />
                                </TableCell>
                                <TableCell className="px-8">
                                    <div className="space-y-1">
                                        <p className="font-black font-outfit uppercase tracking-tight line-clamp-1">{book.title}</p>
                                        <div className="flex items-center gap-2">
                                            <p className="text-xs font-bold text-muted-foreground">{book.author}</p>
                                            <span className="text-[10px] text-muted-foreground/30">•</span>
                                            <p className="text-[10px] font-black text-primary/40 leading-none">ISBN: {book.isbn}</p>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="px-8">
                                    <Badge variant="outline" className="rounded-full bg-primary/5 border-primary/20 text-primary font-black text-[10px] uppercase tracking-widest px-3 py-1">
                                        {book.categoryName}
                                    </Badge>
                                </TableCell>
                                <TableCell className="px-8 font-black tabular-nums whitespace-nowrap">
                                    <div className="flex items-center gap-3">
                                        {book.totalQuantity > 0 ? (
                                            <>
                                                <span className={cn(
                                                    "h-2 w-2 rounded-full",
                                                    book.totalQuantity > 10 ? "bg-green-500" : "bg-yellow-500 animate-pulse"
                                                )} />
                                                {book.totalQuantity} in stock
                                            </>
                                        ) : (
                                            <span className="text-destructive font-black uppercase tracking-tighter animate-pulse">
                                                OUT OF STOCK
                                            </span>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell className="px-8 text-right font-black font-outfit text-xl tracking-tighter text-primary">
                                    {formatPrice(book.price, book.currency)}
                                </TableCell>
                                <TableCell className="px-8 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-12 w-12 rounded-xl hover:bg-primary hover:text-white transition-all"
                                            onClick={() => {
                                                setSelectedBook(book);
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
                                                setSelectedBook(book);
                                                setIsDeleteDialogOpen(true);
                                            }}
                                            disabled={deleteMutation.isPending}
                                        >
                                            {deleteMutation.isPending && deleteMutation.variables === book.id ? (
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

            {
                pagination && pagination.hasNextPage && !searchTerm && (
                    <div className="flex justify-center">
                        <Button
                            variant="outline"
                            className="rounded-full h-16 px-12 border-4 font-black gap-3 group flex items-center hover:bg-primary hover:text-white transition-all shadow-xl"
                            onClick={() => setPage(p => p + 1)}
                        >
                            LOAD MORE
                            <ArrowRight className="h-6 w-6 group-hover:translate-x-2 transition-transform" />
                        </Button>
                    </div>
                )
            }

            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="sm:max-w-[800px] glass-morphism border-white/10 p-0 overflow-hidden">
                    <div className="p-8 space-y-8">
                        <DialogHeader>
                            <DialogTitle className="text-4xl font-black font-outfit uppercase tracking-tighter">EDIT BOOK</DialogTitle>
                            <DialogDescription className="text-muted-foreground italic font-medium">
                                Editing details for: <span className="text-primary font-black uppercase tracking-tight">{selectedBook?.title}</span>
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 max-h-[70vh] overflow-y-auto px-1">
                            {selectedBook && <BookForm book={selectedBook as BookResponseDto} onSuccess={() => setIsEditDialogOpen(false)} />}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent className="sm:max-w-[500px] glass-morphism border-white/10 p-0 overflow-hidden">
                    <div className="p-8 space-y-8">
                        <DialogHeader>
                            <DialogTitle className="text-4xl font-black font-outfit uppercase tracking-tighter text-destructive">Delete Confirmation</DialogTitle>
                            <DialogDescription asChild className="space-y-2 text-left">
                                <div>
                                    <p className="text-lg font-medium text-foreground">Are you absolutely sure you want to delete this book?</p>
                                    <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-2xl mt-2">
                                        <p className="font-black text-destructive uppercase tracking-tight">{selectedBook?.title}</p>
                                        <p className="text-xs text-destructive/70 font-bold">ISBN: {selectedBook?.isbn}</p>
                                    </div>
                                    <p className="text-sm text-muted-foreground italic mt-2">This action is irreversible and will permanently delete the book record.</p>
                                </div>
                            </DialogDescription>
                        </DialogHeader>
                        <div className="flex gap-4 pt-4 border-t border-white/10">
                            <Button
                                variant="outline"
                                className="flex-1 h-14 rounded-2xl font-black uppercase tracking-widest"
                                onClick={() => setIsDeleteDialogOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                className="flex-1 h-14 rounded-2xl font-black uppercase tracking-widest bg-destructive hover:bg-destructive/90 text-white"
                                onClick={() => selectedBook && deleteMutation.mutate(selectedBook.id)}
                                disabled={deleteMutation.isPending}
                            >
                                {deleteMutation.isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : "DELETE NOW"}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
