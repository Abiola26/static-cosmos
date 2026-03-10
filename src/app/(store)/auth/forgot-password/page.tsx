'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
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
import { Loader2, ArrowLeft } from 'lucide-react';

const forgotPasswordSchema = z.object({
    email: z.string().email({ message: 'Invalid email address' }),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<ForgotPasswordFormValues>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: '',
        },
    });

    async function onSubmit(values: ForgotPasswordFormValues) {
        setIsLoading(true);
        try {
            const response = await api.post('/Email/password/request-reset', {
                email: values.email.trim(),
            });

            if (response.data.success) {
                toast.success('Wait for the email to arrive with your 6-digit code!');
                router.push(`/auth/reset-password?email=${encodeURIComponent(values.email.trim())}`);
            } else {
                toast.error(response.data.message || 'Failed to request password reset.');
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
            <Card className="w-full max-w-md shadow-xl border-t-4 border-primary">
                <CardHeader className="space-y-1">
                    <div className="flex items-center gap-2 mb-2">
                        <Link href="/auth/login" className="text-muted-foreground hover:text-primary transition-colors">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                        <span className="text-sm font-medium text-muted-foreground">Back to login</span>
                    </div>
                    <CardTitle className="text-2xl font-bold font-outfit">Reset your password</CardTitle>
                    <CardDescription>
                        Enter your email address and we&apos;ll send you a 6-digit code to reset your password.
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
                                            <Input placeholder="name@example.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Send Reset Code
                            </Button>
                        </form>
                    </Form>
                </CardContent>
                <CardFooter>
                    <p className="text-xs text-center w-full text-muted-foreground">
                        If you don&apos;t receive the email within a few minutes, please check your spam folder.
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}
