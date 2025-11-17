import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { query } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY environment variable is required');
}

if (!process.env.STRIPE_WEBHOOK_SECRET) {
  throw new Error('STRIPE_WEBHOOK_SECRET environment variable is required');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-11-20.acacia',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'No signature provided' },
        { status: 400 }
      );
    }

    // Verify webhook signature
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        const tier = session.metadata?.tier;

        if (!userId || !tier) {
          console.error('Missing metadata in checkout session');
          break;
        }

        // Update user tier
        await query('UPDATE users SET tier = $1 WHERE id = $2', [tier, userId]);

        // For premium subscriptions, set subscription end date
        if (tier === 'premium' && session.subscription) {
          const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
          );
          const endDate = new Date(subscription.current_period_end * 1000);

          await query(
            `UPDATE users
             SET subscription_end_date = $1,
                 stripe_subscription_id = $2,
                 pec_enabled = true
             WHERE id = $3`,
            [endDate, subscription.id, userId]
          );
        }

        // Record payment transaction
        await query(
          `INSERT INTO payment_transactions
           (id, user_id, stripe_payment_intent_id, amount, currency, tier, status)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [
            uuidv4(),
            userId,
            session.payment_intent,
            session.amount_total,
            session.currency,
            tier,
            'completed',
          ]
        );

        console.log(`Payment completed for user ${userId}, tier: ${tier}`);
        break;
      }

      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        // Find user by customer ID
        const userResult = await query(
          'SELECT id FROM users WHERE stripe_customer_id = $1',
          [customerId]
        );

        if (userResult.rows.length > 0) {
          const userId = userResult.rows[0].id;

          if (subscription.status === 'active') {
            const endDate = new Date(subscription.current_period_end * 1000);
            await query(
              `UPDATE users
               SET tier = 'premium',
                   subscription_end_date = $1,
                   pec_enabled = true
               WHERE id = $2`,
              [endDate, userId]
            );
          } else if (
            subscription.status === 'canceled' ||
            subscription.status === 'unpaid'
          ) {
            await query(
              `UPDATE users
               SET tier = 'standard',
                   subscription_end_date = NULL,
                   pec_enabled = false
               WHERE id = $1`,
              [userId]
            );
          }

          console.log(
            `Subscription ${subscription.status} for user ${userId}`
          );
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;

        // Find user and notify about failed payment
        const userResult = await query(
          'SELECT id, email FROM users WHERE stripe_customer_id = $1',
          [customerId]
        );

        if (userResult.rows.length > 0) {
          const userId = userResult.rows[0].id;
          console.error(`Payment failed for user ${userId}`);
          // TODO: Send email notification
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
