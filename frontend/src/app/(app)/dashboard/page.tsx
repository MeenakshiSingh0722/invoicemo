"use client";

import { useAuth } from "@/context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Plus, FileText, Users, Clock, TrendingUp } from "lucide-react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";

export default function DashboardPage() {
  const { user } = useAuth();

  const { data: invoices, isLoading: invoicesLoading } = useQuery({
    queryKey: ["invoices", "recent"],
    queryFn: async () => {
      const res = await api.get("/invoices?limit=5");
      return res.data.data;
    },
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user?.email.split('@')[0]}</h1>
          <p className="text-muted-foreground">Here's an overview of your business.</p>
        </div>
        <Link
          href="/invoices/create"
          className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create Invoice
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Revenue" value="$0.00" icon={<TrendingUp className="h-4 w-4 text-primary" />} description="+0% from last month" />
        <StatCard title="Pending Invoices" value="0" icon={<Clock className="h-4 w-4 text-yellow-500" />} description="0 awaiting payment" />
        <StatCard title="Total Invoices" value="0" icon={<FileText className="h-4 w-4 text-blue-500" />} description="In all statuses" />
        <StatCard title="Total Clients" value="0" icon={<Users className="h-4 w-4 text-green-500" />} description="Active customers" />
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Recent Invoices */}
        <div className="rounded-xl border bg-card shadow-sm">
          <div className="flex items-center justify-between p-6">
            <h2 className="text-xl font-semibold">Recent Invoices</h2>
            <Link href="/invoices" className="text-sm font-medium text-primary hover:underline">View all</Link>
          </div>
          <div className="p-0">
            {invoicesLoading ? (
              <div className="p-8 text-center text-muted-foreground">Loading...</div>
            ) : invoices?.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="border-y bg-muted/50 text-xs font-medium uppercase text-muted-foreground">
                    <tr>
                      <th className="px-6 py-3">ID</th>
                      <th className="px-6 py-3">Client</th>
                      <th className="px-6 py-3">Amount</th>
                      <th className="px-6 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {invoices.map((inv: any) => (
                      <tr key={inv._id} className="hover:bg-muted/50">
                        <td className="px-6 py-4 font-medium">#{inv.invoiceNumber}</td>
                        <td className="px-6 py-4">{inv.clientDetails?.name || "Unknown"}</td>
                        <td className="px-6 py-4">{formatCurrency(inv.total, inv.currency)}</td>
                        <td className="px-6 py-4">
                          <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium", 
                            inv.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800')}>
                            {inv.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-12 text-center">
                <FileText className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <h3 className="mt-4 text-lg font-medium">No invoices yet</h3>
                <p className="text-muted-foreground">Create your first professional invoice today.</p>
                <Link href="/invoices/create" className="mt-6 inline-flex text-primary hover:underline">Start creating →</Link>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions / Tips */}
        <div className="space-y-4">
          <div className="rounded-xl border bg-primary/5 p-6 text-primary">
            <h3 className="font-bold">Pro Tip: Dark Mode</h3>
            <p className="mt-1 text-sm opacity-90">Switch to dark mode in the navigation bar for a sleek night-time workspace.</p>
          </div>
          <div className="rounded-xl border bg-card p-6">
            <h3 className="font-semibold">Quick Setup</h3>
            <ul className="mt-4 space-y-4">
              <SetupItem done={false} title="Complete your profile" href="/settings" />
              <SetupItem done={false} title="Add your business logo" href="/settings" />
              <SetupItem done={false} title="Add your first client" href="/clients" />
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, description }: any) {
  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">{title}</span>
        {icon}
      </div>
      <div className="mt-2 flex flex-col">
        <span className="text-2xl font-bold">{value}</span>
        <span className="text-xs text-muted-foreground">{description}</span>
      </div>
    </div>
  );
}

function SetupItem({ done, title, href }: any) {
  return (
    <li className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className={cn("h-4 w-4 rounded-full border", done ? "bg-primary border-primary" : "border-muted-foreground")} />
        <span className={cn("text-sm", done ? "text-muted-foreground line-through" : "text-foreground font-medium")}>{title}</span>
      </div>
      {!done && <Link href={href} className="text-xs text-primary hover:underline">Setup</Link>}
    </li>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
