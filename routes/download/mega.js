const express = require('express');
const router = express.Router();
const { File } = require('megajs');

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
        const file = File.fromURL(url);
        await file.loadAttributes();

        res.setHeader('Content-Disposition', `attachment; filename="${file.name}"`);
        res.setHeader('Content-Type', 'application/octet-stream');
        res.setHeader('Content-Length', file.size);

        const stream = file.download();

        stream.on('error', (err) => {
            console.error('Error descargando de MEGA:', err.message);
            if (!res.headersSent) {
                res.status(500).json({ status: false, error: err.message });
            }
        });

        stream.pipe(res);

    } catch (error) {
        res.status(500).json({
            status: false,
            error: error.message || 'Error al procesar el link de MEGA'
        });
    }
});

module.exports = router;
