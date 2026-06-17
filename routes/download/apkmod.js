const express = require('express');
const router = express.Router();
const scrape = require('apkpure-scraper');

// GET /api/download/apkmod?query=com.mojang.minecraftpe
// o también por nombre: ?query=minecraft
router.get('/', async (req, res) => {
    const { query } = req.query;

    if (!query || query.trim().length === 0) {
        return res.status(400).json({ status: false, error: 'El parámetro query es requerido' });
    }

    try {
        const { downloadLink, title, version, type } = await scrape(query.trim());

        return res.json({
            status: true,
            creator: 'elvigilante',
            fuente: 'APKPure',
            data: {
                titulo: title,
                version,
                tipo: type,
                url_descarga: downloadLink
            },
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        res.status(500).json({
            status: false,
            error: error.message || 'Error al buscar el APK. Asegúrate de usar el package name (ej: com.mojang.minecraftpe)'
        });
    }
});

module.exports = router;
