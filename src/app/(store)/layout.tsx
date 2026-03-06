import { Header } from '@/components/shared/Header';

export default function StoreLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="relative flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <footer className="border-t border-white/10 bg-muted/30 py-12">
                <div className="container mx-auto px-4 text-center">
                    <p className="font-outfit font-black text-2xl tracking-tighter uppercase mb-2">StaticCosmos</p>
                    <p className="text-sm text-muted-foreground font-medium">© 2026 StaticCosmos Bookstore. Built with excellence.</p>
                </div>
            </footer>
        </div>
    );
}
