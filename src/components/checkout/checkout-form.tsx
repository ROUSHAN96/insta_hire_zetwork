'use client';

import { useState } from 'react';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { checkoutFormSchema, type CheckoutFormData } from '@/types/order';
import { LoadingSpinner } from '@/components/feedback/loading-spinner';

interface CheckoutFormProps {
  onSubmit: (data: CheckoutFormData) => Promise<void>;
  isSubmitting: boolean;
}

export function CheckoutForm({ onSubmit, isSubmitting }: CheckoutFormProps) {
  const [formData, setFormData] = useState<CheckoutFormData>({
    customer: { name: '', email: '', phone: '' },
    shippingAddress: { street: '', city: '', state: '', zipCode: '', country: 'India' }
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const handleChange = (section: keyof CheckoutFormData, field: string, value: string) => {
    const updatedData = {
      ...formData,
      [section]: {
        ...formData[section],
        [field]: value
      }
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
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
          <CardDescription>We&apos;ll use this to update you on your order.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="customer.name" className="text-sm font-medium leading-none">Full Name</label>
            <Input
              id="customer.name"
              placeholder="John Doe"
              value={formData.customer.name}
              onChange={(e) => handleChange('customer', 'name', e.target.value)}
              disabled={isSubmitting}
            />
            {errors['customer.name'] && <p className="text-sm text-destructive">{errors['customer.name']}</p>}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="customer.email" className="text-sm font-medium leading-none">Email</label>
              <Input
                id="customer.email"
                type="email"
                placeholder="john@example.com"
                value={formData.customer.email}
                onChange={(e) => handleChange('customer', 'email', e.target.value)}
                disabled={isSubmitting}
              />
              {errors['customer.email'] && <p className="text-sm text-destructive">{errors['customer.email']}</p>}
            </div>
            <div className="space-y-2">
              <label htmlFor="customer.phone" className="text-sm font-medium leading-none">Phone Number</label>
              <Input
                id="customer.phone"
                type="tel"
                placeholder="987654321"
                value={formData.customer.phone}
                onChange={(e) => handleChange('customer', 'phone', e.target.value)}
                disabled={isSubmitting}
              />
              {errors['customer.phone'] && <p className="text-sm text-destructive">{errors['customer.phone']}</p>}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Shipping Address</CardTitle>
          <CardDescription>Where should we send your order?</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="shippingAddress.street" className="text-sm font-medium leading-none">Street Address</label>
            <Input
              id="shippingAddress.street"
              placeholder="123 Main St"
              value={formData.shippingAddress.street}
              onChange={(e) => handleChange('shippingAddress', 'street', e.target.value)}
              disabled={isSubmitting}
            />
            {errors['shippingAddress.street'] && <p className="text-sm text-destructive">{errors['shippingAddress.street']}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="shippingAddress.city" className="text-sm font-medium leading-none">City</label>
              <Input
                id="shippingAddress.city"
                placeholder="Bengaluru"
                value={formData.shippingAddress.city}
                onChange={(e) => handleChange('shippingAddress', 'city', e.target.value)}
                disabled={isSubmitting}
              />
              {errors['shippingAddress.city'] && <p className="text-sm text-destructive">{errors['shippingAddress.city']}</p>}
            </div>
            
            <div className="space-y-2">
              <label htmlFor="shippingAddress.state" className="text-sm font-medium leading-none">State / Province</label>
              <Input
                id="shippingAddress.state"
                placeholder="Karnataka"
                value={formData.shippingAddress.state}
                onChange={(e) => handleChange('shippingAddress', 'state', e.target.value)}
                disabled={isSubmitting}
              />
              {errors['shippingAddress.state'] && <p className="text-sm text-destructive">{errors['shippingAddress.state']}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="shippingAddress.zipCode" className="text-sm font-medium leading-none">PIN / Postal Code</label>
              <Input
                id="shippingAddress.zipCode"
                placeholder="560001"
                value={formData.shippingAddress.zipCode}
                onChange={(e) => handleChange('shippingAddress', 'zipCode', e.target.value)}
                disabled={isSubmitting}
              />
              {errors['shippingAddress.zipCode'] && <p className="text-sm text-destructive">{errors['shippingAddress.zipCode']}</p>}
            </div>
            
            <div className="space-y-2">
              <label htmlFor="shippingAddress.country" className="text-sm font-medium leading-none">Country</label>
              <Input
                id="shippingAddress.country"
                placeholder="India"
                value={formData.shippingAddress.country}
                onChange={(e) => handleChange('shippingAddress', 'country', e.target.value)}
                disabled={isSubmitting}
              />
              {errors['shippingAddress.country'] && <p className="text-sm text-destructive">{errors['shippingAddress.country']}</p>}
            </div>
          </div>
        </CardContent>
      </Card>

      <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <div className="flex items-center gap-2">
            <LoadingSpinner size="sm" />
            <span>Processing Order...</span>
          </div>
        ) : (
          'Place Order'
        )}
      </Button>
    </form>
  );
}
