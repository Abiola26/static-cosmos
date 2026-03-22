import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function BookCardSkeleton() {
    return (
        <Card className="border-none bg-card/50 backdrop-blur-md ring-1 ring-white/10 h-full flex flex-col overflow-hidden">
            <CardHeader className="p-0 relative aspect-[3/4] overflow-hidden">
                <Skeleton className="h-full w-full rounded-none" />
                <div className="absolute top-3 left-3">
                    <Skeleton className="h-6 w-16 rounded-full" />
                </div>
            </CardHeader>
            <CardContent className="p-5 space-y-3 flex-1">
                <div className="space-y-2">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                </div>
                <div className="flex items-center gap-3">
                    <Skeleton className="h-4 w-12 rounded-full" />
                    <Skeleton className="h-3 w-20" />
                </div>
            </CardContent>
            <CardFooter className="p-5 pt-0 flex justify-between items-center">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-10 w-24 rounded-full" />
            </CardFooter>
        </Card>
    );
}
