import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Package, MessageSquare, Truck, Trash2, Eye, X, Users } from "lucide-react";
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

export default function AdminDashboard() {
  const queryClient = useQueryClient();

  // Fetch all orders
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
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
  
  // Fetch unread inquiries
  const { data: inquiries = [] } = useQuery({
    queryKey: ['admin-unread-count'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .eq('status', 'unread');
      if (error) throw error;
      return data;
    }
  });

  // Analytics based on live orders
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const newInquiries = inquiries.length;
  const totalRevenue = orders.reduce((sum, o) => sum + Number(o.total_amount), 0);

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('orders').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      toast.success("Order dispatched and removed successfully!");
    },
    onError: (err) => {
      toast.error(`Error processing order: ${err.message}`);
    }
  });

  const handleCancel = (id: string, customer: string) => {
    if (window.confirm(`Are you sure you want to cancel ${customer}'s order? This will remove it from the database.`)) {
      deleteMutation.mutate(id);
    }
  };

  const handleDispatch = (id: string, customer: string) => {
    if (window.confirm(`Are you sure you want to dispatch ${customer}'s order? This will remove it from the database.`)) {
      deleteMutation.mutate(id);
    }
  };

  const handleRowClick = (order: any) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleWhatsApp = (phone: string, orderId: string) => {
    // Format phone number by removing non-digits
    const formattedPhone = phone.replace(/\D/g, '');
    const message = encodeURIComponent(`Hello! We are contacting you regarding your SPECS WEAR order (${orderId.split('-')[0]})...`);
    window.open(`https://wa.me/${formattedPhone}?text=${message}`, "_blank");
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-foreground">Dashboard & Recent Orders</h1>
      
      {/* Stats row */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4 mb-10">
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Total Orders</p>
            <Package className="h-5 w-5 text-primary" />
          </div>
          <p className="mt-2 text-3xl font-bold text-foreground">{totalOrders}</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">New Inquiries</p>
            <MessageSquare className="h-5 w-5 text-orange-500" />
          </div>
          <p className="mt-2 text-3xl font-bold text-foreground">{newInquiries}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Total Revenue</p>
            <TrendingUpIcon className="h-5 w-5 text-green-500" />
          </div>
          <p className="mt-2 text-3xl font-bold text-foreground">Rs. {totalRevenue.toLocaleString()}</p>
        </div>
      </div>

      <h2 className="font-display text-xl font-bold mb-4">Manage Orders</h2>
      <div className="overflow-auto rounded-xl border border-border bg-card">
        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground">Loading orders from database...</div>
        ) : orders.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">No orders found.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-secondary text-left">
              <tr>
                <th className="px-4 py-3 font-medium text-muted-foreground">Customer Info</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Shipping Address</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Date</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Total</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order: any) => (
                <tr 
                  key={order.id} 
                  className="border-b border-border last:border-0 hover:bg-secondary/50 transition-colors cursor-pointer group"
                  onClick={() => handleRowClick(order)}
                >
                  <td className="px-4 py-4 min-w-[200px]">
                    <div className="font-medium text-foreground group-hover:text-primary transition-colors">{order.customer_name}</div>
                    <div className="text-muted-foreground text-xs mt-1">{order.customer_email}</div>
                    <div className="text-muted-foreground text-xs">{order.customer_phone}</div>
                  </td>
                  <td className="px-4 py-4 max-w-xs truncate" title={order.shipping_address}>
                    {order.shipping_address}
                  </td>
                  <td className="px-4 py-4 text-muted-foreground">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-4 font-medium text-primary">
                    Rs. {Number(order.total_amount).toLocaleString()}
                  </td>
                  <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="bg-green-50 text-green-600 border-green-200 hover:bg-green-100 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400 gap-1.5"
                        onClick={() => handleWhatsApp(order.customer_phone, order.id)}
                      >
                        <MessageSquare className="h-3.5 w-3.5" /> WhatsApp
                      </Button>
                      <Button 
                        size="sm" 
                        className="bg-primary text-primary-foreground gap-1.5 hover:opacity-90"
                        onClick={() => handleDispatch(order.id, order.customer_name)}
                        disabled={deleteMutation.isPending}
                      >
                        <Truck className="h-3.5 w-3.5" /> Dispatch
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        className="gap-1.5"
                        onClick={() => handleCancel(order.id, order.customer_name)}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="h-3.5 w-3.5" /> Cancel
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
              Order Details
              <Badge variant={selectedOrder?.status === 'pending' ? 'secondary' : 'default'} className="ml-4">
                {selectedOrder?.status || 'Processing'}
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
                <h3 className="font-semibold text-foreground">Items Ordered</h3>
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
                          <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">No items found for this order.</td>
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
                  className="bg-primary text-primary-foreground gap-1.5 hover:opacity-90"
                  onClick={() => {
                    handleDispatch(selectedOrder.id, selectedOrder.customer_name);
                    setIsModalOpen(false);
                  }}
                  disabled={deleteMutation.isPending}
                >
                  <Truck className="h-4 w-4" /> Dispatch Order
                </Button>
                <Button 
                  variant="destructive" 
                  className="gap-1.5"
                  onClick={() => {
                    handleCancel(selectedOrder.id, selectedOrder.customer_name);
                    setIsModalOpen(false);
                  }}
                  disabled={deleteMutation.isPending}
                >
                  <Trash2 className="h-4 w-4" /> Cancel Order
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Simple internal icon since TrendingUp wasn't imported perfectly but I can just create it
function TrendingUpIcon(props: any) {
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
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  );
}
