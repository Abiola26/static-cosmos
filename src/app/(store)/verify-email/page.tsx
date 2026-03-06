'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';
import api from '@/lib/api';
import Link from 'next/link';

function VerifyEmailContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('Verifying your email address...');

    useEffect(() => {
        const userId = searchParams.get('userId');
        const token = searchParams.get('token');

        if (!userId || !token) {
            setStatus('error');
            setMessage('Invalid verification link. Please request a new one.');
            return;
        }

        const verifyEmail = async () => {
            try {
                // Call the JSON endpoint (no redirect) so we can read the response directly
                const response = await api.get(
                    `/Email/confirm-json?userId=${encodeURIComponent(userId)}&token=${encodeURIComponent(token)}`
                );

                if (response.data?.success) {
                    setStatus('success');
                    setMessage('Your email has been successfully verified! You can now sign in.');
                    // Auto-redirect to login after a short delay
                    setTimeout(() => router.push('/auth/login?confirmed=true'), 2500);
                } else {
                    setStatus('error');
                    setMessage(response.data?.message || 'Verification failed. The link may have expired.');
                }
            } catch (error: any) {
                console.error('Verification error:', error);
                const apiMessage = error.response?.data?.message;
                setStatus('error');
                setMessage(apiMessage || 'An error occurred during verification. Please try again.');
            }
        };

        verifyEmail();
    }, [searchParams, router]);

    return (
        <Card className="w-full max-w-md shadow-2xl border-t-4 border-primary">
            <CardHeader className="text-center space-y-2">
                <div className="flex justify-center mb-2">
                    {status === 'loading' && <Loader2 className="h-12 w-12 text-primary animate-spin" />}
                    {status === 'success' && <CheckCircle2 className="h-12 w-12 text-green-500" />}
                    {status === 'error' && <XCircle className="h-12 w-12 text-destructive" />}
                </div>
                <CardTitle className="text-2xl font-bold font-outfit">
                    {status === 'loading' && 'Verifying Your Account'}
                    {status === 'success' && 'Account Verified!'}
                    {status === 'error' && 'Verification Error'}
                </CardTitle>
                <CardDescription className="text-base text-muted-foreground">
                    {message}
                </CardDescription>
                {status === 'success' && (
                    <p className="text-sm text-muted-foreground animate-pulse">
                        Redirecting you to sign in...
                    </p>
                )}
            </CardHeader>
            <CardContent className="pt-6">
                {status === 'success' && (
                    <Button
                        asChild
                        className="w-full h-11 text-base font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform"
                    >
                        <Link href="/auth/login">Sign In to Your Account</Link>
                    </Button>
                )}
                {status === 'error' && (
                    <div className="flex flex-col gap-3">
                        <Button asChild className="w-full h-11">
                            <Link href="/auth/login">Back to Login</Link>
                        </Button>
                        <Button asChild variant="outline" className="w-full h-11 text-muted-foreground">
                            <Link href="/auth/register">Create a New Account</Link>
                        </Button>
                    </div>
                )}
                {status === 'loading' && (
                    <div className="w-full h-2 bg-secondary/30 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-primary animate-progress-loading"
                            style={{ width: '40%' }}
                        />
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

export default function VerifyEmailPage() {
    return (
        <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center p-4">
            <Suspense
                fallback={
                    <Card className="w-full max-w-md">
                        <CardHeader className="text-center">
                            <Loader2 className="h-10 w-10 text-primary animate-spin mx-auto mb-4" />
                            <CardTitle>Loading...</CardTitle>
                        </CardHeader>
                    </Card>
                }
            >
                <VerifyEmailContent />
            </Suspense>
        </div>
    );
}
