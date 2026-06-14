const express = require('express');
const router = express.Router();
const axios = require('axios');
const cheerio = require('cheerio');

const MEMEDROID_URLS = [
    'https://es.memedroid.com/memes/top/day',
    'https://es.memedroid.com/memes/top/week',
    'https://es.memedroid.com/memes/top/month',
];

async function obtenerMemes(cantidad = 1) {
    const url = MEMEDROID_URLS[Math.floor(Math.random() * MEMEDROID_URLS.length)];

    const { data } = await axios.get(url, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0.0.0 Safari/537.36',
            'Accept-Language': 'es-ES,es;q=0.9',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        },
        timeout: 15000,
    });

    const $ = cheerio.load(data);
    const memes = [];

    $('article.gallery-item').each((i, el) => {
        if (memes.length >= cantidad) return false;

        const titulo = $(el).find('.item-aux-container .title').text().trim() || 'Sin título';
        const imagen = $(el).find('img.img-responsive').attr('src') || $(el).find('img').attr('src');
        const votos = $(el).find('.score .value').text().trim() || '0';
        const enlace = 'https://es.memedroid.com' + ($(el).find('a').attr('href') || '');

        if (imagen && imagen.startsWith('http')) {
            memes.push({
                titulo,
                imagen,
                enlace,
                votos: parseInt(votos) || 0,
                fuente: 'Memedroid'
            });
        }
    });

    if (memes.length === 0) throw new Error('No se pudieron obtener memes de Memedroid');

    return memes;
}

// GET /api/search/memes?cantidad=5
router.get('/', async (req, res) => {
    const cantidad = Math.min(parseInt(req.query.cantidad) || 1, 10);

    try {
        const resultado = await obtenerMemes(cantidad);

        res.json({
            status: true,
            creator: 'elvigilante',
            total: resultado.length,
            data: cantidad === 1 ? resultado[0] : resultado,
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
