import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { BookResponseDto } from '@/types';

interface WishlistStore {
    items: BookResponseDto[];
    toggleItem: (book: BookResponseDto) => void;
    removeItem: (bookId: string) => void;
    isInWishlist: (bookId: string) => boolean;
    clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistStore>()(
    persist(
        (set, get) => ({
            items: [],

            toggleItem: (book) => {
                const currentItems = get().items;
                const exists = currentItems.some((item) => item.id === book.id);

                if (exists) {
                    set({
                        items: currentItems.filter((item) => item.id !== book.id),
                    });
                } else {
                    set({
                        items: [...currentItems, book],
                    });
                }
            },

            removeItem: (bookId) => {
                set({
                    items: get().items.filter((item) => item.id !== bookId),
                });
            },

            isInWishlist: (bookId) => {
                return get().items.some((item) => item.id === bookId);
            },

            clearWishlist: () => set({ items: [] }),
        }),
        {
            name: 'bookstore-wishlist',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
