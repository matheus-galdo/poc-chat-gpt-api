import { Request, Response } from "express";

export async function renderHome (req: Request, res: Response) {
    return res.send(`
        <form action="/analisar-imagem" method="post" enctype="multipart/form-data">
        <label for="image">Escolha uma imagem</label>
        <input type="file" name="image" id="image">

        <button>Enviar</button>
        </form>  
    `);  
}