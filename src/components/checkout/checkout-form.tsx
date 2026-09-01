'use client';

import { useState } from 'react';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { checkoutFormSchema, type CheckoutFormData } from '@/types/order';
import { LoadingSpinner } from '@/components/feedback/loading-spinner';
import { User, Mail, Phone, MapPin, Building, Globe, CreditCard, Banknote, QrCode, Lock, ShieldCheck, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CheckoutFormProps {
  onSubmit: (data: CheckoutFormData) => Promise<void>;
  isSubmitting: boolean;
}

export function CheckoutForm({ onSubmit, isSubmitting }: CheckoutFormProps) {
  const [formData, setFormData] = useState<CheckoutFormData>({
    customer: { name: '', email: '', phone: '' },
    shippingAddress: { street: '', city: '', state: '', zipCode: '', country: 'India' },
  });

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'cod'>('cod');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const handleChange = (section: keyof CheckoutFormData, field: string, value: string) => {
    const updatedData = {
      ...formData,
      [section]: {
        ...formData[section],
        [field]: value,
      },
    };
    setFormData(updatedData);

    if (hasSubmitted) {
      validate(updatedData);
    }
  };

  const validate = (data: CheckoutFormData) => {
    try {
      checkoutFormSchema.parse(data);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        for (const issue of error.issues) {
          if (issue.path.length > 1) {
            newErrors[`${String(issue.path[0])}.${String(issue.path[1])}`] = issue.message;
          }
        }
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setHasSubmitted(true);

    if (validate(formData)) {
      await onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* 1. Contact Information Card */}
      <Card className="rounded-3xl border-border/50 bg-card shadow-sm overflow-hidden">
        <CardHeader className="p-6 pb-4 border-b border-border/40 bg-muted/20">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <User className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold text-foreground">Contact Information</CardTitle>
              <CardDescription className="text-xs text-muted-foreground mt-0.5">
                We&apos;ll send order updates and invoice details to this email and phone.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="customer.name" className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-muted-foreground" /> Full Name
            </label>
            <Input
              id="customer.name"
              placeholder="e.g. Roushan Raj"
              value={formData.customer.name}
              onChange={(e) => handleChange('customer', 'name', e.target.value)}
              disabled={isSubmitting}
              className={cn(
                'rounded-xl text-sm h-11 bg-background',
                errors['customer.name'] && 'border-destructive focus-visible:ring-destructive/30'
              )}
            />
            {errors['customer.name'] && <p className="text-xs text-destructive font-medium">{errors['customer.name']}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="customer.email" className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-muted-foreground" /> Email Address
              </label>
              <Input
                id="customer.email"
                type="email"
                placeholder="name@domain.com"
                value={formData.customer.email}
                onChange={(e) => handleChange('customer', 'email', e.target.value)}
                disabled={isSubmitting}
                className={cn(
                  'rounded-xl text-sm h-11 bg-background',
                  errors['customer.email'] && 'border-destructive focus-visible:ring-destructive/30'
                )}
              />
              {errors['customer.email'] && <p className="text-xs text-destructive font-medium">{errors['customer.email']}</p>}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="customer.phone" className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5 text-muted-foreground" /> Phone Number
              </label>
              <Input
                id="customer.phone"
                type="tel"
                placeholder="+91 98765 43210"
                value={formData.customer.phone}
                onChange={(e) => handleChange('customer', 'phone', e.target.value)}
                disabled={isSubmitting}
                className={cn(
                  'rounded-xl text-sm h-11 bg-background',
                  errors['customer.phone'] && 'border-destructive focus-visible:ring-destructive/30'
                )}
              />
              {errors['customer.phone'] && <p className="text-xs text-destructive font-medium">{errors['customer.phone']}</p>}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. Shipping Address Card */}
      <Card className="rounded-3xl border-border/50 bg-card shadow-sm overflow-hidden">
        <CardHeader className="p-6 pb-4 border-b border-border/40 bg-muted/20">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold text-foreground">Shipping Address</CardTitle>
              <CardDescription className="text-xs text-muted-foreground mt-0.5">
                Where should we deliver your package?
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="shippingAddress.street" className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <Building className="h-3.5 w-3.5 text-muted-foreground" /> Street Address / Flat & Building
            </label>
            <Input
              id="shippingAddress.street"
              placeholder="e.g. 42 Cyber Tower, 100ft Road, Indiranagar"
              value={formData.shippingAddress.street}
              onChange={(e) => handleChange('shippingAddress', 'street', e.target.value)}
              disabled={isSubmitting}
              className={cn(
                'rounded-xl text-sm h-11 bg-background',
                errors['shippingAddress.street'] && 'border-destructive focus-visible:ring-destructive/30'
              )}
            />
            {errors['shippingAddress.street'] && <p className="text-xs text-destructive font-medium">{errors['shippingAddress.street']}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="shippingAddress.city" className="text-xs font-semibold text-foreground">City</label>
              <Input
                id="shippingAddress.city"
                placeholder="e.g. Bengaluru"
                value={formData.shippingAddress.city}
                onChange={(e) => handleChange('shippingAddress', 'city', e.target.value)}
                disabled={isSubmitting}
                className={cn(
                  'rounded-xl text-sm h-11 bg-background',
                  errors['shippingAddress.city'] && 'border-destructive focus-visible:ring-destructive/30'
                )}
              />
              {errors['shippingAddress.city'] && <p className="text-xs text-destructive font-medium">{errors['shippingAddress.city']}</p>}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="shippingAddress.state" className="text-xs font-semibold text-foreground">State / Province</label>
              <Input
                id="shippingAddress.state"
                placeholder="e.g. Karnataka"
                value={formData.shippingAddress.state}
                onChange={(e) => handleChange('shippingAddress', 'state', e.target.value)}
                disabled={isSubmitting}
                className={cn(
                  'rounded-xl text-sm h-11 bg-background',
                  errors['shippingAddress.state'] && 'border-destructive focus-visible:ring-destructive/30'
                )}
              />
              {errors['shippingAddress.state'] && <p className="text-xs text-destructive font-medium">{errors['shippingAddress.state']}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="shippingAddress.zipCode" className="text-xs font-semibold text-foreground">PIN / Postal Code</label>
              <Input
                id="shippingAddress.zipCode"
                placeholder="e.g. 560038"
                value={formData.shippingAddress.zipCode}
                onChange={(e) => handleChange('shippingAddress', 'zipCode', e.target.value)}
                disabled={isSubmitting}
                className={cn(
                  'rounded-xl text-sm h-11 bg-background',
                  errors['shippingAddress.zipCode'] && 'border-destructive focus-visible:ring-destructive/30'
                )}
              />
              {errors['shippingAddress.zipCode'] && <p className="text-xs text-destructive font-medium">{errors['shippingAddress.zipCode']}</p>}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="shippingAddress.country" className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Globe className="h-3.5 w-3.5 text-muted-foreground" /> Country
              </label>
              <Input
                id="shippingAddress.country"
                placeholder="India"
                value={formData.shippingAddress.country}
                onChange={(e) => handleChange('shippingAddress', 'country', e.target.value)}
                disabled={isSubmitting}
                className={cn(
                  'rounded-xl text-sm h-11 bg-background',
                  errors['shippingAddress.country'] && 'border-destructive focus-visible:ring-destructive/30'
                )}
              />
              {errors['shippingAddress.country'] && <p className="text-xs text-destructive font-medium">{errors['shippingAddress.country']}</p>}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 3. Payment Method Selection */}
      <Card className="rounded-3xl border-border/50 bg-card shadow-sm overflow-hidden">
        <CardHeader className="p-6 pb-4 border-b border-border/40 bg-muted/20">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <CreditCard className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold text-foreground">Payment Method</CardTitle>
              <CardDescription className="text-xs text-muted-foreground mt-0.5">
                Choose your preferred payment mode for this order.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Cash on Delivery */}
            <div
              onClick={() => setPaymentMethod('cod')}
              className={cn(
                'p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-3 relative select-none',
                paymentMethod === 'cod'
                  ? 'border-primary bg-primary/5 shadow-2xs'
                  : 'border-border/60 hover:border-border bg-background'
              )}
            >
              <div className="flex items-center justify-between">
                <Banknote className="h-5 w-5 text-primary" />
                {paymentMethod === 'cod' && (
                  <div className="size-4 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                    <Check className="h-2.5 w-2.5" />
                  </div>
                )}
              </div>
              <div>
                <span className="text-xs font-bold block text-foreground">Cash On Delivery</span>
                <span className="text-[11px] text-muted-foreground">Pay on arrival</span>
              </div>
            </div>

            {/* UPI */}
            <div
              onClick={() => setPaymentMethod('upi')}
              className={cn(
                'p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-3 relative select-none',
                paymentMethod === 'upi'
                  ? 'border-primary bg-primary/5 shadow-2xs'
                  : 'border-border/60 hover:border-border bg-background'
              )}
            >
              <div className="flex items-center justify-between">
                <QrCode className="h-5 w-5 text-primary" />
                {paymentMethod === 'upi' && (
                  <div className="size-4 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                    <Check className="h-2.5 w-2.5" />
                  </div>
                )}
              </div>
              <div>
                <span className="text-xs font-bold block text-foreground">UPI / QR</span>
                <span className="text-[11px] text-muted-foreground">GPay, PhonePe, Paytm</span>
              </div>
            </div>

            {/* Card */}
            <div
              onClick={() => setPaymentMethod('card')}
              className={cn(
                'p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-3 relative select-none',
                paymentMethod === 'card'
                  ? 'border-primary bg-primary/5 shadow-2xs'
                  : 'border-border/60 hover:border-border bg-background'
              )}
            >
              <div className="flex items-center justify-between">
                <CreditCard className="h-5 w-5 text-primary" />
                {paymentMethod === 'card' && (
                  <div className="size-4 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                    <Check className="h-2.5 w-2.5" />
                  </div>
                )}
              </div>
              <div>
                <span className="text-xs font-bold block text-foreground">Credit / Debit Card</span>
                <span className="text-[11px] text-muted-foreground">Visa, Master, RuPay</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <Button
        type="submit"
        size="lg"
        className="w-full h-14 rounded-2xl text-base font-bold shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <div className="flex items-center gap-2">
            <LoadingSpinner size="sm" />
            <span>Securing & Processing Order...</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            <span>Place Order Now</span>
          </div>
        )}
      </Button>
    </form>
  );
}
