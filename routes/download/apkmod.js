const express = require('express');
const router = express.Router();
const axios = require('axios');
const cheerio = require('cheerio');

const HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0.0.0 Safari/537.36',
    'Accept-Language': 'en-US,en;q=0.9',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
};

async function buscarApk(query) {
    const { data } = await axios.get(`https://an1.com/index.php?do=search&subaction=search&story=${encodeURIComponent(query)}`, {
        headers: HEADERS,
        timeout: 15000
    });

    const $ = cheerio.load(data);
    const resultados = [];

    $('.shortstory, .short, article, .item').each((i, el) => {
        if (resultados.length >= 5) return false;

        const titulo = $(el).find('h2 a, .title a, h3 a').first().text().trim();
        const enlace = $(el).find('h2 a, .title a, h3 a').first().attr('href');
        const imagen = $(el).find('img').first().attr('src');
        const descripcion = $(el).find('p, .desc').first().text().trim().slice(0, 100);

        if (titulo && enlace) {
            resultados.push({ titulo, enlace, imagen, descripcion });
        }
    });

    return resultados;
}

async function obtenerDescarga(url) {
    const { data } = await axios.get(url, { headers: HEADERS, timeout: 15000 });
    const $ = cheerio.load(data);

    // Extraer info del APK
    const titulo = $('h1').first().text().trim();
    const imagen = $('img').first().attr('src');
    const version = $('li, span').filter((i, el) => $(el).text().includes('Version')).first().text().replace('Version:', '').trim();
    const tamaño = $('li, span').filter((i, el) => $(el).text().match(/\d+(\.\d+)?Mb/)).first().text().trim();

    // Link de descarga directo
    const linkDescarga = $('a[href*="file_"][href*="-dw"]').first().attr('href');
    let urlDescarga = null;

    if (linkDescarga) {
        const fullLink = linkDescarga.startsWith('http') ? linkDescarga : `https://an1.com${linkDescarga}`;

        // Seguir el link de descarga para obtener el APK real
        const res2 = await axios.get(fullLink, { headers: HEADERS, timeout: 15000, maxRedirects: 5 });
        const $2 = cheerio.load(res2.data);
        urlDescarga = $2('a[href$=".apk"]').first().attr('href') || $2('a[href*="download"]').first().attr('href') || fullLink;
    }

    return {
        titulo,
        imagen: imagen?.startsWith('http') ? imagen : `https://an1.com${imagen}`,
        version: version || null,
        tamaño: tamaño || null,
        url_pagina: url,
        url_descarga: urlDescarga
    };
}

// GET /api/download/apkmod?query=minecraft
router.get('/', async (req, res) => {
    const { query } = req.query;

    if (!query || query.trim().length === 0) {
        return res.status(400).json({ status: false, error: 'El parámetro query es requerido' });
    }

    try {
        // 1. Buscar el APK
        const resultados = await buscarApk(query.trim());

        if (resultados.length === 0) {
            return res.status(404).json({ status: false, error: 'No se encontraron resultados' });
        }

        // 2. Obtener info y descarga del primer resultado
        const primero = resultados[0];
        const info = await obtenerDescarga(primero.enlace);

        return res.json({
            status: true,
            creator: 'elvigilante',
            fuente: 'AN1.com',
            data: info,
            otros_resultados: resultados.slice(1),
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
