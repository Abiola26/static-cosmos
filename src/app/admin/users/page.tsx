"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { usersApi } from "@/features/users/users-api";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Users,
    Search,
    Shield,
    Trash2,
    MoreVertical,
    UserPlus,
    Mail,
    Calendar,
    ArrowUpDown,
    CheckCircle2,
    XCircle,
    Loader2
} from "lucide-react";
import { toast } from "sonner";
import { UserResponseDto } from "@/types";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export default function AdminUsersPage() {
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState("");

    const { data: response, isLoading } = useQuery({
        queryKey: ["admin-users"],
        queryFn: () => usersApi.getAllUsers(),
    });

    const users = response?.data || [];

    const deleteMutation = useMutation({
        mutationFn: (id: string) => usersApi.deleteUser(id),
        onSuccess: (res) => {
            if (res.success) {
                toast.success("User deleted successfully.");
                queryClient.invalidateQueries({ queryKey: ["admin-users"] });
            } else {
                toast.error(res.message || "Failed to delete user.");
            }
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || "Error deleting user.");
        }
    });

    const roleMutation = useMutation({
        mutationFn: ({ id, role }: { id: string; role: number }) => usersApi.updateUserRole(id, role),
        onSuccess: (res) => {
            if (res.success) {
                toast.success("User role updated successfully.");
                queryClient.invalidateQueries({ queryKey: ["admin-users"] });
            } else {
                toast.error(res.message || "Failed to update user role.");
            }
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || "Error updating role.");
        }
    });

    const filteredUsers = users.filter(user =>
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="flex flex-col md:flex-row justify-between items-end gap-6 border-b-4 border-primary pb-8">
                <div className="space-y-2">
                    <h1 className="text-5xl lg:text-7xl font-black font-outfit tracking-tighter uppercase">Users</h1>
                    <p className="text-xl text-muted-foreground font-medium underline decoration-primary/30 underline-offset-8 decoration-2 italic">Manage user roles and system access.</p>
                </div>
                <Button className="rounded-full h-16 px-10 text-lg font-black bg-primary shadow-2xl hover:scale-105 transition-all">
                    <UserPlus className="mr-3 h-6 w-6" />
                    CREATE ADMIN ACCOUNT
                </Button>
            </header>

            <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-muted/20 p-6 rounded-[2rem] border border-white/10 ring-1 ring-black/5">
                <div className="relative w-full md:w-96 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                        placeholder="Search by name or email..."
                        className="pl-12 h-14 rounded-full border-2 border-transparent bg-white/50 focus:bg-white focus:border-primary transition-all shadow-inner"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-4">
                    <div className="bg-white/50 px-6 py-4 rounded-full border border-white font-black text-sm uppercase tracking-widest text-primary">
                        Total Users: {filteredUsers.length}
                    </div>
                </div>
            </div>

            <div className="bg-card glass-morphism rounded-[2.5rem] border border-white/10 shadow-3xl overflow-hidden ring-1 ring-black/5">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent border-white/10 h-20">
                            <TableHead className="px-8 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Full Name</TableHead>
                            <TableHead className="px-8 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Role</TableHead>
                            <TableHead className="px-8 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Contact Information</TableHead>
                            <TableHead className="px-8 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Joined Date</TableHead>
                            <TableHead className="px-8 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            [1, 2, 3, 4, 5].map(i => (
                                <TableRow key={i} className="animate-pulse h-28 border-white/5">
                                    <TableCell colSpan={5} className="px-8">
                                        <div className="h-4 bg-muted rounded w-full" />
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : filteredUsers.length === 0 ? (
                            <TableRow className="h-64 border-white/5">
                                <TableCell colSpan={5} className="px-8 text-center pt-20 pb-20">
                                    <div className="flex flex-col items-center gap-4 text-muted-foreground">
                                        <Users className="h-16 w-16 opacity-10" />
                                        <div className="space-y-1">
                                            <p className="font-black font-outfit text-2xl uppercase tracking-tighter">No users found</p>
                                            <p className="italic">No users match your current search criteria.</p>
                                        </div>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : filteredUsers.map((user) => (
                            <TableRow key={user.id} className="group hover:bg-primary/5 transition-colors h-28 border-white/5">
                                <TableCell className="px-8">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center font-black text-primary font-outfit text-xl border border-primary/20">
                                            {user.fullName.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-black font-outfit uppercase tracking-tight">{user.fullName}</p>
                                            <p className="text-[10px] font-bold text-muted-foreground/60 tracking-widest uppercase">{user.id}</p>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="px-8">
                                    <Badge
                                        variant="outline"
                                        className={cn(
                                            "rounded-full border-2 font-black text-[10px] uppercase tracking-widest px-4 py-1.5",
                                            user.role === "Admin"
                                                ? "bg-primary/10 border-primary text-primary shadow-lg shadow-primary/20"
                                                : "bg-muted border-muted-foreground/20 text-muted-foreground"
                                        )}
                                    >
                                        {user.role === "Admin" ? (
                                            <Shield className="h-3 w-3 mr-2" />
                                        ) : (
                                            <Users className="h-3 w-3 mr-2" />
                                        )}
                                        {user.role}
                                    </Badge>
                                </TableCell>
                                <TableCell className="px-8">
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-2 text-sm font-bold">
                                            <Mail className="h-3.5 w-3.5 text-primary/40" />
                                            {user.email}
                                        </div>
                                        {user.phoneNumber && (
                                            <div className="text-[10px] text-muted-foreground font-medium underline decoration-primary/10 underline-offset-2">
                                                {user.phoneNumber}
                                            </div>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell className="px-8">
                                    <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground">
                                        <Calendar className="h-3.5 w-3.5 text-primary/40" />
                                        {format(new Date(user.createdAt), "MMM dd, yyyy")}
                                    </div>
                                </TableCell>
                                <TableCell className="px-8 text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-12 w-12 rounded-xl hover:bg-primary hover:text-white transition-all">
                                                <MoreVertical className="h-5 w-5" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-56 glass-morphism border-white/10 rounded-2xl p-2">
                                            <DropdownMenuLabel className="font-black uppercase tracking-widest text-[10px] p-3 text-muted-foreground/60">Role Management</DropdownMenuLabel>
                                            <DropdownMenuItem
                                                className="rounded-xl p-3 font-bold gap-3"
                                                onClick={() => roleMutation.mutate({ id: user.id, role: user.role === "Admin" ? 0 : 1 })}
                                            >
                                                <Shield className="h-4 w-4 text-primary" />
                                                {user.role === "Admin" ? "Change to Regular User" : "Promote to Admin"}
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator className="bg-white/10" />
                                            <DropdownMenuItem
                                                className="rounded-xl p-3 font-bold gap-3 text-destructive hover:bg-destructive hover:text-white transition-all"
                                                onClick={() => {
                                                    if (confirm(`Are you sure you want to delete ${user.fullName}? This action cannot be undone.`)) {
                                                        deleteMutation.mutate(user.id);
                                                    }
                                                }}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                                Delete Account
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
