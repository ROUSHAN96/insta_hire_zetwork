import Link from 'next/link';
import { CheckCircle, Package, Truck } from 'lucide-react';
import { orderRepository } from '@/repositories/order.repository';
import { formatPrice } from '@/lib/format';
import { formatDate } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { FREE_SHIPPING_THRESHOLD, SHIPPING_COST } from '@/lib/constants';

export default async function OrderConfirmationPage(props: PageProps<'/order-confirmation/[id]'>) {
  const { id } = await props.params;
  const order = await orderRepository.getById(id);

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-md text-center">
        <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <Package className="h-8 w-8 text-muted-foreground" />
        </div>
        <h1 className="mb-2 text-2xl font-bold">Order Not Found</h1>
        <p className="mb-8 text-muted-foreground">
          The requested order could not be found. Please check your order ID or contact support.
        </p>
        <Link href="/" className={buttonVariants({ className: 'w-full' })}>
          Continue Shopping
        </Link>
      </div>
    );
  }

  const subtotal = order.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-10">
        <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
          <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-500" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Thank you for your order!</h1>
        <p className="text-muted-foreground">
          We&apos;ve received your order and will begin processing it right away.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Package className="mr-2 h-4 w-4" /> Order Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Order ID</span>
              <span className="font-medium font-mono text-xs">{order.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Date</span>
              <span className="font-medium">{formatDate(order.createdAt)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status</span>
              <span className="font-medium capitalize">{order.status}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Truck className="mr-2 h-4 w-4" /> Shipping Address
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            <div className="font-medium mb-1">{order.customer.name}</div>
            <div className="text-muted-foreground">
              {order.shippingAddress.street}<br />
              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}<br />
              {order.shippingAddress.country}
            </div>
            <div className="mt-4 text-muted-foreground">
              {order.customer.email}<br />
              {order.customer.phone}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Order Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item.product.id} className="flex items-start justify-between">
                <div className="flex-1">
                  <span className="font-medium">{item.product.name}</span>
                  <span className="text-muted-foreground ml-2">x{item.quantity}</span>
                </div>
                <div className="font-medium">
                  {formatPrice(item.product.price * item.quantity)}
                </div>
              </div>
            ))}
          </div>

          <Separator className="my-6" />

          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Shipping</span>
              <span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>{formatPrice(order.totalPrice)}</span>
          </div>
        </CardContent>
        <CardFooter className="bg-muted/50 flex justify-center py-6 rounded-b-xl border-t">
          <Link
            href="/"
            className={buttonVariants({ size: 'lg', className: 'w-full sm:w-auto px-8' })}
          >
            Continue Shopping
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
