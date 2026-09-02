import Link from 'next/link';
import Image from 'next/image';
import { CheckCircle, Package, Truck, ArrowRight, ShieldCheck, Clock, MapPin, Mail, Phone, Calendar, User } from 'lucide-react';
import { orderRepository } from '@/repositories/order.repository';
import { formatPrice } from '@/lib/format';
import { formatDate } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { FREE_SHIPPING_THRESHOLD, SHIPPING_COST } from '@/lib/constants';
import { OrderConfirmationActions } from '@/components/checkout/order-confirmation-actions';
import { OrderConfirmationToast } from '@/components/checkout/order-confirmation-toast';

export default async function OrderConfirmationPage(props: PageProps<'/order-confirmation/[id]'>) {
  const { id } = await props.params;
  const order = await orderRepository.getById(id);

  if (!order) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center container mx-auto px-4 py-16 max-w-md text-center">
        <div className="space-y-4">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-muted/80 text-muted-foreground border border-border/60">
            <Package className="h-10 w-10" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Order Not Found</h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The requested order ID could not be located. Please verify the link or check your email confirmation.
          </p>
          <Link href="/" className={buttonVariants({ className: 'rounded-xl mt-2 w-full font-semibold' })}>
            Back to Store
          </Link>
        </div>
      </div>
    );
  }

  const subtotal = order.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;

  return (
    <div className="min-h-screen pb-20">
      {/* Trigger single clean toast notification */}
      <OrderConfirmationToast customerEmail={order.customer.email} />

      <div className="container mx-auto max-w-5xl px-4 sm:px-8 pt-10">
        {/* Celebration Header */}
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto space-y-4 mb-10">
          <div className="flex size-16 items-center justify-center rounded-3xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-2 border-emerald-500/30 shadow-md">
            <CheckCircle className="h-9 w-9 stroke-[2.5]" />
          </div>

          <div className="space-y-1.5">
            <Badge variant="secondary" className="text-xs font-semibold px-3 py-1 rounded-full bg-secondary text-secondary-foreground">
              Order Confirmed
            </Badge>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Thank You For Your Order!
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              We&apos;ve received your order and sent a confirmation summary to <span className="font-semibold text-foreground">{order.customer.email}</span>.
            </p>
          </div>

          <OrderConfirmationActions orderId={order.id} />
        </div>

        {/* Order Status Tracker Timeline */}
        <div className="mb-10 p-6 rounded-3xl bg-card border border-border/50 shadow-xs">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-6">
            Delivery Status
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-xs shadow-xs">
                ✓
              </div>
              <div>
                <span className="text-xs font-bold text-foreground block">Order Placed</span>
                <span className="text-[11px] text-muted-foreground">{formatDate(order.createdAt)}</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-xs shadow-xs">
                ✓
              </div>
              <div>
                <span className="text-xs font-bold text-foreground block">Payment Verified</span>
                <span className="text-[11px] text-muted-foreground">Confirmed</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="flex size-9 items-center justify-center rounded-xl bg-secondary text-foreground font-bold text-xs border border-border/60">
                <Clock className="h-4 w-4 text-primary" />
              </div>
              <div>
                <span className="text-xs font-bold text-foreground block">Processing</span>
                <span className="text-[11px] text-muted-foreground">In Warehouse</span>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="flex size-9 items-center justify-center rounded-xl bg-muted text-muted-foreground font-bold text-xs">
                <Truck className="h-4 w-4" />
              </div>
              <div>
                <span className="text-xs font-semibold text-muted-foreground block">Out for Delivery</span>
                <span className="text-[11px] text-muted-foreground">Est. 2-4 days</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2-Column Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Order Details Card */}
          <Card className="rounded-3xl border-border/50 bg-card shadow-sm overflow-hidden">
            <CardHeader className="p-6 pb-4 border-b border-border/40 bg-muted/20">
              <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                <Package className="h-4 w-4 text-primary" /> Order Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-3.5 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground text-xs">Reference ID</span>
                <span className="font-mono text-xs font-bold text-foreground bg-secondary px-2.5 py-1 rounded-lg">
                  {order.id}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground text-xs flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" /> Placed Date
                </span>
                <span className="font-medium text-foreground text-xs">{formatDate(order.createdAt)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground text-xs">Status</span>
                <Badge variant="secondary" className="text-xs capitalize font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                  {order.status}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Address Card */}
          <Card className="rounded-3xl border-border/50 bg-card shadow-sm overflow-hidden">
            <CardHeader className="p-6 pb-4 border-b border-border/40 bg-muted/20">
              <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                <Truck className="h-4 w-4 text-primary" /> Destination & Recipient
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-2 text-xs">
              <div className="font-bold text-sm text-foreground flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-muted-foreground" /> {order.customer.name}
              </div>
              <div className="text-muted-foreground leading-relaxed pt-1">
                {order.shippingAddress.street}<br />
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}<br />
                {order.shippingAddress.country}
              </div>
              <div className="pt-2 border-t border-border/40 flex flex-col gap-1 text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Mail className="h-3 w-3 text-muted-foreground" /> {order.customer.email}
                </span>
                <span className="flex items-center gap-1.5">
                  <Phone className="h-3 w-3 text-muted-foreground" /> {order.customer.phone}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Itemized Order Receipt Card */}
        <Card className="rounded-3xl border-border/50 bg-card shadow-sm overflow-hidden">
          <CardHeader className="p-6 pb-4 border-b border-border/40 bg-muted/20">
            <CardTitle className="text-lg font-bold text-foreground">
              Itemized Receipt
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-5">
            <div className="space-y-4 divide-y divide-border/30">
              {order.items.map((item) => (
                <div key={item.product.id} className="pt-4 first:pt-0 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="relative h-14 w-14 shrink-0 rounded-xl overflow-hidden bg-muted/60 border border-border/50">
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-sm text-foreground truncate">{item.product.name}</h4>
                      <p className="text-xs text-muted-foreground">
                        Qty: <span className="font-semibold text-foreground">{item.quantity}</span> × {formatPrice(item.product.price)}
                      </p>
                    </div>
                  </div>
                  <div className="font-bold text-sm text-foreground shrink-0">
                    {formatPrice(item.product.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>

            <Separator className="border-border/60" />

            {/* Price Calculations */}
            <div className="space-y-2 text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-foreground">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping Cost</span>
                <span>
                  {shipping === 0 ? (
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-md">
                      FREE
                    </span>
                  ) : (
                    <span className="font-semibold text-foreground">{formatPrice(shipping)}</span>
                  )}
                </span>
              </div>
            </div>

            <Separator className="border-border/60" />

            <div className="flex justify-between items-baseline pt-1">
              <div>
                <span className="text-base font-bold text-foreground">Total Paid</span>
                <p className="text-[11px] text-muted-foreground">All taxes included</p>
              </div>
              <span className="text-2xl font-extrabold tracking-tight text-foreground">
                {formatPrice(order.totalPrice)}
              </span>
            </div>
          </CardContent>

          <div className="bg-muted/30 p-6 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-muted-foreground flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              <span>Backed by 30-Day Customer Satisfaction Guarantee</span>
            </div>
            <Link
              href="/"
              className={buttonVariants({ size: 'lg', className: 'rounded-2xl font-bold px-8 shadow-md w-full sm:w-auto' })}
            >
              <span>Continue Shopping</span>
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
