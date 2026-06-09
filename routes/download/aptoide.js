const express = require('express');
const router = express.Router();
const axios = require('axios');

async function aptoideSearch(query) {
    try {
        // Buscar en la web de Aptoide
        const response = await axios({
            method: "GET",
            url: "https://aptoide.en.uptodown.com/android/search",
            params: {
                q: query
            },
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                "Accept-Language": "en-US,en;q=0.9",
            },
            timeout: 30000,
        });

        const html = response.data;
        const apps = [];
        
        // Extraer apps del HTML (patrones de uptodown/aptoide)
        const appRegex = /<div class="cell-app">[\s\S]*?<a href="([^"]+)"[\s\S]*?<img src="([^"]+)"[\s\S]*?<span class="name">([^<]+)<[\s\S]*?<span class="rating-count">([^<]+)<[\s\S]*?<span class="developer-name">([^<]+)</g;
        
        let match;
        while ((match = appRegex.exec(html)) !== null && apps.length < 10) {
            apps.push({
                name: match[3]?.trim() || "Sin nombre",
                url: match[1] || "",
                icon: match[2] || "",
                downloads: match[4]?.trim() || "N/A",
                developer: match[5]?.trim() || "Desconocido",
            });
        }

        if (apps.length === 0) {
            throw new Error("No se encontraron aplicaciones.");
        }

        // Para cada app, obtener más detalles
        const detailedApps = [];
        for (const app of apps.slice(0, 5)) { // Limitar a 5 para no sobrecargar
            try {
                const detailRes = await axios({
                    method: "GET",
                    url: app.url,
                    headers: { "User-Agent": "Mozilla/5.0" },
                    timeout: 15000,
                });
                
                const detailHtml = detailRes.data;
                
                // Extraer versión y tamaño
                const versionMatch = detailHtml.match(/Version:\s*<span[^>]*>([^<]+)</i);
                const sizeMatch = detailHtml.match(/Size:\s*<span[^>]*>([^<]+)</i);
                const descriptionMatch = detailHtml.match(/<div class="description"[^>]*>([\s\S]*?)<\/div>/i);
                
                detailedApps.push({
                    ...app,
                    version: versionMatch ? versionMatch[1].trim() : "N/A",
                    size: sizeMatch ? sizeMatch[1].trim() : "N/A",
                    description: descriptionMatch ? descriptionMatch[1].trim().substring(0, 200) : "",
                });
            } catch (e) {
                detailedApps.push({ ...app, version: "N/A", size: "N/A" });
            }
        }

        return detailedApps;
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
        const result = await aptoideSearch(query.trim());
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