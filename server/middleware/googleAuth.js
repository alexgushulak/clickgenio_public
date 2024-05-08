import 'dotenv/config'

const googleProtect = (oAuth) => async (req, res, next) => {
    const id_token = req.body.token
    let isAuthenticated = false;
    try {
        const ticket = await oAuth.verifyIdToken({
            idToken: id_token,
            audience: process.env.GOOGLE_CLIENT_ID
        });

        isAuthenticated = true;
        req.email = ticket.payload.email
        res.locals.email = ticket.payload.email
    } catch (err) {
        console.error("Route Protection Error (googleProtect) : ", err);
        res.json({message: "Not Authorized"});
        return;
    }

    if (isAuthenticated) {
        next();
    } else {
        res.json({message: "Not Authorized"});
        return;
    }
};

export { googleProtect }