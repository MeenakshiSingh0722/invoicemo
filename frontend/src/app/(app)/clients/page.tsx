"use client";

import { useState } from "react";
import { useClients, useDeleteClient } from "@/hooks/useClients";
import { Plus, Search, MoreVertical, Edit, Trash2, Mail, Phone, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ClientsPage() {
  const { data: clients, isLoading } = useClients();
  const deleteClient = useDeleteClient();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredClients = clients?.filter((client: any) => 
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clients</h1>
          <p className="text-muted-foreground">Manage your customer database and billing information.</p>
        </div>
        <button className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90">
          <Plus className="mr-2 h-4 w-4" />
          Add Client
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <input
          placeholder="Search clients by name or email..."
          className="flex h-10 w-full rounded-md border border-input bg-background px-10 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 animate-pulse rounded-xl border bg-muted/50" />
          ))}
        </div>
      ) : filteredClients?.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredClients.map((client: any) => (
            <ClientCard key={client._id} client={client} onDelete={() => deleteClient.mutate(client._id)} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed p-12 text-center">
          <Users className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-medium">No clients found</h3>
          <p className="text-muted-foreground">Start by adding your first client to the directory.</p>
          <button className="mt-6 text-primary hover:underline">Add Client →</button>
        </div>
      )}
    </div>
  );
}

function ClientCard({ client, onDelete }: { client: any, onDelete: () => void }) {
  return (
    <div className="group relative rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-start justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xl">
          {client.name.charAt(0)}
        </div>
        <div className="flex space-x-1 opacity-0 transition-opacity group-hover:opacity-100">
          <button className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-md">
            <Edit size={16} />
          </button>
          <button onClick={onDelete} className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/5 rounded-md">
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="mt-4">
        <h3 className="text-lg font-semibold">{client.name}</h3>
        <div className="mt-3 space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center space-x-2">
            <Mail size={14} />
            <span>{client.email}</span>
          </div>
          {client.address && (
            <div className="flex items-start space-x-2">
              <MapPin size={14} className="mt-0.5" />
              <span className="line-clamp-1">{client.address.city}, {client.address.country}</span>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 border-t pt-4">
        <div className="flex items-center justify-between text-xs font-medium">
          <span className="text-muted-foreground">Active Invoices</span>
          <span className="text-foreground">0</span>
        </div>
      </div>
    </div>
  );
}

function Users(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
