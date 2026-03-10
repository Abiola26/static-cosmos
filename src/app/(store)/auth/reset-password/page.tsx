'use client';

import { useState, useEffect, Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, ArrowLeft, KeyRound, CheckCircle2 } from 'lucide-react';

const resetPasswordSchema = z.object({
    email: z.string().email({ message: 'Invalid email address' }),
    token: z.string().length(6, { message: 'OTP must be exactly 6 digits' }),
    newPassword: z.string()
        .min(6, { message: 'Password must be at least 6 characters long' })
        .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
        .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
        .regex(/[0-9]/, { message: 'Password must contain at least one digit' })
        .regex(/[^A-Za-z0-9]/, { message: 'Password must contain at least one special character' }),
    confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const email = searchParams.get('email') || '';

    const form = useForm<ResetPasswordFormValues>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            email: email,
            token: '',
            newPassword: '',
            confirmPassword: '',
        },
    });

    useEffect(() => {
        if (email) {
            form.setValue('email', email);
        }
    }, [email, form]);

    async function onSubmit(values: ResetPasswordFormValues) {
        setIsLoading(true);
        try {
            const response = await api.post('/Email/password/reset', {
                email: values.email.trim(),
                token: values.token.trim(),
                newPassword: values.newPassword,
            });

            if (response.data.success) {
                setIsSuccess(true);
                toast.success('Password reset successful! Redirecting to login...');
                setTimeout(() => {
                    router.push('/auth/login');
                }, 3000);
            } else {
                toast.error(response.data.message || 'Failed to reset password.');
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'An error occurred. Please check your reset code.');
        } finally {
            setIsLoading(false);
        }
    }

    if (isSuccess) {
        return (
            <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
                <Card className="w-full max-w-md shadow-xl border-t-4 border-green-500 text-center py-8">
                    <CardHeader>
                        <div className="flex justify-center mb-4">
                            <div className="bg-green-100 p-3 rounded-full">
                                <CheckCircle2 className="h-12 w-12 text-green-600" />
                            </div>
                        </div>
                        <CardTitle className="text-2xl font-bold font-outfit text-green-700">Password Reset Done!</CardTitle>
                        <CardDescription className="text-lg mt-2">
                            Your password has been updated successfully.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">
                            You will be redirected to the login page in a few moments.
                        </p>
                    </CardContent>
                    <CardFooter className="flex justify-center mt-4">
                        <Button variant="outline" onClick={() => router.push('/auth/login')}>
                            Go to login now
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    return (
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
            <Card className="w-full max-w-md shadow-xl border-t-4 border-primary">
                <CardHeader className="space-y-1">
                    <div className="flex items-center gap-2 mb-2">
                        <Link href="/auth/forgot-password" className="text-muted-foreground hover:text-primary transition-colors">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                        <span className="text-sm font-medium text-muted-foreground">Back</span>
                    </div>
                    <CardTitle className="text-2xl font-bold font-outfit flex items-center gap-2">
                        <KeyRound className="h-6 w-6 text-primary" />
                        Set new password
                    </CardTitle>
                    <CardDescription>
                        Enter the 6-digit code we sent to your email and choose a strong new password.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input disabled placeholder="name@example.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="token"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Verification Code (6 Digits)</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="123456"
                                                maxLength={6}
                                                className="text-center text-2xl tracking-[0.5em] font-bold py-6"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="newPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>New Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="••••••••" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Confirm New Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="••••••••" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Reset Password
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={
            <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        }>
            <ResetPasswordForm />
        </Suspense>
    );
}
