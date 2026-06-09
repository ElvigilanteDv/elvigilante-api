const axios = require('axios');
const cheerio = require('cheerio');

module.exports = function(app) {

    async function downloadYouTubeVideo(url, quality = "360") {
        try {
            // Validar URL de YouTube
            const videoId = extractVideoId(url);
            if (!videoId) {
                return { success: false, error: "URL de YouTube inválida" };
            }

            // Obtener página del video
            const videoPage = await axios({
                method: "GET",
                url: `https://www.youtube.com/watch?v=${videoId}`,
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                    "Accept-Language": "en-US,en;q=0.9",
                },
                timeout: 15000,
            });

            const html = videoPage.data;
            
            // Extraer título
            const titleMatch = html.match(/<title>([^<]+)<\/title>/);
            const title = titleMatch ? titleMatch[1].replace(' - YouTube', '') : "Sin título";
            
            // Extraer thumbnail
            const thumbMatch = html.match(/https:\/\/i\.ytimg\.com\/vi\/[^\/]+\/maxresdefault\.jpg/);
            const thumbnail = thumbMatch ? thumbMatch[0] : `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

            // Extraer datos de formato (usando yt-dlp como alternativa más rápida)
            const formatData = await getVideoFormats(videoId);
            
            // Buscar el formato según calidad solicitada
            const qualityMap = {
                '144': '144p',
                '240': '240p',
                '360': '360p',
                '480': '480p',
                '720': '720p',
                '1080': '1080p'
            };
            
            const targetQuality = qualityMap[quality] || '360p';
            const selectedFormat = formatData.formats.find(f => f.quality === targetQuality && f.hasVideo);
            
            if (!selectedFormat) {
                return { success: false, error: `No se encontró formato para calidad ${targetQuality}` };
            }

            return {
                success: true,
                title: title,
                thumbnail: thumbnail,
                download_url: selectedFormat.url,
                videoId: videoId,
                quality: selectedFormat.quality,
                format: "MP4",
                size: selectedFormat.size || "Desconocido"
            };
            
        } catch (err) {
            return { success: false, error: err.message };
        }
    }

    // Extraer ID del video de YouTube
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

    // Obtener formatos de video (scraping a y2mate o similar)
    async function getVideoFormats(videoId) {
        // Usar y2mate.com para obtener URLs directas (más rápido)
        const y2mateUrl = `https://www.y2mate.com/youtube/${videoId}`;
        
        const response = await axios({
            method: "GET",
            url: y2mateUrl,
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            },
            timeout: 10000,
        });
        
        const html = response.data;
        const $ = cheerio.load(html);
        
        const formats = [];
        
        // Extraer formatos de video
        $('div[data-quality]').each((i, el) => {
            const quality = $(el).attr('data-quality');
            const url = $(el).attr('data-url');
            const size = $(el).find('.fsize').text();
            
            if (url && quality) {
                formats.push({
                    quality: quality,
                    url: url,
                    size: size,
                    hasVideo: true,
                    hasAudio: true
                });
            }
        });
        
        // Si no encuentra formatos, usar API alternativa rápida
        if (formats.length === 0) {
            const fallbackUrl = `https://api.cobalt.tools/api/json`;
            const cobaltResp = await axios({
                method: "POST",
                url: fallbackUrl,
                headers: { "Accept": "application/json", "Content-Type": "application/json" },
                data: { url: `https://youtube.com/watch?v=${videoId}`, videoQuality: "720" },
                timeout: 10000,
            });
            
            if (cobaltResp.data.status === "stream") {
                formats.push({
                    quality: "720p",
                    url: cobaltResp.data.url,
                    size: "Desconocido",
                    hasVideo: true,
                    hasAudio: true
                });
            }
        }
        
        return { formats };
    }

    // Versión ultra rápida usando cobalt.tools (recomendada)
    async function downloadYouTubeVideoFast(url, quality = "720") {
        try {
            const videoId = extractVideoId(url);
            if (!videoId) {
                return { success: false, error: "URL de YouTube inválida" };
            }
            
            // Cobalt.tools - API gratis y rápida
            const response = await axios({
                method: "POST",
                url: "https://api.cobalt.tools/api/json",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "User-Agent": "Mozilla/5.0"
                },
                data: {
                    url: `https://youtube.com/watch?v=${videoId}`,
                    videoQuality: quality,
                    audioFormat: "mp3",
                    isAudioOnly: false
                },
                timeout: 15000,
            });
            
            if (response.data.status === "error") {
                return { success: false, error: response.data.text || "Error en la descarga" };
            }
            
            // Obtener título del video
            const videoPage = await axios({
                method: "GET",
                url: `https://www.youtube.com/watch?v=${videoId}`,
                headers: { "User-Agent": "Mozilla/5.0" },
                timeout: 5000,
            });
            
            const titleMatch = videoPage.data.match(/<title>([^<]+)<\/title>/);
            const title = titleMatch ? titleMatch[1].replace(' - YouTube', '') : "Sin título";
            
            return {
                success: true,
                title: title,
                thumbnail: `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`,
                download_url: response.data.url,
                quality: quality + "p",
                format: "MP4",
                videoId: videoId
            };
            
        } catch (err) {
            return { success: false, error: err.message };
        }
    }

    // Endpoint para descargar video (versión rápida)
    app.get('/', async (req, res) => {
        const { url, quality = '720' } = req.query;
        const endpointPrefix = req.baseUrl || '';

        if (!url) {
            return res.status(400).json({
                status: false,
                creator: "elvigilante",
                error: "Se requiere el parámetro URL",
                message: "Uso: ?url=URL_DE_YOUTUBE"
            });
        }

        try {
            // Usar la versión rápida
            const result = await downloadYouTubeVideoFast(url, quality);

            if (!result.success) {
                return res.status(500).json({
                    status: false,
                    creator: "elvigilante",
                    error: result.error
                });
            }

            // Si se solicita descarga directa
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
                    api_download: `${endpointPrefix}/download/ytvideo?url=${encodeURIComponent(url)}&quality=${quality}&download=true`
                },
                timestamp: new Date().toISOString()
            });
            
        } catch (e) {
            return res.status(500).json({
                status: false,
                creator: "elvigilante",
                error: e.message || "Error interno del servidor"
            });
        }
    });
};