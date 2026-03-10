"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Shield, Bell, Globe, Save, RefreshCw } from "lucide-react";

export default function AdminSettingsPage() {
    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="flex flex-col md:flex-row justify-between items-end gap-6 border-b-4 border-primary pb-8">
                <div className="space-y-2">
                    <h1 className="text-5xl lg:text-7xl font-black font-outfit tracking-tighter uppercase">Settings</h1>
                    <p className="text-xl text-muted-foreground font-medium underline decoration-primary/30 underline-offset-8 decoration-2 italic">Manage system configuration and preferences.</p>
                </div>
                <Button className="rounded-full h-16 px-10 text-lg font-black bg-primary shadow-2xl hover:scale-105 transition-all gap-3">
                    <Save className="h-6 w-6" />
                    SAVE SETTINGS
                </Button>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="border-none shadow-xl glass-morphism overflow-hidden">
                    <CardHeader className="bg-primary/5 p-8 border-b border-white/10">
                        <div className="flex items-center gap-4">
                            <div className="bg-primary p-3 rounded-2xl">
                                <Globe className="h-6 w-6 text-white" />
                            </div>
                            <CardTitle className="text-2xl font-black font-outfit uppercase">General Settings</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="p-8 space-y-6">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Store Name</Label>
                            <Input defaultValue="Static Cosmos Bookstore" className="h-14 rounded-2xl border-white/10 glass-morphism shadow-inner" />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">API URL</Label>
                            <Input defaultValue="https://api.bookstore.com" className="h-14 rounded-2xl border-white/10 glass-morphism shadow-inner" />
                        </div>
                        <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/20 border border-white/10">
                            <div className="space-y-1">
                                <p className="font-black uppercase tracking-tight">Public Registration</p>
                                <p className="text-xs text-muted-foreground font-medium">Allow new account registrations.</p>
                            </div>
                            <Switch defaultChecked />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-xl glass-morphism overflow-hidden">
                    <CardHeader className="bg-primary/5 p-8 border-b border-white/10">
                        <div className="flex items-center gap-4">
                            <div className="bg-primary p-3 rounded-2xl">
                                <Shield className="h-6 w-6 text-white" />
                            </div>
                            <CardTitle className="text-2xl font-black font-outfit uppercase">Security Settings</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="p-8 space-y-6">
                        <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/20 border border-white/10">
                            <div className="space-y-1">
                                <p className="font-black uppercase tracking-tight">Multi-Factor Auth</p>
                                <p className="text-xs text-muted-foreground font-medium">Require multi-factor authentication for sensitive actions.</p>
                            </div>
                            <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/20 border border-white/10">
                            <div className="space-y-1">
                                <p className="font-black uppercase tracking-tight">Session Encryption</p>
                                <p className="text-xs text-muted-foreground font-medium">Enable end-to-end encryption for all sessions.</p>
                            </div>
                            <Switch defaultChecked />
                        </div>
                        <Button variant="outline" className="w-full h-14 rounded-2xl border-2 font-black gap-2 mt-4">
                            <RefreshCw className="h-5 w-5" />
                            RESET API TOKENS
                        </Button>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-xl glass-morphism lg:col-span-2 overflow-hidden">
                    <CardHeader className="bg-primary/5 p-8 border-b border-white/10">
                        <div className="flex items-center gap-4">
                            <div className="bg-primary p-3 rounded-2xl">
                                <Bell className="h-6 w-6 text-white" />
                            </div>
                            <CardTitle className="text-2xl font-black font-outfit uppercase">Notifications</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/20 border border-white/10">
                                <p className="font-black uppercase tracking-tight text-xs">Inventory Alerts</p>
                                <Switch defaultChecked />
                            </div>
                            <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/20 border border-white/10">
                                <p className="font-black uppercase tracking-tight text-xs">New Order Alerts</p>
                                <Switch defaultChecked />
                            </div>
                            <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/20 border border-white/10">
                                <p className="font-black uppercase tracking-tight text-xs">Security Events</p>
                                <Switch defaultChecked />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
