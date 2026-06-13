const express = require('express');
const router = express.Router();
const axios = require('axios');

// Subreddits en español para buscar memes
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

async function buscarMemes(query, limit = 10) {
    try {
        // Buscar en múltiples subreddits en español
        const todasLasRespuestas = [];
        
        for (const sub of subredditsEspanol.slice(0, 3)) { // Limitar a 3 subreddits para no sobrecargar
            try {
                const response = await axios({
                    method: "GET",
                    url: `https://www.reddit.com/r/${sub}/search.json`,
                    params: {
                        q: query,
                        restrict_sr: 1,
                        limit: limit,
                        sort: 'relevance'
                    },
                    headers: {
                        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                        "Accept": "application/json"
                    },
                    timeout: 10000,
                });

                const posts = response.data.data.children || [];
                
                for (const post of posts) {
                    const data = post.data;
                    // Filtrar solo posts que sean imágenes
                    if (data.url && (data.url.endsWith('.jpg') || data.url.endsWith('.png') || data.url.endsWith('.jpeg') || data.url.endsWith('.gif') || data.url.includes('i.redd.it') || data.url.includes('i.imgur.com'))) {
                        todasLasRespuestas.push({
                            titulo: data.title || "Sin título",
                            imagen: data.url,
                            enlace: `https://reddit.com${data.permalink}`,
                            subreddit: data.subreddit,
                            autor: data.author,
                            votos: data.ups || 0,
                            comentarios: data.num_comments || 0,
                            creado: new Date(data.created_utc * 1000).toISOString(),
                            nsfw: data.over_18 || false
                        });
                    }
                }
            } catch (e) {
                console.error(`Error en r/${sub}:`, e.message);
            }
        }

        if (todasLasRespuestas.length === 0) {
            throw new Error("No se encontraron memes para esta búsqueda");
        }

        return todasLasRespuestas.slice(0, limit);
    } catch (error) {
        throw new Error(error.message);
    }
}

async function buscarMemeAleatorio() {
    try {
        const randomSub = subredditsEspanol[Math.floor(Math.random() * subredditsEspanol.length)];
        
        const response = await axios({
            method: "GET",
            url: `https://meme-api.com/gimme/${randomSub}`,
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                "Accept": "application/json"
            },
            timeout: 15000,
        });

        const data = response.data;
        
        if (!data || !data.url) {
            throw new Error("No se pudo obtener el meme");
        }

        return {
            titulo: data.title || "Sin título",
            imagen: data.url,
            enlace: data.postLink,
            subreddit: data.subreddit,
            autor: data.author,
            votos: data.ups || 0,
            comentarios: data.num_comments || 0,
            nsfw: data.nsfw || false
        };
    } catch (error) {
        throw new Error(error.message);
    }
}

// Endpoint para descargar la imagen directamente
router.get('/descargar', async (req, res) => {
    const { url } = req.query;

    if (!url) {
        return res.status(400).json({
            status: false,
            error: "El parámetro url es requerido"
        });
    }

    try {
        const response = await axios({
            method: "GET",
            url: url,
            responseType: "stream",
            timeout: 30000,
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
            }
        });

        // Si se pide descarga directa
        if (req.query.download === 'true') {
            res.setHeader('Content-Disposition', `attachment; filename="meme_${Date.now()}.jpg"`);
            res.setHeader('Content-Type', response.headers['content-type']);
            return response.data.pipe(res);
        }

        // Si no, devolver la URL
        res.json({
            status: true,
            creator: "elvigilante",
            data: {
                url: url,
                mensaje: "Para descargar usa ?download=true en la URL"
            },
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            error: error.message || "Error al descargar la imagen"
        });
    }
});

// Endpoint principal de búsqueda
router.get('/', async (req, res) => {
    const { query, limit = 10, aleatorio } = req.query;

    try {
        let resultado;
        
        // Si es modo aleatorio
        if (aleatorio === 'true') {
            resultado = await buscarMemeAleatorio();
        }
        // Búsqueda normal
        else if (query && query.trim().length > 0) {
            if (query.length > 100) {
                return res.status(400).json({
                    status: false,
                    error: "La búsqueda es demasiado larga"
                });
            }
            resultado = await buscarMemes(query.trim(), parseInt(limit));
        }
        else {
            return res.status(400).json({
                status: false,
                error: "El parámetro query es requerido (o usa ?aleatorio=true para un meme aleatorio)"
            });
        }

        res.json({
            status: true,
            creator: "elvigilante",
            total: Array.isArray(resultado) ? resultado.length : 1,
            data: resultado,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            error: error.message || "Internal Server Error"
        });
    }
});

module.exports = router;