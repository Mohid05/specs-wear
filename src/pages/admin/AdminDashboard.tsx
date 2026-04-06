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
import { useState, useEffect } from "react";
import { formatWhatsAppNumber } from "@/lib/utils";

type OrderStatus = 'pending' | 'shipped' | 'delivered';

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
  const [activeTab, setActiveTab] = useState<OrderStatus>('pending');

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
  const pendingCount = orders.filter((o: any) => o.status === 'pending' || !o.status).length;
  const dispatchedCount = orders.filter((o: any) => o.status === 'shipped').length;
  const successfulCount = orders.filter((o: any) => o.status === 'delivered').length;
  const newInquiries = inquiries.length;
  
  // Revenue is only from delivered (Successful) orders
  const totalRevenue = orders
    .filter((o: any) => o.status === 'delivered')
    .reduce((sum: number, o: any) => sum + Number(o.total_amount), 0);

  // Auto-cleanup for Delivered orders older than 7 days
  useEffect(() => {
    if (isLoading || orders.length === 0) return;
    
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const oldSuccessfulOrders = orders.filter((o: any) => 
      o.status === 'delivered' && new Date(o.created_at) < sevenDaysAgo
    );
    
    if (oldSuccessfulOrders.length > 0) {
      console.log(`Auto-cleaning ${oldSuccessfulOrders.length} expired successful orders...`);
      oldSuccessfulOrders.forEach((o: any) => {
        deleteMutation.mutate(o.id);
      });
    }
  }, [orders, isLoading]);

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: OrderStatus }) => {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      let action = "updated";
      if (variables.status === 'shipped') action = "dispatched";
      else if (variables.status === 'delivered') action = "marked as successful";
      toast.success(`Order ${action} successfully!`);
    },
    onError: (err: any) => {
      toast.error(`Error updating order: ${err.message}`);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('orders').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      toast.success("Order removed from database.");
    },
    onError: (err) => {
      toast.error(`Error deleting order: ${err.message}`);
    }
  });

  const handleCancel = (id: string, customer: string) => {
    if (window.confirm(`Are you sure you want to permanently DELETE ${customer}'s order? This cannot be undone.`)) {
      deleteMutation.mutate(id);
    }
  };

  const handleDispatch = (id: string, customer: string) => {
    if (window.confirm(`Dispatch ${customer}'s order?`)) {
      updateStatusMutation.mutate({ id, status: 'shipped' });
    }
  };

  const handleSuccessful = (id: string, customer: string) => {
    if (window.confirm(`Set ${customer}'s order as Successful? .`)) {
      updateStatusMutation.mutate({ id, status: 'delivered' });
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
    const orderDate = order.created_at
      ? new Date(order.created_at).toLocaleString()
      : 'N/A';

    const message = encodeURIComponent(
      `SPECS WEAR - ORDER INVOICE\n` +
      `--------------------------------\n` +
      `Invoice Ref: ${orderRef}\n` +
      `Date: ${orderDate}\n\n` +
      `Bill To:\n` +
      `Name: ${order.customer_name || "N/A"}\n` +
      `Email: ${order.customer_email || "N/A"}\n` +
      `Phone: ${order.customer_phone || "N/A"}\n\n` +
      `Ship To:\n` +
      `${order.shipping_address || "N/A"}\n\n` +
      `Items:\n` +
      `${orderLines.length ? orderLines.join("\n") : "No items found"}\n\n` +
      `Summary:\n` +
      `Subtotal: Rs. ${itemsSubtotal.toLocaleString()}\n` +
      `Shipping: Rs. ${shippingPrice.toLocaleString()}\n` +
      `Grand Total: Rs. ${orderTotal.toLocaleString()}\n\n` +
      `Thank you for shopping with SPECS WEAR.`
    );
    window.open(`https://wa.me/${formattedPhone}?text=${message}`, "_blank");
  };

  const filteredOrders = orders.filter((o: any) => {
    if (activeTab === 'pending') return o.status === 'pending' || !o.status;
    return o.status === activeTab;
  });

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-foreground">Dashboard & History</h1>
      
      {/* Stats row */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4 mb-10">
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Pending Orders</p>
            <Package className="h-5 w-5 text-orange-500" />
          </div>
          <p className="mt-2 text-3xl font-bold text-foreground">{pendingCount}</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Dispatched Orders</p>
            <Truck className="h-5 w-5 text-green-500" />
          </div>
          <p className="mt-2 text-3xl font-bold text-foreground">{dispatchedCount}</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">New Inquiries</p>
            <MessageSquare className="h-5 w-5 text-blue-500" />
          </div>
          <p className="mt-2 text-3xl font-bold text-foreground">{newInquiries}</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 border-l-4 border-l-green-500">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground font-medium">Total Earnings</p>
            <TrendingUpIcon className="h-5 w-5 text-green-500" />
          </div>
          <p className="mt-2 text-3xl font-bold text-green-600 dark:text-green-400">Rs. {totalRevenue.toLocaleString()}</p>
          <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wider font-semibold">From dispatched orders</p>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-bold">Manage Orders</h2>
          <div className="flex border border-border rounded-lg overflow-hidden bg-muted p-1">
            <button 
              onClick={() => setActiveTab('pending')}
              className={`px-4 py-1.5 text-sm font-medium transition-all rounded-md ${activeTab === 'pending' ? 'bg-background text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Pending
            </button>
            <button 
              onClick={() => setActiveTab('shipped')}
              className={`px-4 py-1.5 text-sm font-medium transition-all rounded-md ${activeTab === 'shipped' ? 'bg-background text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Dispatched
            </button>
            <button 
              onClick={() => setActiveTab('delivered')}
              className={`px-4 py-1.5 text-sm font-medium transition-all rounded-md ${activeTab === 'delivered' ? 'bg-background text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Recent Orders
            </button>
          </div>
        </div>
      </div>

      <div className="mt-4 overflow-auto rounded-xl border border-border bg-card shadow-sm">
        {isLoading ? (
          <div className="p-12 text-center text-muted-foreground flex flex-col items-center gap-2">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            Loading orders...
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground flex flex-col items-center gap-3">
             <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center text-muted-foreground/50">
               <Package className="h-6 w-6" />
             </div>
             <div>
               <p className="font-medium text-foreground">No {activeTab} orders found.</p>
               <p className="text-xs">Incoming orders will appear here automatically.</p>
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
              {filteredOrders.map((order: any) => (
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
                       {order.status === 'pending' || !order.status ? (
                         <>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="bg-green-50 text-green-600 border-green-200 hover:bg-[#15a349] hover:text-white hover:border-[#15a349] dark:bg-green-900/10 dark:border-green-800 dark:text-green-400 dark:hover:bg-[#15a349] dark:hover:text-white dark:hover:border-[#15a349] gap-1.5 h-8 font-semibold transition-colors"
                            onClick={() => handleWhatsApp(order)}
                          >
                            <MessageSquare className="h-3.5 w-3.5" /> WhatsApp
                          </Button>
                          <Button 
                            size="sm" 
                            className="bg-primary text-primary-foreground gap-1.5 hover:opacity-90 h-8 font-semibold"
                            onClick={() => handleDispatch(order.id, order.customer_name)}
                          >
                            <Truck className="h-3.5 w-3.5" /> Dispatch
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-8 font-semibold"
                            onClick={() => handleCancel(order.id, order.customer_name)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                         </>
                       ) : order.status === 'shipped' ? (
                         <>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="bg-green-50 text-green-600 border-green-200 hover:bg-[#15a349] hover:text-white hover:border-[#15a349] dark:bg-green-900/10 dark:border-green-800 dark:text-green-400 dark:hover:bg-[#15a349] dark:hover:text-white dark:hover:border-[#15a349] gap-1.5 h-8 font-semibold transition-colors"
                            onClick={() => handleWhatsApp(order)}
                          >
                            <MessageSquare className="h-3.5 w-3.5" /> WhatsApp
                          </Button>
                          <Button 
                            size="sm" 
                            className="bg-primary text-primary-foreground gap-1.5 hover:opacity-90 h-8 font-semibold"
                            onClick={() => handleSuccessful(order.id, order.customer_name)}
                          >
                            <Eye className="h-3.5 w-3.5" /> Mark Successful
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-8 font-semibold"
                            onClick={() => handleCancel(order.id, order.customer_name)}
                          >
                            <X className="h-3.5 w-3.5" />
                          </Button>
                         </>
                       ) : (
                         <>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="bg-green-50 text-green-600 border-green-200 hover:bg-[#15a349] hover:text-white hover:border-[#15a349] dark:bg-green-900/10 dark:border-green-800 dark:text-green-400 dark:hover:bg-[#15a349] dark:hover:text-white dark:hover:border-[#15a349] gap-1.5 h-8 font-semibold transition-colors"
                            onClick={() => handleWhatsApp(order)}
                          >
                            <MessageSquare className="h-3.5 w-3.5" /> WhatsApp
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-8 font-semibold"
                            onClick={() => {
                              if (window.confirm("Archive this recent order?")) {
                                deleteMutation.mutate(order.id);
                              }
                            }}
                          >
                            <X className="h-3.5 w-3.5" />
                          </Button>
                         </>
                       )}
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
              <Badge 
                variant={selectedOrder?.status === 'pending' ? 'secondary' : selectedOrder?.status === 'shipped' ? 'default' : 'outline'} 
                className={`ml-4 capitalize ${selectedOrder?.status === 'shipped' ? 'bg-blue-500 hover:bg-blue-600' : selectedOrder?.status === 'delivered' ? 'bg-green-500 hover:bg-green-600 text-white' : ''}`}
              >
                {selectedOrder?.status === 'shipped' ? 'Dispatched' : selectedOrder?.status === 'delivered' ? 'Successful' : (selectedOrder?.status || 'Processing')}
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
                
                {(!selectedOrder.status || selectedOrder.status === 'pending') && (
                  <Button 
                    className="bg-primary text-primary-foreground gap-1.5 hover:opacity-90"
                    onClick={() => {
                      handleDispatch(selectedOrder.id, selectedOrder.customer_name);
                      setIsModalOpen(false);
                    }}
                    disabled={updateStatusMutation.isPending}
                  >
                    <Truck className="h-4 w-4" /> Dispatch Order
                  </Button>
                )}

                {selectedOrder.status === 'shipped' && (
                  <Button 
                    className="bg-green-600 text-white gap-1.5 hover:bg-green-700"
                    onClick={() => {
                      handleSuccessful(selectedOrder.id, selectedOrder.customer_name);
                      setIsModalOpen(false);
                    }}
                    disabled={updateStatusMutation.isPending}
                  >
                    <Eye className="h-4 w-4" /> Mark as Successful
                  </Button>
                )}

                <Button 
                  variant="destructive" 
                  className="gap-1.5"
                  onClick={() => {
                    handleCancel(selectedOrder.id, selectedOrder.customer_name);
                    setIsModalOpen(false);
                  }}
                  disabled={deleteMutation.isPending}
                >
                  <Trash2 className="h-4 w-4" /> Delete Order
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
