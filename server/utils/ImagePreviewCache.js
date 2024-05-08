import fs from 'fs';
import path from 'path';
import { getLastNImages } from '../db.js';
import { downloadFromS3 } from './s3Handler.js';


class ImagePreviewCacheJob {
  constructor(intervalMinutes, numberOfImages) {
    this.intervalMinutes = intervalMinutes;
    this.numberOfImages = numberOfImages || 20
    this.userPromptsList = [];
    this.previewUrlsList = [];
    this.IDList = [];
  }

  async start() {
    const SECONDS_PER_MINUTE = 60
    const MILLISECONDS_PER_SECOND = 1000
    this.updateCache(this.numberOfImages)
    this.intervalId = setInterval(async () => {
      this.updateCache(this.numberOfImages)
    }, this.intervalMinutes * SECONDS_PER_MINUTE * MILLISECONDS_PER_SECOND);
  }

  async stop() {
    clearInterval(this.intervalId);
  }

  async fetchAndCacheImages(numberOfImages) {
    const data = await getLastNImages(numberOfImages);

    // this took 6 months to do correctly lol
    for (const item of data) {
      let stream;
        try {
          stream = await downloadFromS3(`preview/${item.imageId}.jpg`)
        } catch {
          console.log("Error FUCK FUCK")
        }
        if (stream instanceof Error) {
            print(stream)
            console.error('Error downloading file:', stream);
        } else {
          const localFilePath = `image-cache/${item.imageId}.jpg`;
          const writeStream = fs.createWriteStream(localFilePath);
          stream.pipe(writeStream);
          this.userPromptsList.push(item.userPrompt);
          this.previewUrlsList.push(item.previewUrl);
          this.IDList.push(item.imageId);
        }
    }
  }

  async clearImageCacheFiles() {
    const imageCachePath = 'image-cache'; // Replace with the actual path to your image-cache folder
    this.userPromptsList = [];
    this.previewUrlsList = [];
    this.IDList = [];
    try {
      const files = await fs.promises.readdir(imageCachePath);
      console.log("Files: ", files)
  
      for (const file of files) {
        if (file != '.gitignore') {
          const filePath = path.join(imageCachePath, file);
          await fs.promises.unlink(filePath); // Delete the file
        }
      }
  
      console.log('Deleted all files from image-cache folder.');
    } catch (err) {
      console.error('Error deleting files from image-cache:', err);
    }
  }

  async updateCache(numberOfImages) {
    try {
      console.log('Deleting files from image-cache...');
      await this.clearImageCacheFiles();
      console.log('Fetching and caching images...');
      await this.fetchAndCacheImages(numberOfImages);
    } catch (err) {
      console.error('Error in image caching job:', err);
    }
  }
}

export default ImagePreviewCacheJob;
