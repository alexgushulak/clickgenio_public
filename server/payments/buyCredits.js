import stripe from 'stripe';
import 'dotenv/config'

export async function createStripeSessionWithSecretKey() {
  return new stripe(process.env.STRIPE_SECRET_KEY);
}

export async function checkoutSession(stripeSession, credits, userEmail) {

  return await stripeSession.checkout.sessions.create({
    submit_type: 'pay',
    metadata: {
      credits: credits,
      email: userEmail
    },
    line_items: [
      {
        price: getProductPrice(credits),
        quantity: 1
      },
    ],
    mode: 'payment',
    success_url: `${process.env.CLIENT_URL}/generate?success=true`,
    cancel_url: `${process.env.CLIENT_URL}/purchase`,
    automatic_tax: {enabled: true},
  })
};

export function getProductPrice(credits) {
  if (credits == 25) {
    var product = process.env.PRODUCT_CODE_50
  } else if (credits == 50) {
    var product = process.env.PRODUCT_CODE_100
  } else if (credits == 125) {
    var product = process.env.PRODUCT_CODE_250
  } else {
      throw Error("Invalid Product Requested")
  }

  return product
}

export async function checkoutActionBuyCredits(credits, userEmail) {
  try {
    const stripeSession = await createStripeSessionWithSecretKey();
    return await checkoutSession(stripeSession, credits, userEmail);
  } catch (error) {
    console.error("checkoutActionBuyCredits Error: ", error);
  }
}