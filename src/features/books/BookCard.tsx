import Link from "next/link";
import Image from "next/image";
import { BookResponseDto } from "@/types";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, ShoppingCart, Heart, Eye } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { WishlistButton } from "@/features/wishlist/WishlistButton";
import { toast } from "sonner";
import { useState } from "react";
import { formatPrice, cn } from "@/lib/utils";

interface BookCardProps {
    book: BookResponseDto;
}

export function BookCard({ book }: BookCardProps) {
    const addItem = useCartStore((state) => state.addItem);
    const [imgError, setImgError] = useState(false);

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        addItem(book);
        toast.success(`${book.title} added to cart!`);
    };

    const isValidUrl = (url: string | null | undefined) => {
        if (!url || url === "string") return false;
        try {
            return url.startsWith("http") || url.startsWith("/");
        } catch {
            return false;
        }
    };



    return (
        <Card className="group overflow-hidden transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.2)] border-none bg-card/50 backdrop-blur-md ring-1 ring-white/10 h-full flex flex-col">
            <CardHeader className="p-0 relative aspect-[3/4] overflow-hidden">
                {isValidUrl(book.coverImageUrl) && !imgError ? (
                    <Image
                        src={book.coverImageUrl!}
                        alt={book.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        onError={() => setImgError(true)}
                    />
                ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                        <span className="text-muted-foreground font-medium">No Cover</span>
                    </div>
                )}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute top-3 right-3 opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 flex flex-col gap-2">
                    <WishlistButton book={book} />
                    <Button asChild size="icon" variant="secondary" className="rounded-full shadow-lg backdrop-blur-md bg-white/80 border-none hover:bg-primary hover:text-white transition-all">
                        <Link href={`/books/${book.id}`}>
                            <Eye className="h-4 w-4" />
                        </Link>
                    </Button>
                </div>
                <Badge className="absolute top-3 left-3 bg-primary/90 hover:bg-primary backdrop-blur-md border-none px-3 py-1 text-[10px] font-black uppercase tracking-widest">
                    {book.categoryName}
                </Badge>
            </CardHeader>
            <CardContent className="p-5 space-y-3 flex-1">
                <div className="space-y-1">
                    <h3 className="font-black font-outfit text-xl line-clamp-1 leading-tight group-hover:text-primary transition-colors">
                        {book.title}
                    </h3>
                    <p className="text-sm font-bold text-muted-foreground">{book.author}</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center bg-yellow-400/10 px-2 py-0.5 rounded-full border border-yellow-400/20">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-[10px] font-black ml-1 text-yellow-700">
                            {book.averageRating.toFixed(1)}
                        </span>
                    </div>
                    <span className="text-[10px] uppercase font-black tracking-widest text-muted-foreground/60">{book.reviewCount} Reviews</span>
                </div>
            </CardContent>
            <CardFooter className="p-5 pt-0 flex justify-between items-center">
                <div className="flex flex-col">
                    <span className="font-black text-2xl font-outfit tracking-tighter text-primary">
                        {formatPrice(book.price, book.currency)}
                    </span>
                </div>
                <Button
                    size="sm"
                    onClick={handleAddToCart}
                    disabled={book.totalQuantity <= 0}
                    className={cn(
                        "rounded-full font-black px-5 shadow-lg transition-all active:scale-95",
                        book.totalQuantity > 0
                            ? "bg-primary hover:bg-primary/90 shadow-primary/20"
                            : "bg-muted text-muted-foreground cursor-not-allowed"
                    )}
                >
                    {book.totalQuantity > 0 ? (
                        <>
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            ADD
                        </>
                    ) : (
                        "OUT OF STOCK"
                    )}
                </Button>
            </CardFooter>
        </Card>
    );
}
