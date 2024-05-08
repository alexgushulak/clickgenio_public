import 'dotenv/config';
import AWS from 'aws-sdk';
import multer from 'multer';
import multerS3 from 'multer-s3';
import * as fs from 'node:fs';

let bucketName = process.env.S3_BUCKET;

AWS.config.update({
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  accessKeyId: process.env.S3_ACCESS_KEY_ID,
  region: process.env.S3_REGION
})

const s3 = new AWS.S3();

const upload = multer({
  storage:multerS3({
    bucket : process.env.S3_BUCKET,
    s3  : s3,
    key:(req, file, cb) => {
      const folderName = 'full-images/';
      const key = folderName + file.originalname
      cb(null, key);
    }
  })
});

function uploadToS3(s3fileName, filePath, folderName) {
  const params = {
    Bucket: bucketName,
    Key: `${folderName}/${s3fileName}`,
    Body: fs.createReadStream(filePath)
  }

  s3.upload(params, (err, data) => {
      if (err) {
        console.error('Error uploading file:', err);
      } else {
        console.log('File uploaded successfully. S3 Location:', data.Location);
      }
  });
}

async function downloadFromS3(file_name) {
    const accessKeyId = process.env.S3_ACCESS_KEY_ID
    const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY
    const region = process.env.S3_REGION
    const Bucket = process.env.S3_BUCKET

    var fileKey = file_name

    console.log('Downloading: ', fileKey);

    AWS.config.update(
      {
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
        region: region
      }
    );

    var s3 = new AWS.S3();
    var options = {
        Bucket: Bucket,
        Key: fileKey,
    };

    return new Promise((resolve, reject) => {
      const fileStream = s3.getObject(options).createReadStream();
  
      // Attach an error event listener to the stream
      fileStream.on('error', (err) => {
        console.error("S3 Download Error: ", err.code, fileKey)
        reject(new Error(`fuck`)); // Reject the promise with the error
      });
  
      // Return the stream
      resolve(fileStream);
    });
};

// async function downloadFromS3(file_name) {
//   return new Promise((resolve, reject) => {
//     try {
//         if (true) {
//           setTimeout(() => {
//             throw new Error(`Custom Error for ${file_name}`);
//           }, 1000);
//         }
//     } catch (err) {
//         console.error('Error downloading file:', err);
//         reject(err);
//     }
// });
// }

export { upload, downloadFromS3, uploadToS3 };