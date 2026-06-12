const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Cargar el JSON externo desde routes/gacha.json
const gachaPath = path.join(__dirname, 'gacha.json');
let characters = [];

try {
    const data = fs.readFileSync(gachaPath, 'utf8');
    characters = JSON.parse(data);
} catch (error) {
    console.error("Error cargando gacha.json:", error.message);
    characters = [];
}

// Función para obtener personajes por rareza
function getCharactersByRarity(rarity) {
    return characters.filter(c => c.rarity === rarity);
}

// Función para tirar gacha
function pullGacha() {
    // Probabilidades: SSR=5%, SR=25%, R=70%
    const random = Math.random() * 100;
    let rarity;
    
    if (random < 5) {
        rarity = "SSR";
    } else if (random < 30) {
        rarity = "SR";
    } else {
        rarity = "R";
    }
    
    const available = getCharactersByRarity(rarity);
    if (available.length === 0) return null;
    
    const selected = available[Math.floor(Math.random() * available.length)];
    return {
        name: selected.name,
        rarity: selected.rarity,
        attack: selected.attack,
        defense: selected.defense,
        health: selected.health,
        image: selected.image,
        pulledAt: new Date().toISOString()
    };
}

// 1. Tirada simple
router.get('/pull', async (req, res) => {
    try {
        const result = pullGacha();
        
        if (!result) {
            return res.status(500).json({
                status: false,
                error: "Error en el gacha"
            });
        }
        
        res.json({
            status: true,
            creator: "elvigilante",
            data: {
                pull: result,
                message: `🎉 Obtuviste a ${result.name} (${result.rarity})!`
            },
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            error: error.message || "Internal Server Error"
        });
    }
});

// 2. Multi-pull (10 tiradas)
router.get('/multipull', async (req, res) => {
    try {
        const pulls = [];
        const rarityCount = { R: 0, SR: 0, SSR: 0 };
        
        for (let i = 0; i < 10; i++) {
            const pull = pullGacha();
            if (pull) {
                pulls.push(pull);
                rarityCount[pull.rarity]++;
            }
        }
        
        res.json({
            status: true,
            creator: "elvigilante",
            data: {
                pulls: pulls,
                summary: {
                    total: pulls.length,
                    R: rarityCount.R,
                    SR: rarityCount.SR,
                    SSR: rarityCount.SSR
                }
            },
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            error: error.message || "Internal Server Error"
        });
    }
});

// 3. Obtener todos los personajes
router.get('/characters', async (req, res) => {
    const { rarity, search } = req.query;
    
    try {
        let results = [...characters];
        
        if (rarity && ['R', 'SR', 'SSR'].includes(rarity.toUpperCase())) {
            results = results.filter(c => c.rarity === rarity.toUpperCase());
        }
        
        if (search) {
            results = results.filter(c => 
                c.name.toLowerCase().includes(search.toLowerCase())
            );
        }
        
        if (results.length === 0) {
            return res.status(404).json({
                status: false,
                error: "No se encontraron personajes"
            });
        }
        
        res.json({
            status: true,
            creator: "elvigilante",
            total: results.length,
            data: results.slice(0, 50),
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            error: error.message || "Internal Server Error"
        });
    }
});

// 4. Obtener personaje por índice
router.get('/character/:id', async (req, res) => {
    const { id } = req.params;
    
    try {
        const index = parseInt(id);
        if (isNaN(index) || index < 0 || index >= characters.length) {
            return res.status(404).json({
                status: false,
                error: "Personaje no encontrado"
            });
        }
        
        res.json({
            status: true,
            creator: "elvigilante",
            data: characters[index],
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            error: error.message || "Internal Server Error"
        });
    }
});

// 5. Estadísticas del gacha
router.get('/stats', async (req, res) => {
    try {
        const total = characters.length;
        const rCount = characters.filter(c => c.rarity === "R").length;
        const srCount = characters.filter(c => c.rarity === "SR").length;
        const ssrCount = characters.filter(c => c.rarity === "SSR").length;
        
        const avgAttack = characters.reduce((sum, c) => sum + c.attack, 0) / total;
        const avgDefense = characters.reduce((sum, c) => sum + c.defense, 0) / total;
        const avgHealth = characters.reduce((sum, c) => sum + c.health, 0) / total;
        
        res.json({
            status: true,
            creator: "elvigilante",
            data: {
                totalCharacters: total,
                rarityDistribution: {
                    R: { count: rCount, percentage: ((rCount / total) * 100).toFixed(1) + "%" },
                    SR: { count: srCount, percentage: ((srCount / total) * 100).toFixed(1) + "%" },
                    SSR: { count: ssrCount, percentage: ((ssrCount / total) * 100).toFixed(1) + "%" }
                },
                averageStats: {
                    attack: Math.round(avgAttack),
                    defense: Math.round(avgDefense),
                    health: Math.round(avgHealth)
                },
                pullRates: {
                    R: "70%",
                    SR: "25%",
                    SSR: "5%"
                }
            },
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