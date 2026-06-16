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

        // Obtener link de descarga temporal
        const downloadUrl = await file.link();

        return res.json({
            status: true,
            creator: 'elvigilante',
            data: {
                nombre: file.name,
                tamaño: file.size,
                tamaño_legible: formatBytes(file.size),
                url_descarga: downloadUrl
            },
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        res.status(500).json({
            status: false,
            error: error.message || 'Error al procesar el link de MEGA'
        });
    }
});

function formatBytes(bytes) {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

module.exports = router;
