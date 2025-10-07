import { v2 as cloudinary } from 'cloudinary';
import * as dotenv from 'dotenv';
dotenv.config();
console.log({
  cloudName: process.env.CLOUD_NAME,
  apiKey: process.env.API_KEY, 
  apiSecret: process.env.API_SECRET,
});
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY, 
  api_secret: process.env.API_SECRET ,
});

export default cloudinary;
