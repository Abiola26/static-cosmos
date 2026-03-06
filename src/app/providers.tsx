'use client';

import { useEffect } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { SessionProvider, useSession } from 'next-auth/react';
import { queryClient } from '@/lib/query-client';
import { Toaster } from '@/components/ui/sonner';

function TokenSync({ children }: { children: React.ReactNode }) {
    const { data: session } = useSession();

    useEffect(() => {
        if (session?.accessToken) {
            localStorage.setItem('token', session.accessToken as string);
        } else if (session === null) {
            localStorage.removeItem('token');
        }
    }, [session]);

    return <>{children}</>;
}

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <TokenSync>
                <QueryClientProvider client={queryClient}>
                    {children}
                    <Toaster position="top-center" richColors />
                    <ReactQueryDevtools initialIsOpen={false} />
                </QueryClientProvider>
            </TokenSync>
        </SessionProvider>
    );
}

