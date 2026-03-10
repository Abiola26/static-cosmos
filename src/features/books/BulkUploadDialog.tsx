"use client";

import { useState, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { booksApi } from "./books-api";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload, FileText, CheckCircle2, AlertCircle, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function BulkUploadDialog() {
    const [file, setFile] = useState<File | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const queryClient = useQueryClient();

    const uploadMutation = useMutation({
        mutationFn: (file: File) => booksApi.bulkUpload(file),
        onSuccess: (response) => {
            if (response.success) {
                toast.success("Bulk upload completed successfully!");
                queryClient.invalidateQueries({ queryKey: ["admin-books"] });
                queryClient.invalidateQueries({ queryKey: ["categories"] });
                setIsOpen(false);
                setFile(null);
            } else {
                toast.error(response.message || "Bulk upload failed.");
            }
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "An error occurred during upload.");
        }
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            if (selectedFile.type !== "text/csv" && !selectedFile.name.endsWith(".csv")) {
                toast.error("Please upload a CSV file.");
                return;
            }
            setFile(selectedFile);
        }
    };

    const handleUpload = () => {
        if (file) {
            uploadMutation.mutate(file);
        }
    };

    const clearFile = () => {
        setFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="rounded-full h-16 px-10 text-lg font-black border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all">
                    <Upload className="mr-3 h-6 w-6" />
                    IMPORT BOOKS
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] glass-morphism border-white/10 p-0 overflow-hidden">
                <div className="p-8 space-y-8">
                    <DialogHeader>
                        <DialogTitle className="text-4xl font-black font-outfit uppercase tracking-tighter">Bulk Upload</DialogTitle>
                        <DialogDescription className="text-muted-foreground">
                            Upload a CSV file containing multiple book records.
                        </DialogDescription>
                    </DialogHeader>

                    <div
                        className={cn(
                            "relative border-2 border-dashed rounded-[2rem] p-12 transition-all flex flex-col items-center justify-center gap-4 cursor-pointer group",
                            file ? "border-primary bg-primary/5" : "border-white/20 hover:border-primary/50 hover:bg-primary/5"
                        )}
                        onClick={() => !file && fileInputRef.current?.click()}
                    >
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept=".csv"
                            onChange={handleFileChange}
                        />

                        {file ? (
                            <>
                                <div className="h-16 w-16 rounded-2xl bg-primary/20 flex items-center justify-center text-primary">
                                    <FileText className="h-8 w-8" />
                                </div>
                                <div className="text-center">
                                    <p className="font-black truncate max-w-[250px]">{file.name}</p>
                                    <p className="text-sm text-muted-foreground">{(file.size / 1024).toFixed(2)} KB</p>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute top-4 right-4 rounded-full h-10 w-10 hover:bg-destructive hover:text-white transition-all"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        clearFile();
                                    }}
                                >
                                    <X className="h-5 w-5" />
                                </Button>
                            </>
                        ) : (
                            <>
                                <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                                    <Upload className="h-8 w-8" />
                                </div>
                                <div className="text-center">
                                    <p className="font-black uppercase tracking-tight">Drop CSV file here</p>
                                    <p className="text-sm text-muted-foreground">or click to browse (CSV only)</p>
                                </div>
                            </>
                        )}
                    </div>

                    <div className="bg-muted/30 p-4 rounded-2xl flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <div className="text-xs space-y-1">
                            <p className="font-bold uppercase tracking-wider text-[10px]">Expected Columns:</p>
                            <p className="text-muted-foreground italic">Title, Author, ISBN, Price, Currency, Quantity, Description, CategoryId</p>
                        </div>
                    </div>

                    <Button
                        className="w-full h-16 rounded-full font-black text-lg gap-3"
                        disabled={!file || uploadMutation.isPending}
                        onClick={handleUpload}
                    >
                        {uploadMutation.isPending ? (
                            <>
                                <Loader2 className="h-6 w-6 animate-spin" />
                                UPLOADING...
                            </>
                        ) : (
                            <>
                                <CheckCircle2 className="h-6 w-6" />
                                IMPORT BOOKS
                            </>
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
