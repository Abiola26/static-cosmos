"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookMarked, Sparkles, BookOpen, ShieldCheck } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { booksApi } from "@/features/books/books-api";
import { BookGrid } from "@/features/books/BookGrid";

export default function HomePage() {
  const { data: booksData, isLoading } = useQuery({
    queryKey: ["featured-books"],
    queryFn: () => booksApi.getBooks(1, 4), // Get first 4 books
  });

  const books = (booksData?.success && booksData.data && "items" in booksData.data)
    ? booksData.data.items
    : [];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-background pt-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(var(--primary-rgb),0.2),transparent_50%)]" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        <div className="container mx-auto px-4 relative z-10 text-center space-y-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 px-6 py-2 rounded-full border border-primary/20 animate-in fade-in slide-in-from-top-4 duration-1000">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-xs font-black uppercase tracking-widest text-primary">The Future of Reading is Here</span>
          </div>

          <h1 className="text-7xl md:text-9xl font-black font-outfit tracking-tighter uppercase leading-[0.8] animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
            Static<br />
            <span className="text-primary italic">Cosmos</span>
          </h1>

          <p className="max-w-2xl mx-auto text-xl md:text-2xl text-muted-foreground font-medium leading-relaxed animate-in fade-in duration-1000 delay-500">
            Dive into a universe of knowledge. Curated collections, seamless experience, and instant delivery. Your journey starts with a single page.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-700">
            <Button asChild className="h-16 px-10 rounded-full text-lg font-black bg-primary shadow-2xl hover:scale-105 transition-all group">
              <Link href="/books">
                EXPLORE LIBRARY
                <ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button asChild variant="ghost" className="h-16 px-10 rounded-full text-lg font-black hover:bg-primary/5 group">
              <Link href="/auth/register">
                JOIN NOW
              </Link>
            </Button>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute left-10 top-1/4 animate-pulse opacity-20 hidden lg:block">
          <BookMarked className="h-24 w-24 text-primary" />
        </div>
        <div className="absolute right-10 bottom-1/4 animate-bounce opacity-20 hidden lg:block">
          <BookOpen className="h-24 w-24 text-primary" />
        </div>
      </section>

      {/* Featured Books Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-4 space-y-12">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6">
            <div className="space-y-4">
              <h2 className="text-5xl md:text-7xl font-black font-outfit tracking-tighter uppercase leading-none">
                Featured<br />
                <span className="text-primary italic">Collections</span>
              </h2>
              <p className="text-xl text-muted-foreground font-medium max-w-md">
                Hand-picked masterpieces from our global library, chosen for their profound impact and exceptional quality.
              </p>
            </div>
            <Button asChild variant="outline" className="rounded-full h-14 px-8 border-2 font-black group">
              <Link href="/books">
                VIEW ALL BOOKS
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>

          <BookGrid books={books} isLoading={isLoading} />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-muted/20">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-4 p-8 rounded-3xl bg-card border border-white/10 shadow-xl group hover:-translate-y-2 transition-transform">
            <div className="h-12 w-12 bg-primary rounded-xl flex items-center justify-center text-white ring-8 ring-primary/10">
              <ShieldCheck />
            </div>
            <h3 className="text-2xl font-black font-outfit">Verified Quality</h3>
            <p className="text-muted-foreground font-medium">Every book in our collection passes a rigorous curation process for maximum value.</p>
          </div>
          <div className="space-y-4 p-8 rounded-3xl bg-card border border-white/10 shadow-xl group hover:-translate-y-2 transition-transform md:translate-y-6">
            <div className="h-12 w-12 bg-primary rounded-xl flex items-center justify-center text-white ring-8 ring-primary/10">
              <Sparkles />
            </div>
            <h3 className="text-2xl font-black font-outfit">Instant Access</h3>
            <p className="text-muted-foreground font-medium">No waiting. Start reading your digital acquisitions immediately after checkout.</p>
          </div>
          <div className="space-y-4 p-8 rounded-3xl bg-card border border-white/10 shadow-xl group hover:-translate-y-2 transition-transform">
            <div className="h-12 w-12 bg-primary rounded-xl flex items-center justify-center text-white ring-8 ring-primary/10">
              <ArrowRight />
            </div>
            <h3 className="text-2xl font-black font-outfit">Global Network</h3>
            <p className="text-muted-foreground font-medium">Connect with readers and authors in our exclusive community-driven ecosystem.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

