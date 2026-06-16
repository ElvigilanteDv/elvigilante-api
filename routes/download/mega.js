const express = require('express');
const router = express.Router();
const axios = require('axios');

// GET /api/download/mega?url=https://mega.nz/file/xxx#key
router.get('/', async (req, res) => {
    const { url } = req.query;

    if (!url || !url.includes('mega.nz')) {
        return res.status(400).json({
            status: false,
            error: 'Debes proporcionar un link válido de MEGA'
        });
    }

    try {
        const response = await axios.get(`https://api.vevioz.com/api/mega?url=${encodeURIComponent(url)}`, {
            timeout: 30000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });

        const data = response.data;

        if (!data || data.error) {
            throw new Error(data?.error || 'No se pudo resolver el link de MEGA');
        }

        return res.json({
            status: true,
            creator: 'elvigilante',
            data,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        res.status(500).json({
            status: false,
            error: error.message || 'Error al procesar el link de MEGA'
        });
    }
});

module.exports = router;
