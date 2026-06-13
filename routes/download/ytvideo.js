const axios = require('axios');

module.exports = function(app) {

    function extractVideoId(url) {
        const patterns = [
            /(?:youtube\.com\/watch\?v=)([^&]+)/,
            /(?:youtu\.be\/)([^?]+)/,
            /(?:youtube\.com\/embed\/)([^/?]+)/,
            /(?:youtube\.com\/v\/)([^/?]+)/
        ];
        for (const pattern of patterns) {
            const match = url.match(pattern);
            if (match) return match[1];
        }
        return null;
    }

    async function getVideoInfo(videoId) {
        // Usar oEmbed de YouTube (rápido, devuelve título y thumbnail)
        const oembed = await axios.get(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`, {
            timeout: 3000
        });
        return {
            title: oembed.data.title,
            thumbnail: oembed.data.thumbnail_url
        };
    }

    async function downloadYouTubeVideoFast(url, quality = "720") {
        const videoId = extractVideoId(url);
        if (!videoId) throw new Error("URL de YouTube inválida");

        // Llamada a cobalt.tools (rápida)
        const response = await axios.post("https://api.cobalt.tools/api/json", {
            url: `https://youtube.com/watch?v=${videoId}`,
            videoQuality: quality,
            audioFormat: "mp3",
            isAudioOnly: false
        }, {
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "User-Agent": "Mozilla/5.0"
            },
            timeout: 10000
        });

        if (response.data.status === "error") {
            throw new Error(response.data.text || "Error en la descarga");
        }

        // Obtener título y thumbnail vía oEmbed (puede hacerse en paralelo)
        const videoInfo = await getVideoInfo(videoId);

        return {
            success: true,
            title: videoInfo.title,
            thumbnail: videoInfo.thumbnail,
            download_url: response.data.url,
            quality: quality + "p",
            format: "MP4",
            videoId: videoId
        };
    }

    app.get('/', async (req, res) => {
        const { url, quality = '720' } = req.query;
        const endpointPrefix = req.baseUrl || '';

        if (!url) {
            return res.status(400).json({
                status: false,
                creator: "elvigilante",
                error: "Se requiere el parámetro URL"
            });
        }

        try {
            const result = await downloadYouTubeVideoFast(url, quality);
            
            if (req.query.download === 'true') {
                return res.redirect(result.download_url);
            }

            return res.json({
                status: true,
                creator: "elvigilante",
                result: {
                    title: result.title,
                    thumbnail: result.thumbnail,
                    quality: result.quality,
                    format: result.format,
                    download_url: result.download_url,
                    api_download: `${endpointPrefix}/?url=${encodeURIComponent(url)}&quality=${quality}&download=true`
                },
                timestamp: new Date().toISOString()
            });

        } catch (error) {
            return res.status(500).json({
                status: false,
                creator: "elvigilante",
                error: error.message
            });
        }
    });
};