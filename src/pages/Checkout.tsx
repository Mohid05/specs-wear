import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, ArrowLeft, CheckCircle2 } from "lucide-react";
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const formData = new FormData(e.currentTarget);
      const customerName = `${formData.get('firstName')} ${formData.get('lastName')}`;
      const customerEmail = formData.get('email') as string;
      const customerPhone = formData.get('phone') as string;
      const shippingAddress = `${formData.get('address')}, ${formData.get('city')} ${formData.get('zip')}`;

      // 1. Insert order
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          customer_name: customerName,
          customer_email: customerEmail,
          customer_phone: customerPhone,
          shipping_address: shippingAddress,
          total_amount: cartTotal,
          status: 'pending'
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
        <h1 className="font-display text-4xl font-bold text-foreground mb-4">Order Confirmed!</h1>
        <p className="text-muted-foreground max-w-md mx-auto mb-8">
          Thank you for your purchase. We've received your order and will contact you via WhatsApp shortly to coordinate delivery.
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
      <Link to="/catalog" className="mb-8 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to Catalog
      </Link>
      
      <h1 className="font-display text-4xl font-bold text-foreground mb-8">Checkout</h1>
      
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
                      {item.stock_quantity !== undefined && (
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
              <span className="text-muted-foreground">Shipping</span>
              <span className="font-medium text-green-600">Free</span>
            </div>
            <div className="flex justify-between mb-8">
              <span className="font-display font-bold text-lg">Total</span>
              <span className="font-display font-bold text-xl text-primary">Rs. {cartTotal.toLocaleString()}</span>
            </div>

            <div className="space-y-4 mb-8">
              <h3 className="font-medium">Contact Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <Input required name="firstName" placeholder="First Name" />
                <Input required name="lastName" placeholder="Last Name" />
              </div>
              <Input required type="email" name="email" placeholder="Email Address" />
              <Input required type="tel" name="phone" placeholder="Phone Number (WhatsApp)" />
              
              <h3 className="font-medium mt-6">Shipping Address</h3>
              <Input required name="address" placeholder="Street Address" />
              <div className="grid grid-cols-2 gap-4">
                <Input required name="city" placeholder="City" />
                <Input required name="zip" placeholder="Zip Code" />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-gradient-gold shadow-gold text-lg h-12"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Processing..." : "Place Order"}
            </Button>
            <p className="text-xs text-center text-muted-foreground mt-4">
              By placing your order, you agree to our Terms of Service. Note: This is a hypothetical checkout.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
