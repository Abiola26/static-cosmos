'use client';

import { useState, useEffect, Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { signIn, getSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
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
import { Loader2 } from 'lucide-react';

const loginSchema = z.object({
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const confirmed = searchParams.get('confirmed');
        const error = searchParams.get('error');

        if (confirmed === 'true') {
            toast.success('Email confirmed! You can now sign in.');
            router.replace('/auth/login');
        }

        if (error) {
            // NextAuth v5 puts the LoginError.code value into the `error` query param.
            // Decode it in case it was URL-encoded, and map internal NextAuth error
            // names (e.g. "CredentialsSignin", "Configuration") to friendly messages.
            const decoded = decodeURIComponent(error);
            const NEXTAUTH_INTERNAL_ERRORS = ['CredentialsSignin', 'Configuration', 'AccessDenied', 'Verification'];
            const msg = NEXTAUTH_INTERNAL_ERRORS.includes(decoded)
                ? 'Invalid email or password.'
                : decoded;
            toast.error(msg, { duration: 5000 });
            router.replace('/auth/login');
        }
    }, [searchParams, router]);

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    async function onSubmit(values: LoginFormValues) {
        setIsLoading(true);
        try {
            const result = await signIn('credentials', {
                email: values.email.trim(),
                password: values.password,
                redirect: false,
            });

            if (result?.error) {
                // Surface the real message thrown in auth.ts authorize()
                const msg = result.error === 'CredentialsSignin'
                    ? 'Invalid email or password.'
                    : result.error;
                toast.error(msg, { duration: 5000 });
            } else {
                toast.success('Login successful!');

                // Fetch the updated session to determine the user's role
                const session = await getSession();

                if (session?.user?.role === 'Admin') {
                    router.push('/admin');
                } else {
                    router.push('/');
                }
                router.refresh();
            }
        } catch (error) {
            toast.error('An unexpected error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
            <Card className="w-full max-w-md shadow-xl border-t-4 border-primary">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold font-outfit">Welcome back</CardTitle>
                    <CardDescription>
                        Enter your email and password to access your account
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
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="flex items-center justify-between">
                                            <FormLabel>Password</FormLabel>
                                            <Link
                                                href="/auth/forgot-password"
                                                className="text-sm font-medium text-primary hover:underline hover:text-primary/90 transition-colors"
                                            >
                                                Forgot password?
                                            </Link>
                                        </div>
                                        <FormControl>
                                            <Input type="password" placeholder="••••••••" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Sign In
                            </Button>
                        </form>
                    </Form>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                    <div className="text-sm text-muted-foreground text-center">
                        Don&apos;t have an account?{' '}
                        <Link href="/auth/register" className="text-primary hover:underline font-medium">
                            Create an account
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        }>
            <LoginForm />
        </Suspense>
    );
}
