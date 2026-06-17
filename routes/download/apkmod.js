const express = require('express');
const router = express.Router();
const axios = require('axios');
const cheerio = require('cheerio');

const HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0.0.0 Safari/537.36',
    'Accept-Language': 'en-US,en;q=0.9',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Referer': 'https://apkmody.com/'
};

async function buscar(query) {
    const { data } = await axios.get(`https://apkmody.com/?s=${encodeURIComponent(query)}`, {
        headers: HEADERS,
        timeout: 15000
    });

    const $ = cheerio.load(data);
    const resultados = [];

    $('article, .post, .item-post').each((i, el) => {
        if (resultados.length >= 5) return false;

        const titulo = $(el).find('h2 a, h3 a, .entry-title a').first().text().trim();
        const enlace = $(el).find('h2 a, h3 a, .entry-title a').first().attr('href');
        const imagen = $(el).find('img').first().attr('src') || $(el).find('img').first().attr('data-src');
        const descripcion = $(el).find('p, .entry-summary').first().text().trim().slice(0, 120);

        if (titulo && enlace && enlace.includes('apkmody.com')) {
            resultados.push({ titulo, enlace, imagen, descripcion });
        }
    });

    return resultados;
}

async function obtenerInfo(url) {
    const { data } = await axios.get(url, { headers: HEADERS, timeout: 15000 });
    const $ = cheerio.load(data);

    const titulo = $('h1').first().text().trim();
    const imagen = $('img.attachment-medium, .post-thumbnail img, img[src*="uploads"]').first().attr('src');
    const version = $('td, li, span').filter((i, el) => $(el).text().toLowerCase().includes('version')).first().next().text().trim()
        || $('td, li, span').filter((i, el) => $(el).text().toLowerCase().includes('version')).first().text().replace(/version/i, '').trim();

    // Link de descarga: apkmody.com/games/SLUG/download/0
    const slug = url.replace('https://apkmody.com/', '').replace(/\/$/, '');
    const url_descarga = `https://apkmody.com/${slug}/download/0`;
    const url_descarga_original = `https://apkmody.com/${slug}/download/1`;

    return {
        titulo,
        imagen: imagen || null,
        version: version || null,
        url_pagina: url,
        url_descarga_mod: url_descarga,
        url_descarga_original
    };
}

// GET /api/download/apkmod?query=minecraft
router.get('/', async (req, res) => {
    const { query } = req.query;

    if (!query || query.trim().length === 0) {
        return res.status(400).json({ status: false, error: 'El parámetro query es requerido' });
    }

    try {
        const resultados = await buscar(query.trim());

        if (resultados.length === 0) {
            return res.status(404).json({ status: false, error: 'No se encontraron resultados' });
        }

        const info = await obtenerInfo(resultados[0].enlace);

        return res.json({
            status: true,
            creator: 'elvigilante',
            fuente: 'APKMody',
            data: info,
            otros_resultados: resultados.slice(1).map(r => ({ titulo: r.titulo, enlace: r.enlace })),
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        res.status(500).json({
            status: false,
            error: error.message || 'Error al buscar el APK'
        });
    }
});

module.exports = router;
