import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Package, MessageSquare, Trash2, Users, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { formatWhatsAppNumber } from "@/lib/utils";

export default function AdminBookings() {
  const queryClient = useQueryClient();

  // Fetch all orders with is_booking = true
  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ['admin-bookings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('is_booking', true)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    }
  });

  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch order items with product details
  const { data: orderItems = [], isLoading: itemsLoading } = useQuery({
    queryKey: ['admin-order-items', selectedOrder?.id],
    queryFn: async () => {
      if (!selectedOrder?.id) return [];
      const { data, error } = await supabase
        .from('order_items')
        .select(`
          *,
          products (*)
        `)
        .eq('order_id', selectedOrder.id);
      
      if (error) throw error;
      return data;
    },
    enabled: !!selectedOrder?.id
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('orders').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-bookings'] });
      toast.success("Booking removed from database.");
    },
    onError: (err) => {
      toast.error(`Error deleting booking: ${err.message}`);
    }
  });

  const handleCancel = (id: string, customer: string) => {
    if (window.confirm(`Are you sure you want to permanently DELETE ${customer}'s booking? This cannot be undone.`)) {
      deleteMutation.mutate(id);
    }
  };

  const handleRowClick = (order: any) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleWhatsApp = async (order: any) => {
    const formattedPhone = formatWhatsAppNumber(order.customer_phone);
    if (!formattedPhone) {
      toast.error("Invalid phone number");
      return;
    }

    const { data: items, error } = await supabase
      .from('order_items')
      .select(`
        quantity,
        unit_price,
        products (name)
      `)
      .eq('order_id', order.id);

    if (error) {
      toast.error(`Failed to fetch order items: ${error.message}`);
      return;
    }

    const orderLines = (items || []).map((item: any, index: number) => {
      const productName = item.products?.name || 'Product';
      const qty = Number(item.quantity) || 0;
      const unitPrice = Number(item.unit_price) || 0;
      const lineTotal = qty * unitPrice;
      return `${index + 1}. ${productName}\n   Qty: ${qty} x Rs. ${unitPrice.toLocaleString()} = Rs. ${lineTotal.toLocaleString()}`;
    });

    const itemsSubtotal = (items || []).reduce((sum: number, item: any) => {
      const qty = Number(item.quantity) || 0;
      const unitPrice = Number(item.unit_price) || 0;
      return sum + qty * unitPrice;
    }, 0);

    const orderTotal = Number(order.total_amount) || 0;
    const shippingPrice = Math.max(orderTotal - itemsSubtotal, 0);
    const orderRef = String(order.id || 'N/A').split('-')[0];

    const message = encodeURIComponent(
      `SPECS WEAR - UPDATE ON YOUR BOOKING\n` +
      `--------------------------------\n` +
      `Booking Ref: ${orderRef}\n\n` +
      `Hello ${order.customer_name},\n` +
      `Thank you for placing a booking! We will notify you once items are restocked.\n\n` +
      `Items Booked:\n` +
      `${orderLines.length ? orderLines.join("\n") : "No items found"}\n\n` +
      `Estimated Total Amount: Rs. ${orderTotal.toLocaleString()}\n\n`
    );
    window.open(`https://wa.me/${formattedPhone}?text=${message}`, "_blank");
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-foreground mb-2">Bookings</h1>
      <p className="text-muted-foreground mb-8">Manage orders for out-of-stock items. Once products are restocked, they automatically shift to Pending orders.</p>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 mb-10">
        <div className="rounded-xl border border-border bg-card p-6 border-l-4 border-l-amber-500">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground font-medium">Pending Bookings</p>
            <Package className="h-5 w-5 text-amber-500" />
          </div>
          <p className="mt-2 text-3xl font-bold text-amber-600 dark:text-amber-400">{bookings.length}</p>
          <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wider font-semibold">Out of stock items</p>
        </div>
      </div>

      <div className="mt-4 overflow-auto rounded-xl border border-border bg-card shadow-sm">
        {isLoading ? (
          <div className="p-12 text-center text-muted-foreground flex flex-col items-center gap-2">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            Loading bookings...
          </div>
        ) : bookings.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground flex flex-col items-center gap-3">
             <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center text-muted-foreground/50">
               <Package className="h-6 w-6" />
             </div>
             <div>
               <p className="font-medium text-foreground">No bookings found.</p>
               <p className="text-xs">Out-of-stock orders will appear here automatically.</p>
             </div>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-secondary/50 text-left">
              <tr>
                <th className="px-6 py-4 font-semibold text-foreground uppercase tracking-wider text-[11px]">Customer Info</th>
                <th className="px-6 py-4 font-semibold text-foreground uppercase tracking-wider text-[11px]">Shipping Address</th>
                <th className="px-6 py-4 font-semibold text-foreground uppercase tracking-wider text-[11px]">Date</th>
                <th className="px-6 py-4 font-semibold text-foreground uppercase tracking-wider text-[11px]">Total</th>
                <th className="px-6 py-4 font-semibold text-foreground uppercase tracking-wider text-[11px]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {bookings.map((order: any) => (
                <tr 
                  key={order.id} 
                  className="hover:bg-secondary/30 transition-all cursor-pointer group"
                  onClick={() => handleRowClick(order)}
                >
                  <td className="px-6 py-5 min-w-[200px]">
                    <div className="font-bold text-foreground group-hover:text-primary transition-colors">{order.customer_name}</div>
                    <div className="text-muted-foreground text-xs font-medium mt-1 uppercase tracking-tight">{order.customer_phone}</div>
                  </td>
                  <td className="px-6 py-5 max-w-xs truncate font-medium text-muted-foreground" title={order.shipping_address}>
                    {order.shipping_address}
                  </td>
                  <td className="px-6 py-5 text-muted-foreground font-medium">
                    {new Date(order.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-5 font-bold text-foreground">
                    Rs. {Number(order.total_amount).toLocaleString()}
                  </td>
                  <td className="px-6 py-5" onClick={(e) => e.stopPropagation()}>
                    <div className="flex gap-2">
                       <Button 
                         size="sm" 
                         variant="outline" 
                         className="bg-green-50 text-green-600 border-green-200 hover:bg-[#15a349] hover:text-white hover:border-[#15a349] dark:bg-green-900/10 dark:border-green-800 dark:text-green-400 gap-1.5 h-8 font-semibold transition-colors"
                         onClick={() => handleWhatsApp(order)}
                       >
                         <MessageSquare className="h-3.5 w-3.5" /> WhatsApp Customer
                       </Button>
                       <Button 
                         size="sm" 
                         variant="ghost"
                         className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-8 font-semibold"
                         onClick={() => handleCancel(order.id, order.customer_name)}
                       >
                         <Trash2 className="h-3.5 w-3.5" />
                       </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center justify-between">
              Booking Details
              <Badge 
                variant="destructive"
                className="ml-4 capitalize bg-amber-500 hover:bg-amber-600 text-white"
              >
                Booking (Out of Stock)
              </Badge>
            </DialogTitle>
            <DialogDescription>
              Order ID: {selectedOrder?.id}
            </DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="grid gap-6 mt-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h3 className="font-semibold text-foreground flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" /> Customer Information
                  </h3>
                  <div className="text-sm space-y-1 bg-secondary/30 p-4 rounded-lg border border-border">
                    <p><span className="text-muted-foreground">Name:</span> {selectedOrder.customer_name}</p>
                    <p><span className="text-muted-foreground">Email:</span> {selectedOrder.customer_email}</p>
                    <p><span className="text-muted-foreground">Phone:</span> {selectedOrder.customer_phone}</p>
                    <p><span className="text-muted-foreground">Date:</span> {new Date(selectedOrder.created_at).toLocaleString()}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <h3 className="font-semibold text-foreground flex items-center gap-2">
                    <Truck className="h-4 w-4 text-primary" /> Shipping Address
                  </h3>
                  <div className="text-sm bg-secondary/30 p-4 rounded-lg border border-border min-h-[100px]">
                    {selectedOrder.shipping_address}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-foreground">Items Booked</h3>
                <div className="border border-border rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-secondary/50 border-b border-border">
                      <tr>
                        <th className="px-4 py-2 text-left font-medium text-muted-foreground">Product</th>
                        <th className="px-4 py-2 text-center font-medium text-muted-foreground">Qty</th>
                        <th className="px-4 py-2 text-right font-medium text-muted-foreground">Price</th>
                        <th className="px-4 py-2 text-right font-medium text-muted-foreground">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {itemsLoading ? (
                        <tr>
                          <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">Loading items...</td>
                        </tr>
                      ) : orderItems.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">No items found for this booking.</td>
                        </tr>
                      ) : (
                        orderItems.map((item: any) => (
                          <tr key={item.id} className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded border border-border overflow-hidden bg-white shrink-0">
                                  {item.products?.image && (
                                    <img src={item.products.image} alt={item.products.name} className="h-full w-full object-cover" />
                                  )}
                                </div>
                                <span className="font-medium">{item.products?.name || `Product #${item.product_id}`}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-center">{item.quantity}</td>
                            <td className="px-4 py-3 text-right">Rs. {Number(item.unit_price).toLocaleString()}</td>
                            <td className="px-4 py-3 text-right font-medium">Rs. {(item.quantity * item.unit_price).toLocaleString()}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                    <tfoot className="bg-secondary/20 font-bold border-t border-border">
                      <tr>
                        <td colSpan={3} className="px-4 py-3 text-right">Total Amount</td>
                        <td className="px-4 py-3 text-right text-primary">Rs. {Number(selectedOrder.total_amount).toLocaleString()}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>Close</Button>
                
                <Button 
                  variant="destructive" 
                  className="gap-1.5"
                  onClick={() => {
                    handleCancel(selectedOrder.id, selectedOrder.customer_name);
                    setIsModalOpen(false);
                  }}
                  disabled={deleteMutation.isPending}
                >
                  <Trash2 className="h-4 w-4" /> Cancel Booking
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
