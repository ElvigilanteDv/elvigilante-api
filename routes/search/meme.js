const express = require('express');
const router = express.Router();
const axios = require('axios');
const cheerio = require('cheerio');

router.get('/', async (req, res) => {
    const cantidad = Math.min(parseInt(req.query.cantidad) || 1, 10);

    try {
        const { data } = await axios.get('https://es.memedroid.com/memes/top/day', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': 'text/html,application/xhtml+xml',
                'Accept-Language': 'es-ES,es;q=0.9'
            },
            timeout: 10000
        });

        const $ = cheerio.load(data);
        const memes = [];

        $('img').each((i, el) => {
            const src = $(el).attr('src') || $(el).attr('data-src') || '';
            const alt = $(el).attr('alt') || '';

            if (src && (src.includes('memedroid') || src.includes('meme')) &&
                (src.endsWith('.jpg') || src.endsWith('.jpeg') || src.endsWith('.png') || src.endsWith('.gif')) &&
                !src.includes('avatar') && !src.includes('logo') && !src.includes('icon')) {
                memes.push({
                    titulo: alt || 'Meme en español',
                    imagen: src.startsWith('http') ? src : 'https://es.memedroid.com' + src,
                    fuente: 'Memedroid',
                    idioma: 'Español'
                });
            }
        });

        // Fallback si no encuentra nada
        if (memes.length === 0) {
            $('article, .meme-item, .gallery-item').each((i, el) => {
                const img = $(el).find('img').attr('src') || $(el).find('img').attr('data-src') || '';
                const titulo = $(el).find('img').attr('alt') || 'Meme';
                if (img && (img.endsWith('.jpg') || img.endsWith('.jpeg') || img.endsWith('.png'))) {
                    memes.push({
                        titulo,
                        imagen: img.startsWith('http') ? img : 'https://es.memedroid.com' + img,
                        fuente: 'Memedroid',
                        idioma: 'Español'
                    });
                }
            });
        }

        if (memes.length === 0) {
            return res.status(404).json({
                status: false,
                error: 'No se encontraron memes. Intenta de nuevo.'
            });
        }

        // Mezclar y tomar la cantidad pedida
        const mezclados = memes.sort(() => Math.random() - 0.5).slice(0, cantidad);

        return res.json({
            status: true,
            creator: 'elvigilante',
            total: mezclados.length,
            data: cantidad === 1 ? mezclados[0] : mezclados,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        return res.status(500).json({
            status: false,
            error: 'Error al obtener memes'
        });
    }
});

module.exports = router;
