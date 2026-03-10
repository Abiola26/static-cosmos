'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, MailCheck } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';

function ConfirmEmailContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const userId = searchParams.get('userId');
    const [otp, setOtp] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userId) {
            toast.error('Invalid link. Missing user ID.');
            return;
        }

        if (otp.length !== 6) {
            toast.error('Please enter a valid 6-digit code.');
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await api.post('/Email/confirm-otp', {
                userId,
                token: otp
            });

            if (response.data.success) {
                toast.success('Your email has been successfully confirmed!');
                router.push('/auth/login?confirmed=true');
            } else {
                toast.error(response.data.message || 'Confirmation failed.');
            }
        } catch (error: any) {
            const apiMessage = error.response?.data?.message;
            toast.error(apiMessage || 'An error occurred during verification. Or the code is invalid.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Card className="w-full max-w-md shadow-2xl border-t-4 border-primary">
            <CardHeader className="text-center space-y-2">
                <div className="flex justify-center mb-2">
                    <MailCheck className="h-12 w-12 text-primary" />
                </div>
                <CardTitle className="text-2xl font-bold font-outfit">
                    Confirm your Email
                </CardTitle>
                <CardDescription>
                    We've sent a 6-digit confirmation code to your email. Please enter it below.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Input
                            placeholder="Enter 6-digit code"
                            className="h-14 text-center text-2xl tracking-[0.5em] font-black font-outfit"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                            maxLength={6}
                        />
                    </div>
                    <Button type="submit" disabled={isSubmitting || otp.length !== 6} className="w-full h-11 text-base font-semibold">
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Verifying...
                            </>
                        ) : (
                            'Verify'
                        )}
                    </Button>
                </form>
            </CardContent>
            <CardFooter className="flex justify-center">
                <p className="text-sm text-muted-foreground text-center">
                    Didn't receive the email? Check your spam folder.
                </p>
            </CardFooter>
        </Card>
    );
}

export default function ConfirmEmailPage() {
    return (
        <div className="flex min-h-[calc(100vh-12rem)] items-center justify-center p-4">
            <Suspense fallback={<Loader2 className="h-12 w-12 animate-spin text-primary" />}>
                <ConfirmEmailContent />
            </Suspense>
        </div>
    );
}
