"use client";

import { useState } from "react";
import { Plus, Trash2, Download, Save, Eye } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default function CreateInvoicePage() {
  const [lineItems, setLineItems] = useState([{ id: 1, description: "", qty: 1, rate: 0 }]);
  const [discount, setDiscount] = useState(0);
  const [tax, setTax] = useState(0);

  const subtotal = lineItems.reduce((acc, item) => acc + (item.qty * item.rate), 0);
  const taxAmount = (subtotal * tax) / 100;
  const discountAmount = (subtotal * discount) / 100;
  const total = subtotal + taxAmount - discountAmount;

  const addItem = () => setLineItems([...lineItems, { id: Date.now(), description: "", qty: 1, rate: 0 }]);
  const removeItem = (id: number) => setLineItems(lineItems.filter(item => item.id !== id));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">New Invoice</h1>
        <div className="flex space-x-2">
          <button className="inline-flex items-center rounded-md border px-4 py-2 text-sm font-medium hover:bg-accent">
            <Save className="mr-2 h-4 w-4" /> Save Draft
          </button>
          <button className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            <Download className="mr-2 h-4 w-4" /> Export PDF
          </button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Editor Side */}
        <div className="space-y-8 rounded-xl border bg-card p-6 shadow-sm">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Bill To</h2>
            <select className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none ring-offset-background focus:ring-2 focus:ring-ring">
              <option value="">Select a client...</option>
              {/* Clients will be mapped here */}
            </select>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Items</h2>
            <div className="space-y-2">
              {lineItems.map((item, index) => (
                <div key={item.id} className="flex items-start space-x-2">
                  <input 
                    placeholder="Description" 
                    className="flex-1 rounded-md border bg-background px-3 py-2 text-sm"
                  />
                  <input 
                    type="number" 
                    placeholder="Qty" 
                    className="w-20 rounded-md border bg-background px-3 py-2 text-sm"
                    value={item.qty}
                    onChange={(e) => {
                      const newItems = [...lineItems];
                      newItems[index].qty = Number(e.target.value);
                      setLineItems(newItems);
                    }}
                  />
                  <input 
                    type="number" 
                    placeholder="Rate" 
                    className="w-24 rounded-md border bg-background px-3 py-2 text-sm"
                    value={item.rate}
                    onChange={(e) => {
                      const newItems = [...lineItems];
                      newItems[index].rate = Number(e.target.value);
                      setLineItems(newItems);
                    }}
                  />
                  <button onClick={() => removeItem(item.id)} className="p-2 text-destructive hover:bg-destructive/10 rounded-md">
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
              <button onClick={addItem} className="inline-flex items-center text-sm font-medium text-primary hover:underline">
                <Plus size={16} className="mr-1" /> Add Item
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Tax (%)</label>
              <input type="number" className="w-full rounded-md border bg-background px-3 py-2 text-sm" value={tax} onChange={(e) => setTax(Number(e.target.value))} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Discount (%)</label>
              <input type="number" className="w-full rounded-md border bg-background px-3 py-2 text-sm" value={discount} onChange={(e) => setDiscount(Number(e.target.value))} />
            </div>
          </div>
        </div>

        {/* Live Preview Side */}
        <div className="hidden lg:block">
          <div className="sticky top-24 rounded-xl border bg-white p-8 text-black shadow-xl min-h-[700px]">
             {/* Invoice Header */}
             <div className="flex justify-between border-b pb-8">
               <div>
                 <img src="/logo.png" alt="Logo" className="h-12 w-auto grayscale" />
                 <h2 className="mt-4 text-2xl font-bold text-gray-800">INVOICE</h2>
               </div>
               <div className="text-right">
                 <p className="font-bold">INV-001</p>
                 <p className="text-sm text-gray-500">{new Date().toLocaleDateString()}</p>
               </div>
             </div>

             {/* Preview Table */}
             <table className="mt-8 w-full">
               <thead className="bg-gray-50 text-left text-xs font-bold uppercase text-gray-600">
                 <tr>
                   <th className="px-4 py-2">Item</th>
                   <th className="px-4 py-2">Qty</th>
                   <th className="px-4 py-2">Rate</th>
                   <th className="px-4 py-2 text-right">Amount</th>
                 </tr>
               </thead>
               <tbody className="divide-y">
                 {lineItems.map((item) => (
                   <tr key={item.id}>
                     <td className="px-4 py-4 text-sm">{item.description || "Untitled Item"}</td>
                     <td className="px-4 py-4 text-sm">{item.qty}</td>
                     <td className="px-4 py-4 text-sm">{formatCurrency(item.rate)}</td>
                     <td className="px-4 py-4 text-sm text-right">{formatCurrency(item.qty * item.rate)}</td>
                   </tr>
                 ))}
               </tbody>
             </table>

             {/* Preview Totals */}
             <div className="mt-8 flex justify-end">
               <div className="w-48 space-y-2">
                 <div className="flex justify-between text-sm">
                   <span className="text-gray-500">Subtotal:</span>
                   <span>{formatCurrency(subtotal)}</span>
                 </div>
                 {tax > 0 && (
                   <div className="flex justify-between text-sm">
                     <span className="text-gray-500">Tax ({tax}%):</span>
                     <span>{formatCurrency(taxAmount)}</span>
                   </div>
                 )}
                 {discount > 0 && (
                   <div className="flex justify-between text-sm">
                     <span className="text-gray-500">Discount ({discount}%):</span>
                     <span className="text-red-500">-{formatCurrency(discountAmount)}</span>
                   </div>
                 )}
                 <div className="flex justify-between border-t pt-2 text-lg font-bold">
                   <span>Total:</span>
                   <span className="text-primary">{formatCurrency(total)}</span>
                 </div>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
