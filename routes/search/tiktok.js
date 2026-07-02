const express = require('express');
const router = express.Router();
const axios = require('axios');

const is = axios.create({
    headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "Cookie": "current_language=en",
        "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36",
    },
    timeout: 8000,
});

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function searchOnce(query) {
    const response = await is.post(
        "https://www.tikwm.com/api/feed/search",
        new URLSearchParams({
            keywords: query,
            count: 10,
            cursor: 0,
            HD: 1,
        })
    );

    // tikwm a veces responde 200 pero con code !== 0 (rate limit, error interno, etc.)
    // o con "data" ausente. Validamos antes de acceder a .videos para no explotar
    // con un TypeError poco descriptivo.
    if (response.data?.code !== 0) {
        throw new Error(response.data?.msg || "La API de TikTok devolvió un error");
    }

    const videos = response.data?.data?.videos;
    if (!videos || videos.length === 0) {
        throw new Error("No se encontraron videos.");
    }

    return videos;
}

async function tiktoks(query, retries = 2) {
    let lastError;

    for (let attempt = 0; attempt <= retries; attempt++) {
        try {
            return await searchOnce(query);
        } catch (error) {
            lastError = error;

            // No reintentamos si simplemente no hay resultados (no es un fallo transitorio).
            if (error.message === "No se encontraron videos.") {
                throw error;
            }

            // Backoff corto antes de reintentar (evita golpear el servicio en fallos por rate limit).
            if (attempt < retries) {
                await sleep(500 * (attempt + 1));
            }
        }
    }

    throw lastError;
}

router.get('/', async (req, res) => {
    const query = req.query.query;

    if (!query || query.trim().length === 0) {
        return res.status(400).json({
            status: false,
            creator: "Edward",
            error: "El parámetro query es requerido"
        });
    }

    if (query.length > 100) {
        return res.status(400).json({
            status: false,
            creator: "Edward",
            error: "La búsqueda es demasiado larga"
        });
    }

    try {
        const result = await tiktoks(query.trim());
        res.json({
            status: true,
            creator: "Edward",
            data: result,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            creator: "Edward",
            error: error.message || "Internal Server Error"
        });
    }
});

module.exports = router;
