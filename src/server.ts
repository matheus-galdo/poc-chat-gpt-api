import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import multer from 'multer';
import router from './routes';

dotenv.config();
const app = express();
app.use(express.json());

const port = process.env.PORT || 3000;

app.use(router);



// Iniciar o servidor
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});




/*
  
 {
    "image": "string base64",
    "mimeType": ""
}
 */