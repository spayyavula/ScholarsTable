// Stripe Service for handling subscription payments
// This would integrate with your backend API in a real implementation

export interface SubscriptionPlan {
  id: string;
  name: string;
  priceId: string;
  price: number;
  interval: 'month' | 'year';
  features: string[];
}

export interface Customer {
  id: string;
  email: string;
  name: string;
  subscriptionId?: string;
  subscriptionStatus?: 'active' | 'canceled' | 'past_due' | 'incomplete';
  currentPlan?: string;
}

export interface PaymentIntent {
  id: string;
  clientSecret: string;
  status: 'requires_payment_method' | 'requires_confirmation' | 'succeeded' | 'canceled';
}

class StripeService {
  private apiUrl = '/api/stripe'; // Your backend API endpoint

  async createCheckoutSession(priceId: string, customerEmail: string): Promise<{ sessionId: string; url: string }> {
    try {
      const response = await fetch(`${this.apiUrl}/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          customerEmail,
          successUrl: `${window.location.origin}/subscription/success`,
          cancelUrl: `${window.location.origin}/subscription/canceled`,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      throw error;
    }
  }

  async createPaymentIntent(amount: number, currency: string = 'usd'): Promise<PaymentIntent> {
    try {
      const response = await fetch(`${this.apiUrl}/create-payment-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount * 100, // Convert to cents
          currency,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create payment intent');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw error;
    }
  }

  async getCustomer(customerId: string): Promise<Customer> {
    try {
      const response = await fetch(`${this.apiUrl}/customer/${customerId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch customer');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching customer:', error);
      throw error;
    }
  }

  async updateSubscription(subscriptionId: string, newPriceId: string): Promise<void> {
    try {
      const response = await fetch(`${this.apiUrl}/update-subscription`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscriptionId,
          newPriceId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update subscription');
      }
    } catch (error) {
      console.error('Error updating subscription:', error);
      throw error;
    }
  }

  async cancelSubscription(subscriptionId: string): Promise<void> {
    try {
      const response = await fetch(`${this.apiUrl}/cancel-subscription`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscriptionId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to cancel subscription');
      }
    } catch (error) {
      console.error('Error canceling subscription:', error);
      throw error;
    }
  }

  async getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
    try {
      const response = await fetch(`${this.apiUrl}/plans`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch subscription plans');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching subscription plans:', error);
      throw error;
    }
  }

  async createCustomerPortalSession(customerId: string): Promise<{ url: string }> {
    try {
      const response = await fetch(`${this.apiUrl}/create-portal-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId,
          returnUrl: window.location.origin,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create portal session');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating portal session:', error);
      throw error;
    }
  }

  // Webhook handler for Stripe events (backend implementation)
  async handleWebhook(event: any): Promise<void> {
    switch (event.type) {
      case 'customer.subscription.created':
        await this.handleSubscriptionCreated(event.data.object);
        break;
      case 'customer.subscription.updated':
        await this.handleSubscriptionUpdated(event.data.object);
        break;
      case 'customer.subscription.deleted':
        await this.handleSubscriptionDeleted(event.data.object);
        break;
      case 'invoice.payment_succeeded':
        await this.handlePaymentSucceeded(event.data.object);
        break;
      case 'invoice.payment_failed':
        await this.handlePaymentFailed(event.data.object);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  }

  private async handleSubscriptionCreated(subscription: any): Promise<void> {
    // Update user's subscription status in your database
    // Send welcome email via Constant Contact
    console.log('Subscription created:', subscription);
  }

  private async handleSubscriptionUpdated(subscription: any): Promise<void> {
    // Update user's subscription status in your database
    console.log('Subscription updated:', subscription);
  }

  private async handleSubscriptionDeleted(subscription: any): Promise<void> {
    // Update user's subscription status in your database
    // Send cancellation email via Constant Contact
    console.log('Subscription deleted:', subscription);
  }

  private async handlePaymentSucceeded(invoice: any): Promise<void> {
    // Send payment confirmation email
    console.log('Payment succeeded:', invoice);
  }

  private async handlePaymentFailed(invoice: any): Promise<void> {
    // Send payment failure notification
    console.log('Payment failed:', invoice);
  }
}

export const stripeService = new StripeService();