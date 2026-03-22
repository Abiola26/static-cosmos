import { BookResponseDto } from "@/types";
import { BookCard } from "./BookCard";
import { BookCardSkeleton } from "./BookCardSkeleton";

interface BookGridProps {
    books: BookResponseDto[];
    isLoading?: boolean;
}

export function BookGrid({ books, isLoading }: BookGridProps) {
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                    <BookCardSkeleton key={i} />
                ))}
            </div>
        );
    }

    if (books.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="bg-muted rounded-full p-6 mb-4">
                    <span className="text-4xl text-muted-foreground">📚</span>
                </div>
                <h3 className="text-xl font-bold font-outfit">No books found</h3>
                <p className="text-muted-foreground">Try adjusting your filters or search query.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in duration-500">
            {books.map((book, index) => (
                <BookCard key={book.id} book={book} priority={index < 4} />
            ))}
        </div>
    );
}
