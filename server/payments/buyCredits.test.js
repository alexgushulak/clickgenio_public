import { checkoutActionBuyCredits, getProductPrice, checkoutSession, createStripeSessionWithSecretKey } from "./buyCredits"
import 'dotenv/config'

describe("getProductPrice Tests", () => {

    it("should return PRODUCT_CODE_50", () => {
        const credits = 50;
        const price_id = getProductPrice(credits)
        expect(price_id).toBe(process.env.PRODUCT_CODE_50)
    });

    it("Should return PRODUCT_CODE_100", () => {
        const credits = 100;
        const price_id = getProductPrice(credits)
        expect(price_id).toBe(process.env.PRODUCT_CODE_100)
    });
    
    it("Should return PRODUCT_CODE_250", () => {
        const credits = 250;
        const price_id = getProductPrice(credits)
        expect(price_id).toBe(process.env.PRODUCT_CODE_250)
    });
});

describe("checkoutActionBuyCredits Tests", () => {
    it("Should create a checkout session for 50 credits", async () => {
        const credits = 50;
        const userEmail = "test@example.com";
        const checkoutPage = await checkoutActionBuyCredits(await createStripeSessionWithSecretKey(), await checkoutSession(), credits, userEmail)
        expect(checkoutPage).toBeDefined();
    });
});