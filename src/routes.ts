import express from "express";
import { renderHome } from "./Controller/HomeController";
import multer from "multer";
import { analisarImagem } from "./Controller/ImagemController";

const router = express.Router();
const upload = multer();

router.get('/', renderHome);
router.post('/analisar-imagem',  upload.single('image'), analisarImagem);

export default router;