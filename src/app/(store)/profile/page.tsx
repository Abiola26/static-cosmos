"use client";

import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Shield, Mail, Calendar, User, Phone, MapPin, Edit2 } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { usersApi } from "@/features/users/users-api";
import { Loader2 } from "lucide-react";

export default function ProfilePage() {
    const { data: session, status } = useSession();

    const { data: userData, isLoading } = useQuery({
        queryKey: ["me"],
        queryFn: usersApi.getMe,
        enabled: !!session?.user,
    });

    if (status === "loading" || (session?.user && isLoading)) {
        return (
            <div className="container mx-auto px-4 py-24 flex items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }

    if (!session?.user) {
        return (
            <div className="container mx-auto px-4 py-24 text-center">
                <p className="text-xl font-medium italic underline decoration-primary/30 underline-offset-8">Please sign in to view your profile.</p>
            </div>
        );
    }

    const { user } = session;
    const profile = userData?.data;

    return (
        <div className="container mx-auto px-4 py-12 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <header className="space-y-2 border-b-4 border-primary pb-8">
                <h1 className="text-7xl lg:text-9xl font-black font-outfit tracking-tighter uppercase leading-[0.8]">
                    My<br />
                    <span className="text-primary italic">Profile</span>
                </h1>
                <p className="text-xl text-muted-foreground font-medium italic underline decoration-primary/30 underline-offset-8 decoration-2 uppercase tracking-widest">User Profile Settings</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Profile Overview Card */}
                <Card className="lg:col-span-1 border-none shadow-3xl glass-morphism rounded-[3rem] overflow-hidden ring-1 ring-black/5">
                    <CardHeader className="p-0 relative">
                        <div className="h-40 bg-primary/20 absolute inset-0 -z-10" />
                        <div className="pt-20 px-8 pb-8 flex flex-col items-center text-center space-y-4">
                            <div className="relative group">
                                <Avatar className="h-40 w-40 border-8 border-background shadow-2xl ring-4 ring-primary/20 transition-transform group-hover:scale-105 duration-500">
                                    <AvatarImage src={user.image || ""} />
                                    <AvatarFallback className="bg-primary text-primary-foreground text-5xl font-black">
                                        {user.name?.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                                <Button size="icon" className="absolute bottom-2 right-2 rounded-full h-10 w-10 bg-primary shadow-xl border-4 border-background hover:scale-110 transition-all">
                                    <Edit2 className="h-4 w-4" />
                                </Button>
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-3xl font-black font-outfit uppercase tracking-tighter">{user.name}</h3>
                                <Badge variant="outline" className={cn(
                                    "rounded-full px-6 py-1 pr-8 font-black uppercase tracking-[0.2em] text-[10px] border-2 shadow-lg",
                                    user.role === "Admin" ? "bg-primary border-primary text-primary-foreground" : "bg-muted border-white/20 text-muted-foreground"
                                )}>
                                    {user.role === "Admin" ? <Shield className="h-3 w-3 mr-2" /> : <User className="h-3 w-3 mr-2" />}
                                    {user.role}
                                </Badge>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-8 space-y-6">
                        <div className="space-y-4">
                            <div className="flex items-center gap-4 group">
                                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                                    <Mail className="h-5 w-5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Email Address</p>
                                    <p className="font-bold truncate underline decoration-primary/20 decoration-2 underline-offset-4">{user.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 group">
                                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                                    <Calendar className="h-5 w-5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Membership Since</p>
                                    <p className="font-bold underline decoration-primary/20 decoration-2 underline-offset-4 italic opacity-80">
                                        {profile?.createdAt ? format(new Date(profile.createdAt), "MMMM yyyy") : "Long-term Member"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Account Details & Metadata */}
                <div className="lg:col-span-2 space-y-12">
                    <Card className="border-none shadow-3xl glass-morphism rounded-[3rem] p-10 ring-1 ring-black/5 space-y-8">
                        <div>
                            <h2 className="text-4xl font-black font-outfit uppercase tracking-tighter leading-none border-l-8 border-primary pl-6">General Details</h2>
                            <p className="text-muted-foreground italic font-medium ml-6 mt-2">Manage your personal information and contact details.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-2 group">
                                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-2">
                                    <User className="h-3 w-3" /> Full Name
                                </label>
                                <div className="p-5 rounded-2xl bg-white/50 border-2 border-transparent group-hover:border-primary/20 transition-all font-bold italic">
                                    {profile?.fullName || user.name}
                                </div>
                            </div>
                            <div className="space-y-2 group">
                                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-2">
                                    <Phone className="h-3 w-3" /> Phone Number
                                </label>
                                <div className={cn("p-5 rounded-2xl bg-white/50 border-2 border-transparent group-hover:border-primary/20 transition-all font-bold italic", !profile?.phoneNumber && "opacity-40")}>
                                    {profile?.phoneNumber || "No phone number added"}
                                </div>
                            </div>
                            <div className="space-y-2 group md:col-span-2">
                                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-2">
                                    <MapPin className="h-3 w-3" /> Shipping Address
                                </label>
                                <div className="p-5 rounded-2xl bg-white/50 border-2 border-transparent group-hover:border-primary/20 transition-all font-bold italic opacity-40">
                                    No shipping address linked.
                                </div>
                            </div>
                        </div>

                        <div className="pt-8 block">
                            <Button className="rounded-full h-16 px-12 text-lg font-black bg-primary shadow-2xl hover:scale-105 transition-all">
                                UPDATE INFORMATION
                            </Button>
                        </div>
                    </Card>

                    <Card className="border-none shadow-3xl glass-morphism rounded-[3rem] p-10 ring-1 ring-black/5 bg-destructive/5 group hover:bg-destructive/10 transition-all border-l-8 border-destructive">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                            <div className="space-y-2">
                                <h3 className="text-2xl font-black font-outfit uppercase tracking-tighter text-destructive">Danger Zone</h3>
                                <p className="text-muted-foreground font-medium italic">Permanently delete your bookstore account and data.</p>
                            </div>
                            <Button variant="outline" className="rounded-full h-14 px-10 border-2 border-destructive text-destructive font-black uppercase tracking-widest hover:bg-destructive hover:text-white transition-all shadow-xl">
                                DELETE ACCOUNT
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
