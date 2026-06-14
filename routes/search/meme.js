const express = require('express');
const router = express.Router();
const axios = require('axios');

const subredditsEspanol = [
    'memesES',
    'memexico',
    'SpanishMeme',
    'MemesEnEspanol',
    'dankespanol',
    'MujicoCity',
    'ArgentinaMemes',
    'ChileMemes',
    'ColombiaMemes',
    'PeruMemes'
];

async function obtenerMeme() {
    const intentos = [...subredditsEspanol].sort(() => Math.random() - 0.5); // mezclar orden

    for (const sub of intentos) {
        try {
            const response = await axios({
                method: 'GET',
                url: `https://meme-api.com/gimme/${sub}`,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                    'Accept': 'application/json'
                },
                timeout: 10000,
            });

            const data = response.data;

            if (data && data.url && !data.nsfw) {
                return {
                    titulo: data.title || 'Sin título',
                    imagen: data.url,
                    enlace: data.postLink || null,
                    subreddit: data.subreddit,
                    autor: data.author,
                    votos: data.ups || 0,
                    nsfw: data.nsfw || false
                };
            }
        } catch (e) {
            console.error(`Error en r/${sub}:`, e.message);
            continue; // intentar con el siguiente subreddit
        }
    }

    throw new Error('No se pudo obtener ningún meme en este momento');
}

async function obtenerVarios(cantidad = 5) {
    const resultados = [];
    const promesas = Array.from({ length: cantidad }, () => obtenerMeme());
    const resueltos = await Promise.allSettled(promesas);

    for (const r of resueltos) {
        if (r.status === 'fulfilled') {
            resultados.push(r.value);
        }
    }

    if (resultados.length === 0) {
        throw new Error('No se pudieron obtener memes en este momento');
    }

    return resultados;
}

// GET /api/search/memes?cantidad=5
router.get('/', async (req, res) => {
    const cantidad = Math.min(parseInt(req.query.cantidad) || 1, 10); // máx 10

    try {
        let resultado;

        if (cantidad === 1) {
            resultado = await obtenerMeme();
        } else {
            resultado = await obtenerVarios(cantidad);
        }

        res.json({
            status: true,
            creator: 'elvigilante',
            total: Array.isArray(resultado) ? resultado.length : 1,
            data: resultado,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            error: error.message || 'Error interno del servidor'
        });
    }
});

module.exports = router;
