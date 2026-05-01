import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/layout/Navbar";
import { ArrowRight, CheckCircle, FileText, Send, CreditCard } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-background py-20 lg:py-32">
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
              <div className="mb-6 inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                <span className="relative flex h-2 w-2 mr-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                Now in Public Beta
              </div>
              
              <h1 className="mb-6 max-w-3xl text-4xl font-extrabold tracking-tight sm:text-6xl">
                Create. Send. <span className="text-primary">Get Paid.</span>
              </h1>
              
              <p className="mb-8 max-w-2xl text-lg text-muted-foreground sm:text-xl">
                The modern invoicing platform for freelancers and small businesses. Generate professional PDF invoices in seconds and manage your cash flow with ease.
              </p>
              
              <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                <Link
                  href="/signup"
                  className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-8 text-base font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  Get Started for Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  href="/pricing"
                  className="inline-flex h-12 items-center justify-center rounded-md border border-input bg-background px-8 text-base font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  View Pricing
                </Link>
              </div>
            </div>
          </div>
          
          {/* Decorative Background Element */}
          <div className="absolute right-0 top-0 -z-10 hidden h-full w-1/3 bg-primary/5 lg:block" style={{ borderRadius: '100% 0 0 100%' }}></div>
        </section>

        {/* Features Section */}
        <section className="bg-muted py-24">
          <div className="container mx-auto px-4">
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">Everything you need to run your business</h2>
              <p className="text-lg text-muted-foreground">Focus on your work, while we handle the boring paperwork.</p>
            </div>
            
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              <FeatureCard 
                icon={<FileText className="h-10 w-10 text-primary" />}
                title="Professional Templates"
                description="Choose from beautiful, high-converting invoice templates designed for any industry."
              />
              <FeatureCard 
                icon={<Send className="h-10 w-10 text-primary" />}
                title="Instant Delivery"
                description="Send invoices directly to your clients' inbox via email or share a secure magic link."
              />
              <FeatureCard 
                icon={<CreditCard className="h-10 w-10 text-primary" />}
                title="Smart Tracking"
                description="Get notified when a client views your invoice and track payment statuses in real-time."
              />
              <FeatureCard 
                icon={<CheckCircle className="h-10 w-10 text-primary" />}
                title="Digital Signatures"
                description="Secure your deals with built-in digital signatures. No more printing and scanning."
              />
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t bg-background py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between space-y-6 md:flex-row md:space-y-0">
            <div className="flex items-center space-x-2">
              <Image src="/logo.png" alt="Invoicemo Logo" width={24} height={24} />
              <span className="text-lg font-bold">Invoicemo</span>
            </div>
            
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Invoicemo Inc. All rights reserved.
            </p>
            
            <div className="flex space-x-6">
              <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary">Privacy</Link>
              <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary">Terms</Link>
              <Link href="/contact" className="text-sm text-muted-foreground hover:text-primary">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="rounded-xl border bg-card p-8 shadow-sm transition-all hover:shadow-md">
      <div className="mb-4">{icon}</div>
      <h3 className="mb-2 text-xl font-semibold">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
