import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import cors from 'cors';
import geoip from 'geoip-lite';
import bodyParser from 'body-parser';
import { OAuth2Client } from 'google-auth-library'
import { checkoutActionBuyCredits } from './payments/buyCredits.js';
import { upload, downloadFromS3 } from './utils/s3Handler.js';
import { 
  getImageCount, 
  uploadImageDataToDB,
  markImageAsDownloaded,
  markImageAsPurchased,
  markCTAClicked,
  createUserAccount,
  updateIsEmailOk,
  getCreditsByEmail,
  updateCredits } from './db.js';
import { ImageEngine } from './utils/ImageEngine.js';
import { stripeWebHook } from './payments/stripeWebHook.js';
import { googleProtect } from './middleware/googleAuth.js';
import { deductCredits } from './middleware/creditLogic.js';
import ImagePreviewCacheJob from './utils/ImagePreviewCache.js';
import 'dotenv/config';



const app = express();
app.use(cors());
const port = 5001;
const jsonParser = bodyParser.json();
const CACHE_REFRESH_TIME_IN_MINS = 480;
const NUMBER_OF_IMAGES_TO_CACHE = process.env.NUMBER_OF_IMAGES_TO_CACHE ? parseInt(process.env.NUMBER_OF_IMAGES_TO_CACHE) : 1;
const imageCacheJob = new ImagePreviewCacheJob(CACHE_REFRESH_TIME_IN_MINS, NUMBER_OF_IMAGES_TO_CACHE);
imageCacheJob.start()

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
var dir = path.join(__dirname, '');
var mime = {
    html: 'text/html',
    txt: 'text/plain',
    css: 'text/css',
    gif: 'image/gif',
    jpg: 'image/jpeg',
    png: 'image/png',
    svg: 'image/svg+xml',
    js: 'application/javascript'
};

const oAuth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  'postmessage',
);

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.post('/webhook', jsonParser, async (req, res) => {
  try {
    stripeWebHook(req, res)
  } catch (err) {
    console.error("/webhook route error")
  }
})

app.post('/user/emailOK', jsonParser, async (req, res) => {
  try {
    const id_token = req.body.token
    const segments = id_token.split('.');

    if (segments.length !== 3) {
      throw new Error('Not enough or too many segments');
    }

    var payloadSeg = segments[1];

    function base64urlDecode(str) {
      const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
      return Buffer.from(base64, 'base64').toString();
    }

    var payload = JSON.parse(base64urlDecode(payloadSeg));

    await updateIsEmailOk(payload.email)

    res.json({
      message: "success"
    })
  } catch(err) {
    console.log("Error on route `/user/emailOk`: ", err)
    res.json({
      message: "failure"
    })
  }
})

app.post('/auth/google', jsonParser, async (req, res) => {
  try {
    console.log("Trying to authorize with google")
    const { tokens } = await oAuth2Client.getToken(req.body.code);
    const ticket = await oAuth2Client.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID
    })

    const data = {
      given_name: ticket.payload.given_name,
      picture: ticket.payload.picture,
      id_token: tokens.id_token
    }
    
    await createUserAccount(ticket.payload.email, ticket.payload.given_name)

    res.json(data)
  } catch (err) {
    console.log("Login Failure: ", err)
    res.send(403)
  }
});

app.post('/metadata', jsonParser, async (req, res) => {
    var ip = req.header('x-forwarded-for');
    if (!ip) {
        var ip = '72.229.28.185';
    }
    const geo = geoip.lookup(ip);
    var thumbnailText = req.body.message;
    try {
      console.log(`User Info -- IP-Address: ${ip}, Location: ${geo.city}, ${geo.country}, Thumbnail Text: ${thumbnailText}`);
      res.status(200).send({
        message: "Received Metadata"
      });
    } catch (err) {
      console.log("Could not log user metadat", err)
    }
})

app.post('/generateImage', jsonParser, googleProtect(oAuth2Client), deductCredits, async (req, res, next) => {
  const thumbnail_image_text = req.body.message;
  const generation_steps = 40;
  const emailAddress = res.locals.email
  
    try {
      const imageEngine = new ImageEngine('generated-images', 'full-images', generation_steps);
  
      await imageEngine.fetchImageOpenAI(thumbnail_image_text);

      // imageEngine.imageUrl = 'https://oaidalleapiprodscus.blob.core.windows.net/private/org-wPHuywcLXRw3yqRgZGYlb9cN/user-3vJutdZAHIXatPWzTwSmw0lM/img-pn6AA8TimHsykoEhjbxXwhFT.png?st=2023-11-16T16%3A50%3A13Z&se=2023-11-16T18%3A50%3A13Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2023-11-16T17%3A44%3A13Z&ske=2023-11-17T17%3A44%3A13Z&sks=b&skv=2021-08-06&sig=3f69ErSdzul0Iqz1lunjc7C8Bt5N0BNKWZuqh5wX4TU%3D'
      // imageEngine.userPrompt = 'user prompt'
      // imageEngine.stableDiffusionPrompt = 'sd prompt'
      if (imageEngine.imageUrl) {
          console.log(`Saving Image with URL: ${imageEngine.imageUrl}, and ID: ${imageEngine.ID}`)
          await imageEngine.saveImagesOnServer(imageEngine.imageUrl)
          await uploadImageDataToDB(emailAddress, imageEngine.ID, imageEngine.userPrompt, imageEngine.stableDiffusionPrompt);
          imageEngine.saveImagesOnS3(imageEngine.imageUrl);
      } else {
        console.log("No Image Url Available")
      }

      // if (imageEngine.base64) {
      //   await imageEngine.saveImagesOnServer();
      //   imageEngine.saveImagesOnS3();
      //   await uploadImageDataToDB(imageEngine.ID, imageEngine.userPrompt, imageEngine.stableDiffusionPrompt);
      // } else {
      //   console.error("No base 64 image")
      // }

      res.status(200).send({
        imageUrl: imageEngine.imageUrl,
        imageId: imageEngine.ID
      });
    } catch (err) {
      console.error("Submit Error:", err);
      res.status(500).send({
        message: "Internal Server Error"
      });
    }
});
  
app.get('/gallery', jsonParser, async (req, res) => {
    function combineListsIntoObjects(list1, list2) {
      if (list1.length !== list2.length) {
        console.error("Lists must have the same length");
      } else {
        const combinedList = [];
      
        for (let i = 0; i < list1.length; i++) {
          const obj = {
            imageId: list1[i],
            userPrompt: list2[i]
          };
          combinedList.push(obj);
        }
      
        return combinedList;
      }
    }
    
    console.log(imageCacheJob.IDList)
    console.log("#######")
    console.log(imageCacheJob.userPromptsList)
    const images = combineListsIntoObjects(imageCacheJob.IDList, imageCacheJob.userPromptsList);


    try {
        console.log("Getting Gallery Images")
        res.status(200).send({images})
    } catch (err) {
        console.log("Gallery Error:", err)
        res.status(500).send({
            message: "Internal Server Error, Gallery Could Not Be Fetched"
        })
    }
})

app.get('/download/:imagetype', jsonParser, async (req, res) => {
    const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    if (!uuidRegex.test(req.query.id)) {
        res.status(400).send({ message: 'Invalid UUID format' });
        return;
    }

    if (!req.params.imagetype) {
        return;
    }

    try {
        let file_name = `${req.query.id}.jpg`;
        let s3path = `${req.params.imagetype}/${file_name}`;
        let fileStream = await downloadFromS3(s3path);
        res.setHeader('Content-Type', 'image/jpeg'); // Set the correct content type for your file
        res.setHeader('Content-Disposition', `inline; filename="${file_name}"`)
        fileStream.pipe(res);
    } catch (err) {
        console.log(err)
        res.status(500).send({
            message: "Internal Server Error, Purchase could not be completed"
        })
    }
});

app.post('/upload', upload.single("file"), async (req, res) => {
    try {
        res.send("File Uploaded Succesfully");
    } catch (err) {
        console.log("File Upload Error", err)
        res.status(500).send({
            message: "Internal Server Error, Purchase could not be completed"
        })
    }
});

app.post('/updateImageData', async (req, res) => {

  const updateType = req.query.updateType;
  const imageID = req.query.id;

  if (updateType == "download") {
    try {
      const imageID = req.query.id;
      await markImageAsDownloaded(imageID)
      res.status(200).send()
    } catch (err) {
      console.error('Update Image Error: ', err)
    }
  } else if (updateType == "purchase") {
    try {
      const imageID = req.query.id;
      await markImageAsPurchased(imageID)
      res.status(200).send()
    } catch (err) {
      console.error('Update Image Error: ', err)
    }
  } else {

  }
})

app.post('/create-checkout-session', async (req, res) => {

  console.log("Trying to create a checkout session")
  const imageId = req.query.imgid;
  const sessionId = "FAKE_ID_1000";
  const credits = req.query.credits;
  const id_token = req.query.token;

  const ticket = await oAuth2Client.verifyIdToken({
    idToken: id_token,
    audience: process.env.GOOGLE_CLIENT_ID
  })

  const email = ticket.payload.email
  await markCTAClicked(email)
  try {
    if (credits) {
      var session = await checkoutActionBuyCredits(credits, email)
    } else {
    }
  } catch(err) {
    console.error("Could not Complete /create-checkout-session", err)
  }

  res.json({"sessionId": session.id});
});

app.post('/create-paddle-checkout', async (req, res) => {
  
})

app.get('/imageCount', async (req, res) => {
  try {
    const count = await getImageCount();
    res.status(200).json({ count });
  } catch (error) {
    console.error('Error getting image count:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/user/get-credits', (req, res) => {
  const token = req.query.token; // Assuming the token is sent as a query parameter

  if (!token) {
    res.status(400).json({ message: 'Token is missing in the request' });
    return;
  }

  try {
    // Extract the email from the JSON token
    const segments = token.split('.');
    if (segments.length !== 3) {
      throw new Error('Not enough or too many segments');
    }

    const payloadSeg = segments[1];
    function base64urlDecode(str) {
      const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
      return Buffer.from(base64, 'base64').toString();
    }
    const payload = JSON.parse(base64urlDecode(payloadSeg));
    const userEmail = payload.email;

    // Use the userEmail to fetch the credits from the database
    getCreditsByEmail(userEmail)
      .then((credits) => {
        res.status(200).json({ credits });
      })
      .catch((error) => {
        res.status(500).json({ message: 'Error fetching credits', error: error.message });
      });
  } catch (err) {
    res.status(400).json({ message: 'Invalid token format', error: err.message });
  }
});

app.post('/user/deduct-credits', async (req, res) => {
  const id_token = req.query.token;
  console.log("Attempting to deduct credits")
  const ticket = await oAuth2Client.verifyIdToken({
    idToken: id_token,
    audience: process.env.GOOGLE_CLIENT_ID
  })

  const email = ticket.payload.email

  try {
    updateCredits(email, -1)
  } catch (err) {
    console.log("Deduct Credits DB Error: ", err)
  }

  res.sendStatus(200)
});

app.get('*', function (req, res) {
    var file = path.join(dir, req.path.replace(/\/$/, '/index.html'));
    if (file.indexOf(dir + path.sep) !== 0) {
        return res.status(403).end('Forbidden');
    }
    var type = mime[path.extname(file).slice(1)] || 'text/plain';
    var s = fs.createReadStream(file);
    s.on('open', function () {
        res.set('Content-Type', type);
        s.pipe(res);
    });
    s.on('error', (err) => {
        console.error(err)
        res.set('Content-Type', 'text/plain');
        res.status(400).end('Not found');
    });
});

app.listen(port, ()=>{
    console.log(`Server Running on port ${port}`);
});
