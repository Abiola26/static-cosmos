"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, ImageIcon, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { booksApi } from "./books-api";
import { BookResponseDto } from "@/types";

const bookSchema = z.object({
    title: z.string().min(1, "Title is required"),
    author: z.string().min(1, "Author is required"),
    isbn: z.string().min(1, "ISBN is required"),
    price: z.coerce.number().min(0, "Price must be positive"),
    currency: z.string().default("USD"),
    totalQuantity: z.coerce.number().int().min(0, "Quantity must be positive"),
    pages: z.coerce.number().int().min(1, "Pages must be at least 1"),
    categoryId: z.string().min(1, "Category is required"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    publisher: z.string().optional(),
    publicationDate: z.string().optional(),
    language: z.string().optional(),
});

type BookFormValues = z.infer<typeof bookSchema>;

interface BookFormProps {
    book?: BookResponseDto;
    onSuccess?: () => void;
}

export function BookForm({ book, onSuccess }: BookFormProps) {
    const isEdit = !!book;
    const queryClient = useQueryClient();
    const [coverFile, setCoverFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(book?.coverImageUrl || null);

    const { data: categoriesResponse } = useQuery({
        queryKey: ["categories"],
        queryFn: () => booksApi.getCategories(),
    });

    const form = useForm<BookFormValues>({
        resolver: zodResolver(bookSchema) as any,
        defaultValues: {
            title: book?.title || "",
            author: book?.author || "",
            isbn: book?.isbn || "",
            price: book?.price || 0,
            currency: book?.currency || "USD",
            totalQuantity: book?.totalQuantity || 0,
            pages: book?.pages || 0,
            categoryId: book?.categoryId || "",
            description: book?.description || "",
            publisher: book?.publisher || "",
            publicationDate: book?.publicationDate ? new Date(book.publicationDate).toISOString().split('T')[0] : "",
            language: book?.language || "English",
        },
    });

    const mutation = useMutation({
        mutationFn: async (values: BookFormValues) => {
            if (isEdit && book) {
                const response = await booksApi.updateBook(book.id, values);
                if (response.success && coverFile) {
                    await booksApi.uploadCover(book.id, coverFile);
                }
                return response;
            } else {
                const response = await booksApi.createBook(values);
                if (response.success && response.data && coverFile) {
                    await booksApi.uploadCover(response.data.id, coverFile);
                }
                return response;
            }
        },
        onSuccess: (response) => {
            if (response.success) {
                toast.success(isEdit ? "Book updated successfully." : "Book added successfully.");
                queryClient.invalidateQueries({ queryKey: ["books"] });
                queryClient.invalidateQueries({ queryKey: ["admin-books"] });
                queryClient.invalidateQueries({ queryKey: ["categories"] });
                onSuccess?.();
            } else {
                toast.error(response.message || "Failed to save book.");
            }
        },
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setCoverFile(file);
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit((values) => mutation.mutate(values))} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-6">
                        <div className="relative group aspect-[3/4] rounded-2xl overflow-hidden bg-muted/30 border-2 border-dashed border-white/10 hover:border-primary/50 transition-all">
                            {previewUrl && previewUrl !== "string" && previewUrl.length > 0 ? (
                                <img
                                    src={previewUrl}
                                    alt="Cover Preview"
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    onError={() => setPreviewUrl(null)}
                                />
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-4">
                                    <ImageIcon className="h-16 w-16 opacity-20" />
                                    <p className="text-sm font-medium">COVER IMAGE REQUIRED</p>
                                </div>
                            )}
                            <label className="absolute inset-0 cursor-pointer flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="flex flex-col items-center gap-2 text-white">
                                    <Upload className="h-8 w-8" />
                                    <span className="text-xs font-bold uppercase tracking-widest">Upload Cover</span>
                                </div>
                                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                            </label>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control as any}
                                name="price"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs font-bold text-muted-foreground uppercase tracking-widest">PRICE</FormLabel>
                                        <FormControl>
                                            <Input type="number" placeholder="0.00" {...field} className="bg-white/5 border-white/10 h-12 rounded-xl" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control as any}
                                name="currency"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs font-bold text-muted-foreground uppercase tracking-widest">CURRENCY</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="bg-white/5 border-white/10 h-12 rounded-xl">
                                                    <SelectValue placeholder="SELECT" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="bg-background/95 border-white/10 backdrop-blur-xl">
                                                <SelectItem value="USD">USD ($)</SelectItem>
                                                <SelectItem value="EUR">EUR (€)</SelectItem>
                                                <SelectItem value="GBP">GBP (£)</SelectItem>
                                                <SelectItem value="JPY">JPY (¥)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control as any}
                            name="isbn"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs font-bold text-muted-foreground uppercase tracking-widest">ISBN</FormLabel>
                                    <FormControl>
                                        <Input placeholder="978-..." {...field} className="bg-white/5 border-white/10 h-12 rounded-xl" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        <FormField
                            control={form.control as any}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs font-bold text-muted-foreground uppercase tracking-widest">TITLE</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Book Title" {...field} className="bg-white/5 border-white/10 h-12 rounded-xl text-lg font-bold" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control as any}
                            name="author"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs font-bold text-muted-foreground uppercase tracking-widest">AUTHOR</FormLabel>
                                    <FormControl>
                                        <Input placeholder="AUTHOR NAME" {...field} className="bg-white/5 border-white/10 h-12 rounded-xl" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control as any}
                            name="categoryId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs font-bold text-muted-foreground uppercase tracking-widest">CATEGORY</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="bg-white/5 border-white/10 h-12 rounded-xl">
                                                <SelectValue placeholder="SELECT CATEGORY" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="bg-background/95 border-white/10 backdrop-blur-xl">
                                            {categoriesResponse?.data?.map((cat) => (
                                                <SelectItem key={cat.id} value={cat.id}>
                                                    {cat.name.toUpperCase()}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control as any}
                                name="totalQuantity"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs font-bold text-muted-foreground uppercase tracking-widest">QUANTITY</FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field} className="bg-white/5 border-white/10 h-12 rounded-xl" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control as any}
                                name="pages"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs font-bold text-muted-foreground uppercase tracking-widest">PAGES</FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field} className="bg-white/5 border-white/10 h-12 rounded-xl" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control as any}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs font-bold text-muted-foreground uppercase tracking-widest">DESCRIPTION</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="..." {...field} className="bg-white/5 border-white/10 min-h-[100px] rounded-xl resize-none" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control as any}
                                name="publisher"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs font-bold text-muted-foreground uppercase tracking-widest">PUBLISHER</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g., Penguin Random House" {...field} className="bg-white/5 border-white/10 h-12 rounded-xl text-sm" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control as any}
                                name="publicationDate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs font-bold text-muted-foreground uppercase tracking-widest">PUBLICATION DATE</FormLabel>
                                        <FormControl>
                                            <Input type="date" {...field} className="bg-white/5 border-white/10 h-12 rounded-xl text-sm" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control as any}
                            name="language"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs font-bold text-muted-foreground uppercase tracking-widest">LANGUAGE</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="bg-white/5 border-white/10 h-12 rounded-xl">
                                                <SelectValue placeholder="SELECT LANGUAGE" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="bg-background/95 border-white/10 backdrop-blur-xl">
                                            <SelectItem value="English">ENGLISH</SelectItem>
                                            <SelectItem value="French">FRENCH</SelectItem>
                                            <SelectItem value="Spanish">SPANISH</SelectItem>
                                            <SelectItem value="German">GERMAN</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-4 pt-6 border-t border-white/10">
                    <Button
                        type="submit"
                        disabled={mutation.isPending}
                        className="bg-primary hover:bg-primary/90 text-white px-8 h-14 rounded-2xl text-sm font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95"
                    >
                        {mutation.isPending ? (
                            <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                SAVING...
                            </>
                        ) : (
                            isEdit ? "UPDATE BOOK" : "ADD BOOK"
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
