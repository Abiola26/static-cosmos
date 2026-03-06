'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { signIn } from 'next-auth/react';
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
import { Loader2 } from 'lucide-react';

const registerSchema = z.object({
    fullName: z.string().min(2, { message: 'Full name must be at least 2 characters' }),
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string()
        .min(6, { message: 'Password must be at least 6 characters long' })
        .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
        .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
        .regex(/[0-9]/, { message: 'Password must contain at least one digit' })
        .regex(/[^A-Za-z0-9]/, { message: 'Password must contain at least one special character' }),
    phoneNumber: z.string().optional(),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            fullName: '',
            email: '',
            password: '',
            phoneNumber: '',
        },
    });

    async function onSubmit(values: RegisterFormValues) {
        setIsLoading(true);
        try {
            // Trim values for better consistency
            const trimmedValues = {
                ...values,
                fullName: values.fullName.trim(),
                email: values.email.trim(),
            };

            // 1. Register the user via backend API
            const response = await api.post('/auth/register', trimmedValues);

            if (response.data.success) {
                const resultData = response.data.data;
                const message = response.data.message || 'Account created!';

                if (resultData?.token) {
                    toast.success('Account created! Signing you in...');
                    // 2. Automatically sign in after successful registration (if token is issued)
                    const result = await signIn('credentials', {
                        email: values.email,
                        password: values.password,
                        redirect: false,
                    });

                    if (result?.error) {
                        toast.error('Registration successful, but failed to sign in automatically.');
                        router.push('/auth/login');
                    } else {
                        toast.success('Registration and login successful!');
                        router.push('/');
                        router.refresh();
                    }
                } else {
                    // Registration success but no token (likely needs email confirmation)
                    toast.success(message, { duration: 6000 });
                    router.push('/auth/login');
                }
            } else {
                toast.error(response.data.message || 'Registration failed.');
            }
        } catch (error: any) {
            console.error('Registration error details:', error.response?.data);

            // Log the full response to help debug
            if (error.response) {
                console.log('Error status:', error.response.status);
                console.log('Error data:', error.response.data);
            }

            const data = error.response?.data;
            console.log('Error data received:', data);

            let errorMessage = 'An error occurred during registration.';

            if (data) {
                // Try to extract errors from various potential formats
                const errors = data.errors || data.Errors;
                const message = data.message || data.Message;

                if (Array.isArray(errors) && errors.length > 0) {
                    errorMessage = errors[0];
                } else if (typeof errors === 'object' && errors !== null) {
                    const firstError = Object.values(errors)[0];
                    if (Array.isArray(firstError)) {
                        errorMessage = firstError[0];
                    } else if (typeof firstError === 'string') {
                        errorMessage = firstError;
                    }
                } else if (message) {
                    errorMessage = message;
                }
            }

            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
            <Card className="w-full max-w-md shadow-xl border-t-4 border-primary">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold font-outfit">Create an account</CardTitle>
                    <CardDescription>
                        Enter your details below to create your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="fullName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Full Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="John Doe" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
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
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="••••••••" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="phoneNumber"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Phone Number (Optional)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="+1 234 567 890" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Create Account
                            </Button>
                        </form>
                    </Form>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                    <div className="text-sm text-muted-foreground text-center">
                        Already have an account?{' '}
                        <Link href="/auth/login" className="text-primary hover:underline font-medium">
                            Sign in
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
