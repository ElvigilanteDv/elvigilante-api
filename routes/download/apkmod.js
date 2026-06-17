const express = require('express');
const router = express.Router();
const axios = require('axios');

const HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    'Accept': 'application/json'
};

// GET /api/download/apkmod?query=vlc
router.get('/', async (req, res) => {
    const { query } = req.query;

    if (!query || query.trim().length === 0) {
        return res.status(400).json({ status: false, error: 'El parámetro query es requerido' });
    }

    try {
        // F-Droid tiene una API JSON oficial
        const { data } = await axios.get(`https://search.f-droid.org/?q=${encodeURIComponent(query)}&lang=en`, {
            headers: HEADERS,
            timeout: 15000
        });

        // Buscar en la API de índice de F-Droid
        const index = await axios.get(`https://f-droid.org/api/v1/packages/${encodeURIComponent(query.trim())}`, {
            headers: HEADERS,
            timeout: 15000
        });

        const pkg = index.data;

        return res.json({
            status: true,
            creator: 'elvigilante',
            fuente: 'F-Droid',
            data: {
                nombre: pkg.packageName,
                version: pkg.suggestedVersionName,
                version_code: pkg.suggestedVersionCode,
                url_descarga: `https://f-droid.org/repo/${pkg.packageName}_${pkg.suggestedVersionCode}.apk`,
                url_pagina: `https://f-droid.org/packages/${pkg.packageName}`
            },
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        res.status(500).json({
            status: false,
            error: 'No se encontró el paquete. Usa el package name exacto (ej: org.videolan.vlc)'
        });
    }
});

module.exports = router;
