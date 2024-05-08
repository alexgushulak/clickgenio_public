import 'dotenv/config'
import { getCreditsByEmail, updateCredits } from '../db.js';

const deductCredits = async (req, res, next) => {
    const email = req.email;
    let hasCredits = false;
    try {
        var credits = await getCreditsByEmail(email);
        if (credits > 0) {
            await updateCredits(email, -1)
            hasCredits = true;
        } else {
            res.json({message: 'Insufficient Credits'})
            return;
        }
    } catch (err) {
        res.json({ message: 'Error fetching credits', error: err.message });
        return;
    }
    
    if (hasCredits == true) {
        next();
    } else {
        res.json({message: 'Insufficient Credits'})
    }
};

export { deductCredits }