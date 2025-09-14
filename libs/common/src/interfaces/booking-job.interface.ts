import Stripe from 'stripe';

export interface BookingJobInterface {
  stripeEvent: Stripe.Event;
}
