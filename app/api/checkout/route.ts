import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { stripe } from '@/lib/stripe';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { origin } = new URL(request.url);

    // Check if user already has a stripe_customer_id in profiles
    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_customer_id, plan')
      .eq('id', user.id)
      .single();

    let customerId = profile?.stripe_customer_id;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          supabase_uid: user.id,
        },
      });
      customerId = customer.id;

      await supabase
        .from('profiles')
        .update({ stripe_customer_id: customerId })
        .eq('id', user.id);
    }

    const priceId = process.env.STRIPE_PRO_PRICE_ID;

    // Create Checkout Session
    const sessionConfig: any = {
      customer: customerId,
      payment_method_types: ['card'],
      mode: 'subscription',
      success_url: `${origin}/dashboard?payment=success`,
      cancel_url: `${origin}/pricing?payment=cancelled`,
      metadata: {
        supabase_uid: user.id,
      },
    };

    if (priceId) {
      sessionConfig.line_items = [{ price: priceId, quantity: 1 }];
    } else {
      // Fallback price definition if priceId is not set in env
      sessionConfig.line_items = [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Zentro PRO',
              description: 'Unlimited roadmaps, accelerated generation & export tools',
            },
            unit_amount: 4900,
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        },
      ];
    }

    const session = await stripe.checkout.sessions.create(sessionConfig);

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Stripe Checkout Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
