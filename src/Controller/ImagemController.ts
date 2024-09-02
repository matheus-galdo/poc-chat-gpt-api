import { Request, Response } from "express";
import OpenAI from "openai";

export async function analisarImagem (req: Request, res: Response) {
    let base64Image: string;
    let mimeType: string;
    let fileName: string;

    if (!req.is('application/json') && !req.is('multipart/form-data')) {
        return res.status(415).send('Tipo de conteúdo não suportado.');
    }

    if (req.is('multipart/form-data')) {
        const file = req.file;

        if (file) {
            mimeType = file.mimetype;
            fileName = file.originalname;
            base64Image = file.buffer.toString('base64');
        } else {
            return res.status(400).send('Nenhuma imagem encontrada no FormData.');
        }
    }
    
    if (req.is('application/json')) {
        const { image, mimeType } = req.body;

        if (image && mimeType) {
            base64Image = image;
        } else {
            return res.status(400).send('Imagem ou MIME type ausente no JSON.');
        }
    }

    if (!imageMimeTypes.includes(mimeType)) {
        return res.status(415).send('Tipo de conteúdo não suportado.');
    }

    try {
        const response = await getAmmountOfCacambas({ image: base64Image, mimeType })
        const {qtd_cacambas} = JSON.parse(response.choices[0]?.message.content) as {qtd_cacambas: number}
        res.send({ file: fileName, mimeType, qtd_cacambas, gptResponse: response });
    } catch (error) {        
        res.status(400).send({ message: "Ocorreu um erro com a API do chat gpt", errContent: error })
    }
}

async function getAmmountOfCacambas({ image, mimeType }) {
    const client = new OpenAI({ apiKey: process.env.GPT_KEY });

    return await client.chat.completions.create({
        messages: [
            {
                role: 'user',
                content: [
                    { type: 'text', text: 'a imagem apresenta um caminhão de entulho com caçambas. Analise atentamente a traseira do caminhão, quantas caçambas existem no caminhão? Considere que elas podem estar empilhadas uma dentro da outra. Responda com um texto no formato {"qtd_cacambas": numero de caçambas}. Além disso, cada caçamba possui texto em sua lateral, adicione um campo "texto_cacamba" no json retornando, onde cada elemento do array será uma string com todo o texto de uma caçamba. Se a imagem tiver multiplas caçambas o array deverá ter múltiplas strings, uma para cada caçamba' },
                    { type: 'image_url', image_url: { url: `data:${mimeType};base64,${image}` } },
                ]
            },
        ],
        model: 'gpt-4o',
        max_tokens: 1000
    });
}

const imageMimeTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/bmp",
    "image/webp",
    "image/tiff",
    "image/svg+xml",
    "image/x-icon",
    "image/vnd.microsoft.icon",
    "image/heif",
    "image/heic"
];
