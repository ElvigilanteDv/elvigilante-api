const express = require('express');
const router = express.Router();
const yts = require('yt-search');

async function ytsearch(query) {
    try {
        const result = await yts(query);
        const videos = result.videos.slice(0, 10);
        
        if (!videos || videos.length === 0) {
            throw new Error("No se encontraron videos.");
        }
        return videos;
    } catch (error) {
        throw new Error(error.message);
    }
}

router.get('/', async (req, res) => {
    const query = req.query.query;

    if (!query || query.trim().length === 0) {
        return res.status(400).json({
            status: false,
            error: "El parámetro query es requerido"
        });
    }

    if (query.length > 100) {
        return res.status(400).json({
            status: false,
            error: "La búsqueda es demasiado larga"
        });
    }

    try {
        const result = await ytsearch(query.trim());
        res.json({
            status: true,
            creator: "elvigilante",
            data: result,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            error: error.message || "Internal Server Error"
        });
    }
});

module.exports = router;