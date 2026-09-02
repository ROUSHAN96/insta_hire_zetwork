'use client';

import { useState } from 'react';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  customerInfoSchema,
  shippingAddressSchema,
  checkoutFormSchema,
  type CheckoutFormData,
  type PaymentMethod,
} from '@/types/order';
import { LoadingSpinner } from '@/components/feedback/loading-spinner';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Building,
  Globe,
  CreditCard,
  Banknote,
  QrCode,
  Lock,
  AlertCircle,
  Check,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface CheckoutFormProps {
  onSubmit: (data: CheckoutFormData) => Promise<void>;
  isSubmitting: boolean;
}

type FormErrors = Partial<
  Record<
    | 'customer.name'
    | 'customer.email'
    | 'customer.phone'
    | 'shippingAddress.street'
    | 'shippingAddress.city'
    | 'shippingAddress.state'
    | 'shippingAddress.zipCode'
    | 'shippingAddress.country'
    | 'paymentMethod',
    string
  >
>;

type TouchedFields = Partial<Record<keyof FormErrors, boolean>>;

export function CheckoutForm({ onSubmit, isSubmitting }: CheckoutFormProps) {
  const [formData, setFormData] = useState<CheckoutFormData>({
    customer: { name: '', email: '', phone: '' },
    shippingAddress: { street: '', city: '', state: '', zipCode: '', country: 'India' },
    paymentMethod: 'cod',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<TouchedFields>({});
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // Validate a single field using Zod sub-schemas
  const validateField = (
    section: 'customer' | 'shippingAddress',
    field: string,
    value: string
  ): string | undefined => {
    try {
      if (section === 'customer') {
        const shape = customerInfoSchema.shape;
        const schemaKey = field as keyof typeof shape;
        if (shape[schemaKey]) {
          const res = shape[schemaKey].safeParse(value);
          if (!res.success) {
            return res.error.issues[0]?.message;
          }
        }
      } else if (section === 'shippingAddress') {
        const shape = shippingAddressSchema.shape;
        const schemaKey = field as keyof typeof shape;
        if (shape[schemaKey]) {
          const res = shape[schemaKey].safeParse(value);
          if (!res.success) {
            return res.error.issues[0]?.message;
          }
        }
      }
    } catch {
      // Fallback
    }
    return undefined;
  };

  const handleBlur = (section: 'customer' | 'shippingAddress', field: string) => {
    const errorKey = `${section}.${field}` as keyof FormErrors;
    setTouched((prev) => ({ ...prev, [errorKey]: true }));

    const fieldValue = formData[section][field as keyof typeof formData[typeof section]] as string;
    const fieldError = validateField(section, field, fieldValue);

    setErrors((prev) => {
      const updated = { ...prev };
      if (fieldError) {
        updated[errorKey] = fieldError;
      } else {
        delete updated[errorKey];
      }
      return updated;
    });
  };

  const handleChange = (section: 'customer' | 'shippingAddress', field: string, value: string) => {
    const errorKey = `${section}.${field}` as keyof FormErrors;
    const updatedData: CheckoutFormData = {
      ...formData,
      [section]: {
        ...formData[section],
        [field]: value,
      },
    };
    setFormData(updatedData);

    // If already touched or submitted, validate on keystroke
    if (hasSubmitted || touched[errorKey]) {
      const fieldError = validateField(section, field, value);
      setErrors((prev) => {
        const updated = { ...prev };
        if (fieldError) {
          updated[errorKey] = fieldError;
        } else {
          delete updated[errorKey];
        }
        return updated;
      });
    }
  };

  const handlePaymentMethodChange = (method: PaymentMethod) => {
    setFormData((prev) => ({ ...prev, paymentMethod: method }));
  };

  const validateEntireForm = (data: CheckoutFormData): { valid: boolean; validatedData?: CheckoutFormData } => {
    const result = checkoutFormSchema.safeParse(data);
    if (!result.success) {
      const newErrors: FormErrors = {};
      for (const issue of result.error.issues) {
        const path = issue.path.join('.') as keyof FormErrors;
        if (!newErrors[path]) {
          newErrors[path] = issue.message;
        }
      }
      setErrors(newErrors);
      return { valid: false };
    }

    setErrors({});
    return { valid: true, validatedData: result.data };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setHasSubmitted(true);

    // Mark all fields as touched for visual feedback
    setTouched({
      'customer.name': true,
      'customer.email': true,
      'customer.phone': true,
      'shippingAddress.street': true,
      'shippingAddress.city': true,
      'shippingAddress.state': true,
      'shippingAddress.zipCode': true,
      'shippingAddress.country': true,
    });

    const { valid, validatedData } = validateEntireForm(formData);
    if (valid && validatedData) {
      await onSubmit(validatedData);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-8">
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
            <label htmlFor="customer-name" className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-muted-foreground" /> Full Name <span className="text-destructive">*</span>
            </label>
            <Input
              id="customer-name"
              placeholder="e.g. Roushan Raj"
              value={formData.customer.name}
              onChange={(e) => handleChange('customer', 'name', e.target.value)}
              onBlur={() => handleBlur('customer', 'name')}
              disabled={isSubmitting}
              aria-invalid={Boolean(errors['customer.name'])}
              aria-describedby={errors['customer.name'] ? 'customer-name-error' : undefined}
              className={cn(
                'rounded-xl text-sm h-11 bg-background transition-colors',
                errors['customer.name'] && 'border-destructive focus-visible:ring-destructive/30 bg-destructive/5'
              )}
            />
            {errors['customer.name'] && (
              <p id="customer-name-error" className="text-xs text-destructive font-medium flex items-center gap-1 mt-1">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                {errors['customer.name']}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="customer-email" className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-muted-foreground" /> Email Address <span className="text-destructive">*</span>
              </label>
              <Input
                id="customer-email"
                type="email"
                placeholder="name@domain.com"
                value={formData.customer.email}
                onChange={(e) => handleChange('customer', 'email', e.target.value)}
                onBlur={() => handleBlur('customer', 'email')}
                disabled={isSubmitting}
                aria-invalid={Boolean(errors['customer.email'])}
                aria-describedby={errors['customer.email'] ? 'customer-email-error' : undefined}
                className={cn(
                  'rounded-xl text-sm h-11 bg-background transition-colors',
                  errors['customer.email'] && 'border-destructive focus-visible:ring-destructive/30 bg-destructive/5'
                )}
              />
              {errors['customer.email'] && (
                <p id="customer-email-error" className="text-xs text-destructive font-medium flex items-center gap-1 mt-1">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  {errors['customer.email']}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="customer-phone" className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5 text-muted-foreground" /> Phone Number <span className="text-destructive">*</span>
              </label>
              <Input
                id="customer-phone"
                type="tel"
                placeholder="+91 98765 43210"
                value={formData.customer.phone}
                onChange={(e) => handleChange('customer', 'phone', e.target.value)}
                onBlur={() => handleBlur('customer', 'phone')}
                disabled={isSubmitting}
                aria-invalid={Boolean(errors['customer.phone'])}
                aria-describedby={errors['customer.phone'] ? 'customer-phone-error' : undefined}
                className={cn(
                  'rounded-xl text-sm h-11 bg-background transition-colors',
                  errors['customer.phone'] && 'border-destructive focus-visible:ring-destructive/30 bg-destructive/5'
                )}
              />
              {errors['customer.phone'] && (
                <p id="customer-phone-error" className="text-xs text-destructive font-medium flex items-center gap-1 mt-1">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  {errors['customer.phone']}
                </p>
              )}
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
            <label htmlFor="shipping-street" className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <Building className="h-3.5 w-3.5 text-muted-foreground" /> Street Address / Flat & Building <span className="text-destructive">*</span>
            </label>
            <Input
              id="shipping-street"
              placeholder="e.g. 42 Cyber Tower, 100ft Road, Indiranagar"
              value={formData.shippingAddress.street}
              onChange={(e) => handleChange('shippingAddress', 'street', e.target.value)}
              onBlur={() => handleBlur('shippingAddress', 'street')}
              disabled={isSubmitting}
              aria-invalid={Boolean(errors['shippingAddress.street'])}
              aria-describedby={errors['shippingAddress.street'] ? 'shipping-street-error' : undefined}
              className={cn(
                'rounded-xl text-sm h-11 bg-background transition-colors',
                errors['shippingAddress.street'] && 'border-destructive focus-visible:ring-destructive/30 bg-destructive/5'
              )}
            />
            {errors['shippingAddress.street'] && (
              <p id="shipping-street-error" className="text-xs text-destructive font-medium flex items-center gap-1 mt-1">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                {errors['shippingAddress.street']}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="shipping-city" className="text-xs font-semibold text-foreground">
                City <span className="text-destructive">*</span>
              </label>
              <Input
                id="shipping-city"
                placeholder="e.g. Bengaluru"
                value={formData.shippingAddress.city}
                onChange={(e) => handleChange('shippingAddress', 'city', e.target.value)}
                onBlur={() => handleBlur('shippingAddress', 'city')}
                disabled={isSubmitting}
                aria-invalid={Boolean(errors['shippingAddress.city'])}
                aria-describedby={errors['shippingAddress.city'] ? 'shipping-city-error' : undefined}
                className={cn(
                  'rounded-xl text-sm h-11 bg-background transition-colors',
                  errors['shippingAddress.city'] && 'border-destructive focus-visible:ring-destructive/30 bg-destructive/5'
                )}
              />
              {errors['shippingAddress.city'] && (
                <p id="shipping-city-error" className="text-xs text-destructive font-medium flex items-center gap-1 mt-1">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  {errors['shippingAddress.city']}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="shipping-state" className="text-xs font-semibold text-foreground">
                State / Province <span className="text-destructive">*</span>
              </label>
              <Input
                id="shipping-state"
                placeholder="e.g. Karnataka"
                value={formData.shippingAddress.state}
                onChange={(e) => handleChange('shippingAddress', 'state', e.target.value)}
                onBlur={() => handleBlur('shippingAddress', 'state')}
                disabled={isSubmitting}
                aria-invalid={Boolean(errors['shippingAddress.state'])}
                aria-describedby={errors['shippingAddress.state'] ? 'shipping-state-error' : undefined}
                className={cn(
                  'rounded-xl text-sm h-11 bg-background transition-colors',
                  errors['shippingAddress.state'] && 'border-destructive focus-visible:ring-destructive/30 bg-destructive/5'
                )}
              />
              {errors['shippingAddress.state'] && (
                <p id="shipping-state-error" className="text-xs text-destructive font-medium flex items-center gap-1 mt-1">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  {errors['shippingAddress.state']}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="shipping-zip" className="text-xs font-semibold text-foreground">
                PIN / Postal Code <span className="text-destructive">*</span>
              </label>
              <Input
                id="shipping-zip"
                placeholder="e.g. 560038"
                value={formData.shippingAddress.zipCode}
                onChange={(e) => handleChange('shippingAddress', 'zipCode', e.target.value)}
                onBlur={() => handleBlur('shippingAddress', 'zipCode')}
                disabled={isSubmitting}
                aria-invalid={Boolean(errors['shippingAddress.zipCode'])}
                aria-describedby={errors['shippingAddress.zipCode'] ? 'shipping-zip-error' : undefined}
                className={cn(
                  'rounded-xl text-sm h-11 bg-background transition-colors',
                  errors['shippingAddress.zipCode'] && 'border-destructive focus-visible:ring-destructive/30 bg-destructive/5'
                )}
              />
              {errors['shippingAddress.zipCode'] && (
                <p id="shipping-zip-error" className="text-xs text-destructive font-medium flex items-center gap-1 mt-1">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  {errors['shippingAddress.zipCode']}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="shipping-country" className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Globe className="h-3.5 w-3.5 text-muted-foreground" /> Country <span className="text-destructive">*</span>
              </label>
              <Input
                id="shipping-country"
                placeholder="India"
                value={formData.shippingAddress.country}
                onChange={(e) => handleChange('shippingAddress', 'country', e.target.value)}
                onBlur={() => handleBlur('shippingAddress', 'country')}
                disabled={isSubmitting}
                aria-invalid={Boolean(errors['shippingAddress.country'])}
                aria-describedby={errors['shippingAddress.country'] ? 'shipping-country-error' : undefined}
                className={cn(
                  'rounded-xl text-sm h-11 bg-background transition-colors',
                  errors['shippingAddress.country'] && 'border-destructive focus-visible:ring-destructive/30 bg-destructive/5'
                )}
              />
              {errors['shippingAddress.country'] && (
                <p id="shipping-country-error" className="text-xs text-destructive font-medium flex items-center gap-1 mt-1">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  {errors['shippingAddress.country']}
                </p>
              )}
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
              <CardTitle className="text-lg font-bold text-foreground">Payment Mode</CardTitle>
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
              onClick={() => handlePaymentMethodChange('cod')}
              className={cn(
                'p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-3 relative select-none',
                formData.paymentMethod === 'cod'
                  ? 'border-primary bg-primary/5 shadow-2xs'
                  : 'border-border/60 hover:border-border bg-background'
              )}
            >
              <div className="flex items-center justify-between">
                <Banknote className="h-5 w-5 text-primary" />
                {formData.paymentMethod === 'cod' && (
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
              onClick={() => handlePaymentMethodChange('upi')}
              className={cn(
                'p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-3 relative select-none',
                formData.paymentMethod === 'upi'
                  ? 'border-primary bg-primary/5 shadow-2xs'
                  : 'border-border/60 hover:border-border bg-background'
              )}
            >
              <div className="flex items-center justify-between">
                <QrCode className="h-5 w-5 text-primary" />
                {formData.paymentMethod === 'upi' && (
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
              onClick={() => handlePaymentMethodChange('card')}
              className={cn(
                'p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-3 relative select-none',
                formData.paymentMethod === 'card'
                  ? 'border-primary bg-primary/5 shadow-2xs'
                  : 'border-border/60 hover:border-border bg-background'
              )}
            >
              <div className="flex items-center justify-between">
                <CreditCard className="h-5 w-5 text-primary" />
                {formData.paymentMethod === 'card' && (
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
            <span>Securing & Placing Order...</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            <span>Place Order</span>
          </div>
        )}
      </Button>
    </form>
  );
}
