import stripe from 'stripe';
import 'dotenv/config'

export async function checkoutAction(imageId, sessionId) {
    const stripeSession = new stripe(process.env.STRIPE_SECRET_KEY);

    const checkoutSession = await stripeSession.checkout.sessions.create({
        submit_type: 'pay',
        metadata: {
          imageId: imageId,
          sessionId: sessionId
        },
        line_items: [
          {
            price: process.env.PRODUCT_CODE,
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${process.env.CLIENT_URL}/home/?id=${imageId}`,
        cancel_url: `${process.env.CLIENT_URL}/generate/?image=${imageId}`,
        automatic_tax: {enabled: true},
      });

    return checkoutSession
}