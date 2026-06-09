// En tu archivo de rutas (ej: routes/search.js)
const yts = require('yt-search');

router.get('/', async (req, res) => {
    const query = req.query.query;
    const apiKey = req.query.apiKey;
    
    // Validar apiKey...
    
    if (!query || query.trim().length === 0) {
        return res.status(400).json({ status: false, error: "Query requerido" });
    }
    
    try {
        const result = await yts(query.trim());
        const videos = result.videos.slice(0, 10);
        
        const formatted = videos.map(v => ({
            title: v.title,
            videoId: v.videoId,
            url: v.url,
            duration: v.duration,
            durationTimestamp: v.timestamp,
            views: v.views,
            thumbnail: v.thumbnail,
            author: v.author.name,
            authorId: v.author.channelId,
            publishedAt: v.ago,
            description: v.description
        }));
        
        res.json({
            status: true,
            creator: "elvigilante",
            data: formatted,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({ status: false, error: error.message });
    }
});