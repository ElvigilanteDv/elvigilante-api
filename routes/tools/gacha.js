const express = require('express');
const router = express.Router();

// ============ TODOS LOS PERSONAJES (EMBEBIDOS) ============
const characters = [
  {
    "name": "Sakura Haruno",
    "rarity": "SR",
    "attack": 75,
    "defense": 65,
    "health": 85,
    "image": "https://files.catbox.moe/uhdhug.jpg"
  },
  {
    "name": "Monkey D. Luffy",
    "rarity": "SSR",
    "attack": 95,
    "defense": 80,
    "health": 100,
    "image": "https://files.catbox.moe/vnpmpc.jpg"
  },
  {
    "name": "Naruto Uzumaki",
    "rarity": "SSR",
    "attack": 98,
    "defense": 75,
    "health": 100,
    "image": "https://files.catbox.moe/97jxxj.jpg"
  },
  {
    "name": "Sasuke Uchiha",
    "rarity": "SSR",
    "attack": 96,
    "defense": 70,
    "health": 90,
    "image": "https://files.catbox.moe/kmex7w.jpg"
  },
  {
    "name": "Kakashi Hatake",
    "rarity": "SR",
    "attack": 85,
    "defense": 75,
    "health": 88,
    "image": "https://files.catbox.moe/m0d9kj.jpg"
  },
  {
    "name": "Itachi Uchiha",
    "rarity": "SSR",
    "attack": 99,
    "defense": 85,
    "health": 80,
    "image": "https://files.catbox.moe/j13ew6.jpg"
  },
  {
    "name": "Sai",
    "rarity": "R",
    "attack": 60,
    "defense": 50,
    "health": 70,
    "image": "https://files.catbox.moe/rkv6ry.jpg"
  },
  {
    "name": "Gaara",
    "rarity": "SR",
    "attack": 88,
    "defense": 92,
    "health": 85,
    "image": "https://files.catbox.moe/y5jlve.jpg"
  },
  {
    "name": "Rock Lee",
    "rarity": "SR",
    "attack": 90,
    "defense": 60,
    "health": 82,
    "image": "https://files.catbox.moe/h8epf6.jpg"
  },
  {
    "name": "Hinata Hyuga",
    "rarity": "SR",
    "attack": 78,
    "defense": 72,
    "health": 80,
    "image": "https://files.catbox.moe/1y9l8h.jpg"
  },
  {
    "name": "Minato Namikaze",
    "rarity": "SSR",
    "attack": 97,
    "defense": 80,
    "health": 88,
    "image": "https://files.catbox.moe/kwlnb2.jpg"
  },
  {
    "name": "Madara Uchiha",
    "rarity": "SSR",
    "attack": 120,
    "defense": 110,
    "health": 105,
    "image": "https://files.catbox.moe/m0bblt.jpg"
  },
  {
    "name": "Obito Uchiha",
    "rarity": "SSR",
    "attack": 110,
    "defense": 95,
    "health": 98,
    "image": "https://files.catbox.moe/73jrvw.jpg"
  },
  {
    "name": "Pain (Nagato)",
    "rarity": "SSR",
    "attack": 115,
    "defense": 100,
    "health": 95,
    "image": "https://files.catbox.moe/23ckuq.jpg"
  },
  {
    "name": "Roronoa Zoro",
    "rarity": "SSR",
    "attack": 93,
    "defense": 78,
    "health": 95,
    "image": "https://files.catbox.moe/18e2ni.jpg"
  },
  {
    "name": "Nami",
    "rarity": "SR",
    "attack": 65,
    "defense": 55,
    "health": 70,
    "image": "https://files.catbox.moe/pcdedo.jpg"
  },
  {
    "name": "Sanji",
    "rarity": "SR",
    "attack": 88,
    "defense": 70,
    "health": 85,
    "image": "https://files.catbox.moe/025kml.jpg"
  },
  {
    "name": "Nico Robin",
    "rarity": "SR",
    "attack": 80,
    "defense": 68,
    "health": 78,
    "image": "https://files.catbox.moe/ca5zk2.jpg"
  },
  {
    "name": "Portgas D. Ace",
    "rarity": "SSR",
    "attack": 96,
    "defense": 80,
    "health": 92,
    "image": "https://files.catbox.moe/3v02ej.jpg"
  },
  {
    "name": "Trafalgar Law",
    "rarity": "SSR",
    "attack": 92,
    "defense": 82,
    "health": 90,
    "image": "https://files.catbox.moe/c5arcp.jpg"
  },
  {
    "name": "Shanks",
    "rarity": "SSR",
    "attack": 118,
    "defense": 105,
    "health": 110,
    "image": "https://files.catbox.moe/rftjst.jpg"
  },
  {
    "name": "Whitebeard",
    "rarity": "SSR",
    "attack": 125,
    "defense": 115,
    "health": 130,
    "image": "https://files.catbox.moe/f75ht7.jpg"
  },
  {
    "name": "Kaido",
    "rarity": "SSR",
    "attack": 130,
    "defense": 120,
    "health": 140,
    "image": "https://files.catbox.moe/5ao2g2.jpg"
  },
  {
    "name": "Elizabeth",
    "rarity": "SR",
    "attack": 98,
    "defense": 46,
    "health": 79,
    "image": "https://files.catbox.moe/5k78pq.jpg"
  },
  {
    "name": "Capitan Meliodas",
    "rarity": "SR",
    "attack": 199,
    "defense": 135,
    "health": 130,
    "image": "https://files.catbox.moe/mwp430.jpg"
  },
  {
    "name": "Merlin",
    "rarity": "SR",
    "attack": 192,
    "defense": 160,
    "health": 111,
    "image": "https://files.catbox.moe/srjvdy.jpg"
  },
  {
    "name": "Diana +",
    "rarity": "SR",
    "attack": 111,
    "defense": 120,
    "health": 101,
    "image": "https://files.catbox.moe/m6956p.jpg"
  },
  {
    "name": "Ban",
    "rarity": "SR",
    "attack": 120,
    "defense": 60,
    "health": 97,
    "image": "https://files.catbox.moe/469hzw.jpg"
  },
  {
    "name": "Escanor",
    "rarity": "SR",
    "attack": 212,
    "defense": 190,
    "health": 211,
    "image": "https://files.catbox.moe/moiuh3.jpg"
  },
  {
    "name": "King",
    "rarity": "SR",
    "attack": 200,
    "defense": 150,
    "health": 111,
    "image": "https://files.catbox.moe/txmu65.jpg"
  },
  {
    "name": "Gowter",
    "rarity": "SR",
    "attack": 215,
    "defense": 130,
    "health": 181,
    "image": "https://files.catbox.moe/fw4tzu.jpg"
  },
  {
    "name": "Zeldris",
    "rarity": "SSR",
    "attack": 230,
    "defense": 200,
    "health": 195,
    "image": "https://files.catbox.moe/pv0mqp.jpg"
  },
  {
    "name": "Estarossa",
    "rarity": "SSR",
    "attack": 220,
    "defense": 190,
    "health": 200,
    "image": "https://files.catbox.moe/tykq74.jpg"
  },
  {
    "name": "Gilthunder",
    "rarity": "R",
    "attack": 95,
    "defense": 80,
    "health": 90,
    "image": "https://files.catbox.moe/5r7yj1.jpg"
  },
  {
    "name": "Goku Ultra",
    "rarity": "SSR",
    "attack": 412,
    "defense": 290,
    "health": 311,
    "image": "https://files.catbox.moe/knq1kn.jpg"
  },
  {
    "name": "Super Broly",
    "rarity": "SSR",
    "attack": 312,
    "defense": 290,
    "health": 211,
    "image": "https://files.catbox.moe/qsjxr3.jpg"
  },
  {
    "name": "Bills",
    "rarity": "SSR",
    "attack": 412,
    "defense": 390,
    "health": 211,
    "image": "https://files.catbox.moe/ufs5u8.jpg"
  },
  {
    "name": "Jiren",
    "rarity": "SSR",
    "attack": 412,
    "defense": 390,
    "health": 211,
    "image": "https://files.catbox.moe/3b0q9b.jpg"
  },
  {
    "name": "Begeta",
    "rarity": "SSR",
    "attack": 412,
    "defense": 390,
    "health": 211,
    "image": "https://files.catbox.moe/4z3x45.jpg"
  },
  {
    "name": "Goku Black",
    "rarity": "SSR",
    "attack": 512,
    "defense": 490,
    "health": 311,
    "image": "https://files.catbox.moe/2yj3m0.jpg"
  },
  {
    "name": "Gohan Beast",
    "rarity": "SSR",
    "attack": 450,
    "defense": 380,
    "health": 360,
    "image": "https://files.catbox.moe/7w0fz9.jpg"
  },
  {
    "name": "Frieza Golden",
    "rarity": "SSR",
    "attack": 430,
    "defense": 400,
    "health": 320,
    "image": "https://files.catbox.moe/9pmv6j.jpg"
  },
  {
    "name": "Cell Perfecto",
    "rarity": "SSR",
    "attack": 400,
    "defense": 380,
    "health": 350,
    "image": "https://files.catbox.moe/zwjq2y.jpg"
  },
  {
    "name": "Majin Buu",
    "rarity": "SSR",
    "attack": 390,
    "defense": 370,
    "health": 500,
    "image": "https://files.catbox.moe/xd1jlq.jpg"
  },
  {
    "name": "Piccolo",
    "rarity": "SR",
    "attack": 280,
    "defense": 260,
    "health": 270,
    "image": "https://files.catbox.moe/2oipzf.jpg"
  },
  {
    "name": "Trunks del Futuro",
    "rarity": "SR",
    "attack": 310,
    "defense": 270,
    "health": 285,
    "image": "https://files.catbox.moe/9vc00a.jpg"
  },
  {
    "name": "Whis",
    "rarity": "SSR",
    "attack": 600,
    "defense": 590,
    "health": 400,
    "image": "https://files.catbox.moe/f9qh0h.jpg"
  },
  {
    "name": "Zamasu",
    "rarity": "SSR",
    "attack": 490,
    "defense": 460,
    "health": 380,
    "image": "https://files.catbox.moe/nk4106.jpg"
  },
  {
    "name": "Tanjiro Kamado",
    "rarity": "SR",
    "attack": 180,
    "defense": 140,
    "health": 175,
    "image": "https://files.catbox.moe/z0gw2u.jpg"
  },
  {
    "name": "Nezuko Kamado",
    "rarity": "SR",
    "attack": 165,
    "defense": 130,
    "health": 160,
    "image": "https://files.catbox.moe/gzn3vp.jpg"
  },
  {
    "name": "Zenitsu Agatsuma",
    "rarity": "SR",
    "attack": 195,
    "defense": 110,
    "health": 145,
    "image": "https://files.catbox.moe/s9uzqo.jpg"
  },
  {
    "name": "Inosuke Hashibira",
    "rarity": "SR",
    "attack": 185,
    "defense": 125,
    "health": 170,
    "image": "https://files.catbox.moe/qe8ckz.jpg"
  },
  {
    "name": "Muzan Kibutsuji",
    "rarity": "SSR",
    "attack": 480,
    "defense": 420,
    "health": 400,
    "image": "https://files.catbox.moe/nmpixb.webp"
  },
  {
    "name": "Rengoku",
    "rarity": "SSR",
    "attack": 350,
    "defense": 280,
    "health": 300,
    "image": "https://files.catbox.moe/r4rm9s.jpg"
  },
  {
    "name": "Gyutaro",
    "rarity": "SSR",
    "attack": 420,
    "defense": 350,
    "health": 380,
    "image": "https://files.catbox.moe/1m8rb2.jpg"
  },
  {
    "name": "Mitsuri Kanroji",
    "rarity": "SSR",
    "attack": 430,
    "defense": 360,
    "health": 400,
    "image": "https://files.catbox.moe/ah76d8.jpg"
  },
  {
    "name": "Tengen Uzui",
    "rarity": "SSR",
    "attack": 410,
    "defense": 340,
    "health": 380,
    "image": "https://files.catbox.moe/0xgqbs.jpg"
  },
  {
    "name": "Sanemi Shinazugawa",
    "rarity": "SSR",
    "attack": 420,
    "defense": 350,
    "health": 390,
    "image": "https://files.catbox.moe/m8i9fm.jpg"
  },
  {
    "name": "Giyu Tomioka",
    "rarity": "SSR",
    "attack": 415,
    "defense": 360,
    "health": 385,
    "image": "https://files.catbox.moe/jgf525.jpg"
  },
  {
    "name": "Kanao Tsuyuri",
    "rarity": "SR",
    "attack": 300,
    "defense": 260,
    "health": 280,
    "image": "https://files.catbox.moe/crhxp8.jpg"
  },
  {
    "name": "Akaza",
    "rarity": "SSR",
    "attack": 450,
    "defense": 380,
    "health": 420,
    "image": "https://files.catbox.moe/hyiogz.jpg"
  },
  {
    "name": "Doma",
    "rarity": "SSR",
    "attack": 460,
    "defense": 400,
    "health": 430,
    "image": "https://files.catbox.moe/58b23y.jpg"
  },
  {
    "name": "Kokushibo",
    "rarity": "SSR",
    "attack": 475,
    "defense": 410,
    "health": 440,
    "image": "https://files.catbox.moe/xywu2r.jpg"
  },
  {
    "name": "Eren Yeager",
    "rarity": "SSR",
    "attack": 460,
    "defense": 350,
    "health": 420,
    "image": "https://files.catbox.moe/8u7jwz.jpg"
  },
  {
    "name": "Levi Ackerman",
    "rarity": "SSR",
    "attack": 440,
    "defense": 310,
    "health": 360,
    "image": "https://files.catbox.moe/8dk6ss.jpg"
  },
  {
    "name": "Mikasa Ackerman",
    "rarity": "SR",
    "attack": 300,
    "defense": 250,
    "health": 290,
    "image": "https://files.catbox.moe/pbpkdd.jpg"
  },
  {
    "name": "Armin Arlert",
    "rarity": "SR",
    "attack": 220,
    "defense": 200,
    "health": 240,
    "image": "https://files.catbox.moe/pz8r1a.jpg"
  },
  {
    "name": "Reiner Braun",
    "rarity": "SR",
    "attack": 310,
    "defense": 340,
    "health": 380,
    "image": "https://files.catbox.moe/klrurx.jpg"
  },
  {
    "name": "Bertholdt Hoover",
    "rarity": "SR",
    "attack": 320,
    "defense": 310,
    "health": 350,
    "image": "https://files.catbox.moe/lrx63z.jpg"
  },
  {
    "name": "Annie Leonhart",
    "rarity": "SR",
    "attack": 330,
    "defense": 300,
    "health": 320,
    "image": "https://files.catbox.moe/0gnbc7.jpg"
  },
  {
    "name": "Erwin Smith",
    "rarity": "SR",
    "attack": 270,
    "defense": 260,
    "health": 300,
    "image": "https://files.catbox.moe/bb8xcd.jpg"
  },
  {
    "name": "Hange Zoe",
    "rarity": "SR",
    "attack": 255,
    "defense": 245,
    "health": 270,
    "image": "https://files.catbox.moe/591o0l.jpg"
  },
  {
    "name": "Zeke Yeager",
    "rarity": "SSR",
    "attack": 430,
    "defense": 380,
    "health": 400,
    "image": "https://files.catbox.moe/0wgp4b.jpg"
  },
  {
    "name": "Izuku Midoriya",
    "rarity": "SR",
    "attack": 260,
    "defense": 210,
    "health": 255,
    "image": "https://files.catbox.moe/xm761t.jpg"
  },
  {
    "name": "All Might",
    "rarity": "SSR",
    "attack": 500,
    "defense": 450,
    "health": 480,
    "image": "https://files.catbox.moe/5rzb1a.jpg"
  },
  {
    "name": "Katsuki Bakugo",
    "rarity": "SR",
    "attack": 290,
    "defense": 200,
    "health": 245,
    "image": "https://files.catbox.moe/j6khwr.jpg"
  },
  {
    "name": "Shoto Todoroki",
    "rarity": "SR",
    "attack": 275,
    "defense": 230,
    "health": 260,
    "image": "https://files.catbox.moe/bujrs6.jpg"
  },
  {
    "name": "Tomura Shigaraki",
    "rarity": "SSR",
    "attack": 470,
    "defense": 380,
    "health": 390,
    "image": "https://files.catbox.moe/go28pv.jpg"
  },
  {
    "name": "Endeavor",
    "rarity": "SR",
    "attack": 380,
    "defense": 310,
    "health": 350,
    "image": "https://files.catbox.moe/2vt82w.jpg"
  },
  {
    "name": "Hawks",
    "rarity": "SR",
    "attack": 360,
    "defense": 290,
    "health": 320,
    "image": "https://files.catbox.moe/f1kbtd.jpg"
  },
  {
    "name": "Toga Himiko",
    "rarity": "SR",
    "attack": 310,
    "defense": 250,
    "health": 280,
    "image": "https://files.catbox.moe/1u57zy.jpg"
  },
  {
    "name": "Dabi",
    "rarity": "SR",
    "attack": 370,
    "defense": 280,
    "health": 300,
    "image": "https://files.catbox.moe/csz7t9.jpg"
  },
  {
    "name": "Overhaul",
    "rarity": "SSR",
    "attack": 450,
    "defense": 400,
    "health": 380,
    "image": "https://files.catbox.moe/3r6kk1.jpg"
  },
  {
    "name": "Ochaco Uraraka",
    "rarity": "SR",
    "attack": 240,
    "defense": 220,
    "health": 235,
    "image": "https://files.catbox.moe/tm5ytr.jpg"
  },
  {
    "name": "Tenya Iida",
    "rarity": "SR",
    "attack": 250,
    "defense": 240,
    "health": 245,
    "image": "https://files.catbox.moe/nxukao.jpg"
  },
  {
    "name": "Ichigo Kurosaki",
    "rarity": "SSR",
    "attack": 450,
    "defense": 360,
    "health": 400,
    "image": "https://files.catbox.moe/779iig.jpg"
  },
  {
    "name": "Rukia Kuchiki",
    "rarity": "SR",
    "attack": 230,
    "defense": 210,
    "health": 220,
    "image": "https://files.catbox.moe/x99uz8.jpg"
  },
  {
    "name": "Aizen Sosuke",
    "rarity": "SSR",
    "attack": 530,
    "defense": 500,
    "health": 460,
    "image": "https://files.catbox.moe/xxc08t.jpg"
  },
  {
    "name": "Byakuya Kuchiki",
    "rarity": "SSR",
    "attack": 420,
    "defense": 390,
    "health": 350,
    "image": "https://files.catbox.moe/v8l3lw.jpg"
  },
  {
    "name": "Renji Abarai",
    "rarity": "SR",
    "attack": 290,
    "defense": 260,
    "health": 280,
    "image": "https://files.catbox.moe/irdods.jpg"
  },
  {
    "name": "Toshiro Hitsugaya",
    "rarity": "SR",
    "attack": 310,
    "defense": 280,
    "health": 270,
    "image": "https://files.catbox.moe/r1g32g.jpg"
  },
  {
    "name": "Yoruichi Shihoin",
    "rarity": "SSR",
    "attack": 430,
    "defense": 400,
    "health": 380,
    "image": "https://files.catbox.moe/pmqupj.jpg"
  },
  {
    "name": "Kisuke Urahara",
    "rarity": "SSR",
    "attack": 480,
    "defense": 450,
    "health": 420,
    "image": "https://files.catbox.moe/xflbr7.jpg"
  },
  {
    "name": "Grimmjow",
    "rarity": "SSR",
    "attack": 440,
    "defense": 370,
    "health": 390,
    "image": "https://files.catbox.moe/idb8tm.jpg"
  },
  {
    "name": "Ulquiorra Cifer",
    "rarity": "SSR",
    "attack": 500,
    "defense": 460,
    "health": 430,
    "image": "https://files.catbox.moe/dcnfr3.jpg"
  },
  {
    "name": "Kenpachi Zaraki",
    "rarity": "SSR",
    "attack": 510,
    "defense": 350,
    "health": 500,
    "image": "https://files.catbox.moe/vir9m2.jpg"
  },
  {
    "name": "Saitama",
    "rarity": "SSR",
    "attack": 9999,
    "defense": 9999,
    "health": 9999,
    "image": "https://files.catbox.moe/6dgp8q.jpg"
  },
  {
    "name": "Genos",
    "rarity": "SR",
    "attack": 310,
    "defense": 270,
    "health": 280,
    "image": "https://files.catbox.moe/evcubo.jpg"
  },
  {
    "name": "Garou",
    "rarity": "SSR",
    "attack": 480,
    "defense": 410,
    "health": 430,
    "image": "https://files.catbox.moe/oewn2z.jpg"
  },
  {
    "name": "Speed-o'-Sound Sonic",
    "rarity": "SR",
    "attack": 320,
    "defense": 260,
    "health": 290,
    "image": "https://files.catbox.moe/653jhk.jpg"
  },
  {
    "name": "Bang",
    "rarity": "SSR",
    "attack": 450,
    "defense": 420,
    "health": 400,
    "image": "https://files.catbox.moe/wxilsa.jpg"
  },
  {
    "name": "Tatsumaki",
    "rarity": "SSR",
    "attack": 520,
    "defense": 480,
    "health": 390,
    "image": "https://files.catbox.moe/3vjtj6.jpg"
  },
  {
    "name": "Fubuki",
    "rarity": "SR",
    "attack": 330,
    "defense": 300,
    "health": 310,
    "image": "https://files.catbox.moe/e9oj80.jpg"
  },
  {
    "name": "King",
    "rarity": "R",
    "attack": 50,
    "defense": 40,
    "health": 60,
    "image": "https://files.catbox.moe/27w7ud.jpg"
  },
  {
    "name": "Gon Freecss",
    "rarity": "SR",
    "attack": 270,
    "defense": 220,
    "health": 265,
    "image": "https://files.catbox.moe/ib71zi.jpg"
  },
  {
    "name": "Killua Zoldyck",
    "rarity": "SR",
    "attack": 285,
    "defense": 240,
    "health": 255,
    "image": "https://files.catbox.moe/pz6p2i.jpg"
  },
  {
    "name": "Hisoka",
    "rarity": "SSR",
    "attack": 430,
    "defense": 370,
    "health": 380,
    "image": "https://files.catbox.moe/81wl2f.jpg"
  },
  {
    "name": "Meruem",
    "rarity": "SSR",
    "attack": 560,
    "defense": 520,
    "health": 500,
    "image": "https://files.catbox.moe/efztjc.jpg"
  },
  {
    "name": "Kurapika",
    "rarity": "SR",
    "attack": 300,
    "defense": 260,
    "health": 270,
    "image": "https://files.catbox.moe/c77ovf.jpg"
  },
  {
    "name": "Leorio",
    "rarity": "R",
    "attack": 160,
    "defense": 140,
    "health": 200,
    "image": "https://files.catbox.moe/oewsch.jpg"
  },
  {
    "name": "Chrollo Lucilfer",
    "rarity": "SSR",
    "attack": 500,
    "defense": 460,
    "health": 440,
    "image": "https://files.catbox.moe/f7n1og.jpg"
  },
  {
    "name": "Illumi Zoldyck",
    "rarity": "SSR",
    "attack": 470,
    "defense": 420,
    "health": 400,
    "image": "https://files.catbox.moe/oddsvh.jpg"
  },
  {
    "name": "Netero",
    "rarity": "SSR",
    "attack": 550,
    "defense": 500,
    "health": 480,
    "image": "https://files.catbox.moe/3gqwnb.jpg"
  },
  {
    "name": "Natsu Dragneel",
    "rarity": "SR",
    "attack": 290,
    "defense": 200,
    "health": 280,
    "image": "https://files.catbox.moe/s91ojb.jpg"
  },
  {
    "name": "Erza Scarlet",
    "rarity": "SR",
    "attack": 275,
    "defense": 260,
    "health": 270,
    "image": "https://files.catbox.moe/to7886.jpg"
  },
  {
    "name": "Zeref",
    "rarity": "SSR",
    "attack": 510,
    "defense": 460,
    "health": 440,
    "image": "https://files.catbox.moe/pl9539.jpg"
  },
  {
    "name": "Gray Fullbuster",
    "rarity": "SR",
    "attack": 260,
    "defense": 240,
    "health": 255,
    "image": "https://files.catbox.moe/woucnk.jpg"
  },
  {
    "name": "Lucy Heartfilia",
    "rarity": "SR",
    "attack": 230,
    "defense": 210,
    "health": 220,
    "image": "https://files.catbox.moe/q1wana.jpg"
  },
  {
    "name": "Gildarts Clive",
    "rarity": "SSR",
    "attack": 490,
    "defense": 440,
    "health": 460,
    "image": "https://files.catbox.moe/u6bhej.jpg"
  },
  {
    "name": "Mavis Vermillion",
    "rarity": "SSR",
    "attack": 530,
    "defense": 480,
    "health": 420,
    "image": "https://files.catbox.moe/hv8oah.jpg"
  },
  {
    "name": "Wendy Marvell",
    "rarity": "SR",
    "attack": 240,
    "defense": 230,
    "health": 235,
    "image": "https://files.catbox.moe/srmop9.jpg"
  },
  {
    "name": "Laxus Dreyar",
    "rarity": "SSR",
    "attack": 460,
    "defense": 400,
    "health": 430,
    "image": "https://files.catbox.moe/5hdpk0.jpg"
  },
  {
    "name": "Yuji Itadori",
    "rarity": "SR",
    "attack": 280,
    "defense": 230,
    "health": 275,
    "image": "https://files.catbox.moe/377c9x.jpg"
  },
  {
    "name": "Gojo Satoru",
    "rarity": "SSR",
    "attack": 590,
    "defense": 560,
    "health": 520,
    "image": "https://files.catbox.moe/s5r0m6.jpg"
  },
  {
    "name": "Ryomen Sukuna",
    "rarity": "SSR",
    "attack": 620,
    "defense": 540,
    "health": 550,
    "image": "https://files.catbox.moe/t2tcos.jpg"
  },
  {
    "name": "Megumi Fushiguro",
    "rarity": "SR",
    "attack": 255,
    "defense": 240,
    "health": 250,
    "image": "https://files.catbox.moe/fm7247.jpg"
  },
  {
    "name": "Nobara Kugisaki",
    "rarity": "SR",
    "attack": 270,
    "defense": 230,
    "health": 255,
    "image": "https://files.catbox.moe/u1iebt.jpg"
  },
  {
    "name": "Nanami Kento",
    "rarity": "SR",
    "attack": 300,
    "defense": 280,
    "health": 290,
    "image": "https://files.catbox.moe/mrksde.jpg"
  },
  {
    "name": "Toji Fushiguro",
    "rarity": "SSR",
    "attack": 530,
    "defense": 460,
    "health": 480,
    "image": "https://files.catbox.moe/b951vx.jpg"
  },
  {
    "name": "Yuta Okkotsu",
    "rarity": "SSR",
    "attack": 570,
    "defense": 520,
    "health": 510,
    "image": "https://files.catbox.moe/1ifml0.jpg"
  },
  {
    "name": "Maki Zenin",
    "rarity": "SR",
    "attack": 310,
    "defense": 290,
    "health": 300,
    "image": "https://files.catbox.moe/254t85.jpg"
  },
  {
    "name": "Aoi Todo",
    "rarity": "SR",
    "attack": 320,
    "defense": 270,
    "health": 310,
    "image": "https://files.catbox.moe/jvwxh4.jpg"
  },
  {
    "name": "Ken Kaneki",
    "rarity": "SSR",
    "attack": 480,
    "defense": 400,
    "health": 420,
    "image": "https://files.catbox.moe/5z6xyr.jpg"
  },
  {
    "name": "Touka Kirishima",
    "rarity": "SR",
    "attack": 280,
    "defense": 240,
    "health": 260,
    "image": "https://files.catbox.moe/jf5xmk.jpg"
  },
  {
    "name": "Rize Kamishiro",
    "rarity": "SR",
    "attack": 310,
    "defense": 220,
    "health": 270,
    "image": "https://files.catbox.moe/tfig3e.jpg"
  },
  {
    "name": "Eto Yoshimura",
    "rarity": "SSR",
    "attack": 520,
    "defense": 430,
    "health": 460,
    "image": "https://files.catbox.moe/shl110.jpg"
  },
  {
    "name": "Juuzou Suzuya",
    "rarity": "SR",
    "attack": 330,
    "defense": 220,
    "health": 280,
    "image": "https://files.catbox.moe/849j8b.jpg"
  },
  {
    "name": "Kishou Arima",
    "rarity": "SSR",
    "attack": 500,
    "defense": 460,
    "health": 440,
    "image": "https://files.catbox.moe/wj4ejw.jpg"
  },
  {
    "name": "Nishiki Nishio",
    "rarity": "R",
    "attack": 180,
    "defense": 160,
    "health": 200,
    "image": "https://files.catbox.moe/6o246i.jpg"
  },
  {
    "name": "Asta",
    "rarity": "SR",
    "attack": 300,
    "defense": 260,
    "health": 290,
    "image": "https://files.catbox.moe/lx51ax.jpg"
  },
  {
    "name": "Yuno",
    "rarity": "SR",
    "attack": 320,
    "defense": 250,
    "health": 280,
    "image": "https://files.catbox.moe/0d06uq.jpg"
  },
  {
    "name": "Yami Sukehiro",
    "rarity": "SSR",
    "attack": 460,
    "defense": 380,
    "health": 400,
    "image": "https://files.catbox.moe/298a52.jpg"
  },
  {
    "name": "Luck Voltia",
    "rarity": "SR",
    "attack": 290,
    "defense": 200,
    "health": 250,
    "image": "https://files.catbox.moe/zvvnhc.jpg"
  },
  {
    "name": "Noelle Silva",
    "rarity": "SR",
    "attack": 270,
    "defense": 280,
    "health": 275,
    "image": "https://files.catbox.moe/0ncajk.jpg"
  },
  {
    "name": "Julius Novachrono",
    "rarity": "SSR",
    "attack": 500,
    "defense": 470,
    "health": 460,
    "image": "https://files.catbox.moe/s0h26p.jpg"
  },
  {
    "name": "Dante Zogratis",
    "rarity": "SSR",
    "attack": 480,
    "defense": 450,
    "health": 470,
    "image": "https://files.catbox.moe/qgltlk.jpg"
  },
  {
    "name": "Zenon Zogratis",
    "rarity": "SSR",
    "attack": 470,
    "defense": 460,
    "health": 450,
    "image": "https://files.catbox.moe/t29o79.jpg"
  },
  {
    "name": "Mereoleona Vermillion",
    "rarity": "SSR",
    "attack": 455,
    "defense": 390,
    "health": 430,
    "image": "https://files.catbox.moe/1r1auv.jpg"
  },
  {
    "name": "Finral Roulacase",
    "rarity": "R",
    "attack": 140,
    "defense": 130,
    "health": 160,
    "image": "https://files.catbox.moe/9kydfm.jpg"
  },
  {
    "name": "Subaru Natsuki",
    "rarity": "R",
    "attack": 120,
    "defense": 100,
    "health": 180,
    "image": "https://files.catbox.moe/9v4wsd.jpg"
  },
  {
    "name": "Rem",
    "rarity": "SR",
    "attack": 310,
    "defense": 260,
    "health": 300,
    "image": "https://files.catbox.moe/lhkyk3.jpeg"
  },
  {
    "name": "Ram",
    "rarity": "SR",
    "attack": 290,
    "defense": 240,
    "health": 270,
    "image": "https://files.catbox.moe/e7hxxi.jpg"
  },
  {
    "name": "Emilia",
    "rarity": "SR",
    "attack": 300,
    "defense": 250,
    "health": 285,
    "image": "https://files.catbox.moe/63gape.jpg"
  },
  {
    "name": "Beatrice",
    "rarity": "SSR",
    "attack": 420,
    "defense": 400,
    "health": 350,
    "image": "https://files.catbox.moe/lp3h4e.jpg"
  },
  {
    "name": "Roswaal L. Mathers",
    "rarity": "SSR",
    "attack": 480,
    "defense": 440,
    "health": 410,
    "image": "https://files.catbox.moe/ag81b6.jpg"
  },
  {
    "name": "Echidna",
    "rarity": "SSR",
    "attack": 490,
    "defense": 460,
    "health": 420,
    "image": "https://files.catbox.moe/ajqlt5.jpg"
  },
  {
    "name": "Reinhard van Astrea",
    "rarity": "SSR",
    "attack": 650,
    "defense": 600,
    "health": 580,
    "image": "https://files.catbox.moe/xcyzcb.jpg"
  },
  {
    "name": "Ainz Ooal Gown",
    "rarity": "SSR",
    "attack": 600,
    "defense": 580,
    "health": 550,
    "image": "https://files.catbox.moe/oxcxkz.jpg"
  },
  {
    "name": "Albedo",
    "rarity": "SSR",
    "attack": 450,
    "defense": 500,
    "health": 480,
    "image": "https://files.catbox.moe/1h0scv.jpg"
  },
  {
    "name": "Shalltear Bloodfallen",
    "rarity": "SSR",
    "attack": 480,
    "defense": 460,
    "health": 440,
    "image": "https://files.catbox.moe/ncvnsw.jpg"
  },
  {
    "name": "Cocytus",
    "rarity": "SR",
    "attack": 370,
    "defense": 400,
    "health": 380,
    "image": "https://files.catbox.moe/6c9fv9.jpg"
  },
  {
    "name": "Demiurge",
    "rarity": "SSR",
    "attack": 440,
    "defense": 420,
    "health": 400,
    "image": "https://files.catbox.moe/tdh083.jpg"
  },
  {
    "name": "Mare Bello Fiore",
    "rarity": "SR",
    "attack": 350,
    "defense": 340,
    "health": 330,
    "image": "https://files.catbox.moe/mqyb3e.jpg"
  },
  {
    "name": "Aura Bella Fiora",
    "rarity": "SR",
    "attack": 340,
    "defense": 350,
    "health": 340,
    "image": "https://files.catbox.moe/573a2p.jpg"
  },
  {
    "name": "Sebas Tian",
    "rarity": "SR",
    "attack": 360,
    "defense": 380,
    "health": 370,
    "image": "https://files.catbox.moe/vk74au.jpg"
  },
  {
    "name": "Shigeo Kageyama",
    "rarity": "SSR",
    "attack": 570,
    "defense": 500,
    "health": 490,
    "image": "https://files.catbox.moe/vwb4x4.jpg"
  },
  {
    "name": "Reigen Arataka",
    "rarity": "R",
    "attack": 80,
    "defense": 60,
    "health": 90,
    "image": "https://files.catbox.moe/tybtdw.jpg"
  },
  {
    "name": "Teru Hanazawa",
    "rarity": "SR",
    "attack": 260,
    "defense": 220,
    "health": 240,
    "image": "https://files.catbox.moe/9mlmmd.jpg"
  },
  {
    "name": "Dimple",
    "rarity": "R",
    "attack": 100,
    "defense": 80,
    "health": 110,
    "image": "https://files.catbox.moe/ne98y5.jpg"
  },
  {
    "name": "Ritsu Kageyama",
    "rarity": "SR",
    "attack": 300,
    "defense": 260,
    "health": 270,
    "image": "https://files.catbox.moe/1nnecm.jpg"
  },
  {
    "name": "Shou Suzuki",
    "rarity": "SR",
    "attack": 310,
    "defense": 270,
    "health": 280,
    "image": "https://files.catbox.moe/5ga1rs.jpg"
  },
  {
    "name": "Kirito",
    "rarity": "SSR",
    "attack": 430,
    "defense": 370,
    "health": 400,
    "image": "https://files.catbox.moe/dg7z55.jpg"
  },
  {
    "name": "Asuna",
    "rarity": "SR",
    "attack": 350,
    "defense": 300,
    "health": 320,
    "image": "https://files.catbox.moe/2h0pue.jpg"
  },
  {
    "name": "Alice",
    "rarity": "SR",
    "attack": 340,
    "defense": 320,
    "health": 310,
    "image": "https://files.catbox.moe/qgo6at.jpg"
  },
  {
    "name": "Sinon",
    "rarity": "SR",
    "attack": 360,
    "defense": 270,
    "health": 290,
    "image": "https://files.catbox.moe/savdtv.jpg"
  },
  {
    "name": "Eugeo",
    "rarity": "SR",
    "attack": 330,
    "defense": 300,
    "health": 310,
    "image": "https://files.catbox.moe/u74bbj.jpg"
  },
  {
    "name": "Yui",
    "rarity": "R",
    "attack": 100,
    "defense": 120,
    "health": 130,
    "image": "https://files.catbox.moe/3e9gsw.jpg"
  }
];

// ============ FUNCIONES DEL GACHA ============

// Función para obtener personajes por rareza
function getCharactersByRarity(rarity) {
    return characters.filter(c => c.rarity === rarity);
}

// Función para tirar gacha
function pullGacha() {
    if (characters.length === 0) {
        return null;
    }
    
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
    
    if (available.length === 0) {
        // Si no hay de esa rareza, devolver cualquiera
        const anyChar = characters[Math.floor(Math.random() * characters.length)];
        return {
            name: anyChar.name,
            rarity: anyChar.rarity,
            attack: anyChar.attack,
            defense: anyChar.defense,
            health: anyChar.health,
            image: anyChar.image,
            pulledAt: new Date().toISOString()
        };
    }
    
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

// ============ ENDPOINTS ============

// 1. Tirada simple
router.get('/pull', async (req, res) => {
    try {
        const result = pullGacha();
        
        if (!result) {
            return res.status(500).json({
                status: false,
                error: "No hay personajes disponibles"
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