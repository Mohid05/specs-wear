import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, ArrowLeft, CheckCircle2, User, Truck as TruckIcon, Edit2, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

export default function Checkout() {
  const { items, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [isCODChecked, setIsCODChecked] = useState(false);
  const [isReviewing, setIsReviewing] = useState(false);
  const [customerData, setCustomerData] = useState<any>(null);
  const isBookingOrder = items.some(item => item.is_out_of_stock);
  const shippingFee = 200;
  const finalTotal = cartTotal + shippingFee;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      address: formData.get('address') as string,
      city: formData.get('city') as string,
      zip: formData.get('zip') as string,
    };

    // Validation
    const phoneRegex = /^((\+92)|(92)|(0))3\d{2}-?\d{7}$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!phoneRegex.test(data.phone)) {
      toast.error("Please enter a valid Pakistan phone number (e.g., 03001234567)");
      return;
    }

    if (!emailRegex.test(data.email)) {
      toast.error("Please enter a professional email address (e.g., name@example.com)");
      return;
    }

    setCustomerData(data);
    setIsReviewing(true);
    window.scrollTo(0, 0);
  };

  const handleConfirm = async () => {
    setIsSubmitting(true);
    
    try {
      const customerName = `${customerData.firstName} ${customerData.lastName}`;
      const customerEmail = customerData.email;
      const customerPhone = customerData.phone;
      const shippingAddress = `${customerData.address}, ${customerData.city} ${customerData.zip}`;

      // 1. Insert order
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          customer_name: customerName,
          customer_email: customerEmail,
          customer_phone: customerPhone,
          shipping_address: shippingAddress,
          total_amount: finalTotal,
          status: 'pending',
          is_booking: isBookingOrder
        })
        .select('id')
        .single();

      if (orderError) throw orderError;

      // 2. Insert order items
      const orderItems = items.map(item => ({
        order_id: orderData.id,
        product_id: item.id,
        quantity: item.quantity,
        unit_price: item.price
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      setOrderComplete(true);
      clearCart();
      toast.success("Order placed successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to place order.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderComplete) {
    return (
      <div className="container mx-auto px-4 py-24 flex flex-col items-center justify-center text-center">
        <div className="rounded-full bg-primary/10 p-6 mb-6">
          <CheckCircle2 className="h-16 w-16 text-primary" />
        </div>
        <h1 className="font-display text-4xl font-bold text-foreground mb-4">
          {isBookingOrder ? "Booking Confirmed!" : "Order Confirmed!"}
        </h1>
        <p className="text-muted-foreground max-w-md mx-auto mb-8">
          {isBookingOrder 
            ? "Thank you for your booking. Your item will be processed as soon as it is restocked. We will notify you via WhatsApp!"
            : "Thank you for your purchase. We've received your order and will contact you via WhatsApp shortly to coordinate delivery."}
        </p>
        <Link to="/catalog">
          <Button className="bg-gradient-gold shadow-gold">Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-24 flex flex-col items-center justify-center text-center">
        <h1 className="font-display text-3xl font-bold text-foreground mb-4">Your Cart is Empty</h1>
        <p className="text-muted-foreground mb-8">Looks like you haven't added any glasses to your cart yet.</p>
        <Link to="/catalog">
          <Button className="bg-gradient-gold shadow-gold">Browse Collection</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8 flex items-center justify-between">
        <button 
          onClick={() => isReviewing ? setIsReviewing(false) : navigate('/catalog')} 
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> {isReviewing ? "Edit Details" : "Back to Catalog"}
        </button>
        {isReviewing && (
           <span className="text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full">
             Step 2: Review Order
           </span>
        )}
      </div>

      <h1 className="font-display text-4xl font-bold text-foreground mb-8">
        {isReviewing ? "Review Your Order" : "Checkout"}
      </h1>

      {isReviewing ? (
        <div className="grid lg:grid-cols-12 gap-10">
          {/* Review Details Column */}
          <div className="lg:col-span-12 xl:col-span-8">
            <div className="space-y-6">
              {/* Customer & Shipping Summary */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="rounded-xl border border-border bg-card p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-display font-bold text-lg flex items-center gap-2">
                      <User className="h-5 w-5 text-primary" /> Contact Information
                    </h3>
                    <button onClick={() => setIsReviewing(false)} className="text-primary text-xs hover:underline flex items-center gap-1">
                      <Edit2 className="h-3 w-3" /> Edit
                    </button>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-muted-foreground">Name:</span> {customerData.firstName} {customerData.lastName}</p>
                    <p><span className="text-muted-foreground">Email:</span> {customerData.email}</p>
                    <p><span className="text-muted-foreground">Phone:</span> {customerData.phone}</p>
                  </div>
                </div>

                <div className="rounded-xl border border-border bg-card p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-display font-bold text-lg flex items-center gap-2">
                      <TruckIcon className="h-5 w-5 text-primary" /> Shipping Address
                    </h3>
                    <button onClick={() => setIsReviewing(false)} className="text-primary text-xs hover:underline flex items-center gap-1">
                      <Edit2 className="h-3 w-3" /> Edit
                    </button>
                  </div>
                  <div className="text-sm">
                    <p>{customerData.address}</p>
                    <p>{customerData.city}, {customerData.zip}</p>
                  </div>
                </div>
              </div>

              {/* Items Summary Table */}
              <div className="rounded-xl border border-border bg-card overflow-hidden">
                <div className="p-4 border-b border-border bg-secondary/50">
                  <h3 className="font-display font-bold text-lg flex items-center gap-2">
                    <ShoppingBag className="h-5 w-5 text-primary" /> Order Items
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-secondary/30 border-b border-border">
                      <tr>
                        <th className="px-6 py-3 text-left font-medium text-muted-foreground">Product</th>
                        <th className="px-6 py-3 text-center font-medium text-muted-foreground">Quantity</th>
                        <th className="px-6 py-3 text-right font-medium text-muted-foreground">Price</th>
                        <th className="px-6 py-3 text-right font-medium text-muted-foreground">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {items.map((item) => (
                        <tr key={item.id}>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <img src={item.image} alt={item.name} className="h-12 w-12 rounded object-cover border border-border" />
                              <span className="font-medium text-foreground">{item.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center">{item.quantity}</td>
                          <td className="px-6 py-4 text-right">Rs. {item.price.toLocaleString()}</td>
                          <td className="px-6 py-4 text-right font-medium">Rs. {(item.price * item.quantity).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Confirmation Sidebar */}
          <div className="lg:col-span-12 xl:col-span-4 lg:sticky lg:top-24 h-fit">
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <h2 className="font-display text-xl font-bold mb-6 pb-4 border-b border-border">Final Total</h2>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">Rs. {cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Standard shipping(200)</span>
                  <span className="font-medium">Rs. {shippingFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between pt-4 border-t border-border">
                  <span className="font-display font-bold text-lg">Total Amount</span>
                  <span className="font-display font-bold text-xl text-primary font-display tracking-tight">
                    Rs. {finalTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-green-500/5 border border-green-500/10 mb-8">
                <div className="flex gap-3 text-sm text-green-700 dark:text-green-400">
                  <CheckCircle2 className="h-5 w-5 shrink-0" />
                  <p>Cash on Delivery: <strong>Rs. {finalTotal.toLocaleString()}</strong> will be collected at your doorstep.</p>
                </div>
              </div>

              <div className="space-y-3">
                <Button 
                  onClick={handleConfirm}
                  className="w-full bg-gradient-gold shadow-gold text-lg h-14 font-bold"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Placing Order..." : "Confirm & Place Order"}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setIsReviewing(false)}
                  className="w-full h-12"
                  disabled={isSubmitting}
                >
                  Edit Details
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={() => setIsReviewing(false)}
                  className="w-full text-muted-foreground hover:text-destructive transition-colors text-xs"
                  disabled={isSubmitting}
                >
                  Cancel and go back
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-7">
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="p-6 border-b border-border bg-secondary/50">
                <h2 className="font-display text-xl font-bold">Cart Items</h2>
              </div>
              <div className="p-6 flex flex-col gap-6">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 items-center">
                    <div className="h-20 w-20 rounded-lg overflow-hidden border border-border shrink-0">
                      <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.name}</h3>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm text-muted-foreground capitalize">{item.category}</p>
                        {item.is_out_of_stock ? (
                          <span className="inline-block rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
                            Booking Pre-order
                          </span>
                        ) : item.stock_quantity !== undefined && (
                          <span className="inline-block rounded-full bg-green-600/10 px-2 py-0.5 text-[10px] font-semibold text-green-700 dark:text-green-400">
                            {item.stock_quantity} left
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-medium text-primary mt-1">Rs. {item.price.toLocaleString()}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center border border-border rounded-md shrink-0">
                        <button
                          className="px-2 py-1 text-muted-foreground hover:text-foreground"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >-</button>
                        <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                        <button
                          className="px-2 py-1 text-muted-foreground hover:text-foreground"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >+</button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-muted-foreground hover:text-destructive transition-colors shrink-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-card p-6 sticky top-24">
              <h2 className="font-display text-xl font-bold mb-6">Order Summary</h2>

              <div className="flex justify-between mb-4">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">Rs. {cartTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between mb-6 pb-6 border-b border-border">
                <span className="text-muted-foreground">Standard shipping(200)</span>
                <span className="font-medium text-foreground">Rs. {shippingFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between mb-8">
                <span className="font-display font-bold text-lg">Total</span>
                <span className="font-display font-bold text-xl text-primary">Rs. {finalTotal.toLocaleString()}</span>
              </div>

              <div className="space-y-4 mb-8">
                <h3 className="font-medium">Contact Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <Input required defaultValue={customerData?.firstName} name="firstName" placeholder="First Name" />
                  <Input required defaultValue={customerData?.lastName} name="lastName" placeholder="Last Name" />
                </div>
                <Input required defaultValue={customerData?.email} type="email" name="email" placeholder="Email Address" />
                <Input required defaultValue={customerData?.phone} type="tel" name="phone" placeholder="Phone Number (WhatsApp)" />

                <h3 className="font-medium mt-6">Shipping Address</h3>
                <Input required defaultValue={customerData?.address} name="address" placeholder="Street Address" />
                <div className="grid grid-cols-2 gap-4">
                  <Input required defaultValue={customerData?.city} name="city" placeholder="City" />
                  <Input defaultValue={customerData?.zip} name="zip" placeholder="Zip Code (Optional)" />
                </div>
              </div>

              <div className="flex items-start gap-3 mb-8 p-4 rounded-lg bg-primary/5 border border-primary/10">
                <input
                  type="checkbox"
                  id="cod"
                  required
                  className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-primary"
                  checked={isCODChecked}
                  onChange={(e) => setIsCODChecked(e.target.checked)}
                />
                <label htmlFor="cod" className="text-sm font-medium leading-tight cursor-pointer">
                  Cash on Delivery
                  <span className="block text-xs text-muted-foreground mt-1">Pay with cash when your order is delivered to your doorstep.</span>
                </label>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-gold shadow-gold text-lg h-12"
                disabled={isSubmitting || !isCODChecked}
              >
                {isSubmitting ? "Processing..." : isBookingOrder ? "Place Booking" : "Place Order"}
              </Button>
              <p className="text-xs text-center text-muted-foreground mt-4">
                By placing your order, you agree to our Terms of Service.
              </p>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
