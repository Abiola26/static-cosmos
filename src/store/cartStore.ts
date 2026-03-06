import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { ShoppingCartItemResponseDto, BookResponseDto } from '@/types';

interface CartItem extends Omit<ShoppingCartItemResponseDto, 'id'> {
    // We use bookId as the unique identifier for client-side cart
}

interface CartStore {
    items: CartItem[];
    addItem: (book: BookResponseDto, quantity?: number) => void;
    removeItem: (bookId: string) => void;
    updateQuantity: (bookId: string, quantity: number) => void;
    clearCart: () => void;
    totalItems: () => number;
    totalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],

            addItem: (book, quantity = 1) => {
                const currentItems = get().items;
                const existingItem = currentItems.find((item) => item.bookId === book.id);

                if (existingItem) {
                    set({
                        items: currentItems.map((item) =>
                            item.bookId === book.id
                                ? { ...item, quantity: item.quantity + quantity }
                                : item
                        ),
                    });
                } else {
                    set({
                        items: [
                            ...currentItems,
                            {
                                bookId: book.id,
                                bookTitle: book.title,
                                isbn: book.isbn,
                                quantity,
                                unitPrice: book.price,
                                currency: book.currency,
                                subTotal: book.price * quantity,
                            },
                        ],
                    });
                }
            },

            removeItem: (bookId) => {
                set({
                    items: get().items.filter((item) => item.bookId !== bookId),
                });
            },

            updateQuantity: (bookId, quantity) => {
                if (quantity <= 0) {
                    get().removeItem(bookId);
                    return;
                }

                set({
                    items: get().items.map((item) =>
                        item.bookId === bookId
                            ? { ...item, quantity, subTotal: item.unitPrice * quantity }
                            : item
                    ),
                });
            },

            clearCart: () => set({ items: [] }),

            totalItems: () => get().items.reduce((sum, item) => sum + item.quantity, 0),

            totalPrice: () => get().items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
        }),
        {
            name: 'bookstore-cart',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
