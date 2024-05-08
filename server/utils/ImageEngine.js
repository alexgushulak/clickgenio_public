import { v4 as uuidv4 } from 'uuid';
import sharp from 'sharp';
import fs from 'fs';
import { 
  uploadToS3 
} from './s3Handler.js';
import OpenAI from "openai";
import https from 'https';
import 'dotenv/config'

export class ImageEngine {

    constructor(serverFolder, s3Folder, steps) {
        this.ID = uuidv4().toString()
        this.serverFolder = serverFolder
        this.s3Folder = s3Folder
        this.steps = steps
        this.engineId = ImageEngine.ENGINE_ID
        this.apiKey = ImageEngine.STABILITY_AI_API_KEY
        this.height = 768
        this.width = 1344
        this.base64 = null
        this.base64_watermark = null
        this.userPrompt = null
        this.stableDiffusionPrompt = null
        this.imageUrl = null

        this.fullResolutionFileName = `${this.ID}.jpg`
        this.watermarkedFileName = `${this.ID}.jpg`
        this.previewFileName = `${this.ID}.jpg`

        this.fullResolutionFilePath = `${this.serverFolder}/full/${this.fullResolutionFileName}`
        this.watermarkedFilePath = `${this.serverFolder}/watermark/${this.watermarkedFileName}`
        this.previewFilePath = `${this.serverFolder}/preview/${this.previewFileName}`
    }

    fetchImageOpenAI = async (thumbnailDescription) => {
      try {
        this.userPrompt = thumbnailDescription
        this.stableDiffusionPrompt = this.userPrompt + " in the style of a video thumbnail"

        const openai = new OpenAI({
          apiKey: process.env.OPENAI_API_KEY,
        });

        const openaiOptions = {
          model: "dall-e-3",
          prompt: this.stableDiffusionPrompt,
          n: 1,
          size: "1792x1024",
        }

        const response = await openai.images.generate(openaiOptions);

        this.imageUrl = response.data[0].url
        return
      } catch (err) {
        console.log("fetchImageOpenAI Error: ", err)
      }
    }

    _createFullResolutionJPG = async () => {
        try {
            if (!this.base64) {
              console.error('No base64 image data available.');
              return;
            }
      
            const imageBuffer = Buffer.from(this.base64, 'base64');

            const jpgBuffer = await sharp(imageBuffer)
              .toFormat('jpg')
              .toBuffer();

            fs.writeFileSync(this.fullResolutionFilePath, jpgBuffer);
      
            console.log('Image converted to JPG.');
          } catch (err) {
            console.error('createJPG Error:', err);
          }
    }

    _createWatermarkJPG = async(watermarkPath) => {
        try {
            if (!this.base64) {
              console.error('No input image data provided.');
              return;
            }

            const inputImageBuffer = Buffer.from(this.base64, 'base64');
            const watermarkBuffer = await fs.promises.readFile(watermarkPath);
      
            const outputImageBuffer = await sharp(inputImageBuffer)
              .composite([{ input: watermarkBuffer }])
              .toFormat('jpg')
              .toBuffer();
      
            fs.writeFileSync(this.watermarkedFilePath, outputImageBuffer);
      
            console.log('Watermark added to the image.');
            return outputImageBuffer;
          } catch (err) {
            console.error('watermarkPNG Error:', err);
          }
    }

    _createPreviewJPG = async (resizePercentage) => {
        try {
          if (!this.base64) {
            console.error('No input image data provided.');
            return;
          }
    
          const inputImageBuffer = Buffer.from(this.base64, 'base64');

          const newHeight = Math.round(resizePercentage * this.height);
          const newWidth = Math.round(resizePercentage * this.width);
    
          const outputImageBuffer = await sharp(inputImageBuffer)
            .resize({ width: newWidth, height: newHeight })
            .toFormat('jpg')
            .toBuffer();

          console.log(this.previewFilePath)

          fs.writeFileSync(this.previewFilePath, outputImageBuffer);
        } catch (err) {
          console.error('createPreview Error:', err);
        }
    }

    fetchImageAndReadToBuffer = async (imageLink) => {
      return new Promise((resolve, reject) => {
        const filepath = `generated-images/full/${this.ID}.png`
        fs.openSync(filepath, 'w')
        const file = fs.createWriteStream(filepath);
  
        const request = https.get(imageLink, (res) => {
          res.pipe(file);
  
          res.on('end', () => {
            const imageBuffer = fs.readFileSync(filepath);
            this.base64 = imageBuffer.toString('base64');
            resolve();
          });
  
          res.on('error', (error) => {
            reject(error);
          });
        });
  
        request.on('error', (error) => {
          reject(error);
        });
      });
    }
    
    saveImagesOnServer = async (imageLink) => {
      await this.fetchImageAndReadToBuffer(imageLink)
      await this._createFullResolutionJPG()
      await this._createFullResolutionJPG()
      await this._createPreviewJPG(0.4)
    }

    saveImagesOnS3 = () => {
      uploadToS3(this.fullResolutionFileName, `./${this.serverFolder}/full/${this.fullResolutionFileName}`, 'full');
      uploadToS3(this.previewFileName, `./${this.serverFolder}/preview/${this.previewFileName}`, 'preview');
    }

    getImageId = () => {
      return this.ID
    }
}