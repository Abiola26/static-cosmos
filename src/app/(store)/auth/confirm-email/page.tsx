'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';
import api from '@/lib/api';
import Link from 'next/link';

function ConfirmEmailContent() {
    const searchParams = useSearchParams();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('Confirming your email address...');

    useEffect(() => {
        const userId = searchParams.get('userId');
        const token = searchParams.get('token');

        if (!userId || !token) {
            setStatus('error');
            setMessage('Invalid confirmation link. Please check your email.');
            return;
        }

        const confirmEmail = async () => {
            try {
                const response = await api.get(`/Email/confirm?userId=${userId}&token=${encodeURIComponent(token)}`);

                if (response.data.success) {
                    setStatus('success');
                    setMessage('Your email has been successfully confirmed!');
                } else {
                    setStatus('error');
                    setMessage(response.data.message || 'Confirmation failed.');
                }
            } catch (error: any) {
                const apiMessage = error.response?.data?.message;
                setStatus('error');
                setMessage(apiMessage || 'An error occurred during verification.');
            }
        };

        confirmEmail();
    }, [searchParams]);

    return (
        <Card className="w-full max-w-md shadow-2xl border-t-4 border-primary">
            <CardHeader className="text-center space-y-2">
                <div className="flex justify-center mb-2">
                    {status === 'loading' && <Loader2 className="h-12 w-12 text-primary animate-spin" />}
                    {status === 'success' && <CheckCircle2 className="h-12 w-12 text-green-500" />}
                    {status === 'error' && <XCircle className="h-12 w-12 text-destructive" />}
                </div>
                <CardTitle className="text-2xl font-bold font-outfit">
                    {status === 'loading' && 'Verifying Email'}
                    {status === 'success' && 'Email Confirmed!'}
                    {status === 'error' && 'Verification Failed'}
                </CardTitle>
                <CardDescription>
                    {message}
                </CardDescription>
            </CardHeader>
            <CardContent>
                {status === 'success' && (
                    <Button asChild className="w-full h-11 text-base font-semibold">
                        <Link href="/auth/login">Sign In</Link>
                    </Button>
                )}
                {status === 'error' && (
                    <Button asChild variant="outline" className="w-full">
                        <Link href="/auth/login">Back to Login</Link>
                    </Button>
                )}
            </CardContent>
        </Card>
    );
}

export default function ConfirmEmailPage() {
    return (
        <div className="flex min-h-[calc(100vh-12rem)] items-center justify-center p-4">
            <Suspense fallback={<Loader2 className="h-12 w-12 animate-spin" />}>
                <ConfirmEmailContent />
            </Suspense>
        </div>
    );
}
