import type { artistesProps } from './components/artistItem.vue'
import * as THREE from 'three'

const antmoDesc = [
  'Depuis une décennie, Antmo, artiste polyvalent et cofondateur du collectif KRAM, explore les multiples facettes de la musique électronique.',
  'Sa passion ardente pour la musique le conduit à travers un panorama sonore vaste, allant de la techno hypnotique aux vibrations envoûtantes de la trance, en passant par les rythmes énergiques aux influences britanniques.',
  "Doté d'une sensibilité musicale aiguisée, Antmo adore naviguer entre les différents styles, créant ainsi des sets captivants et dynamiques. Son objectif : partager avec le public l'émotion et l'énergie qu'il ressent derrière les decks.",
  'Entre deux sessions de mix, Antmo se plonge dans la recherche de nouvelles pépites musicales pour étoffer ses playlists. Cette quête lui permet de se renouveler constamment et de proposer à son public une expérience sonore originale à chaque performance.',
]

const miraDesc = [
  'Acid, envoûtant et percussif 👾',
  "Co-fondateur du projet Kram à Brest, Mira existe pour faire les corps et les âmes. Partageant des moments d'euphorie et de lâcher prise unique avec le public.",
  'Armé de ses dernières découvertes musicales, Mira vous emmène avec lui pour un voyage immersif entre rythmiques saccadées et ligne de basse entraînante.',
  "Montez à bord, n'attachez pas vos ceintures et laissez-vous transporter par son énergie débordante.",
]

const ronnieDesc = [
  "Fondateur du collectif KRAM et de nature plutôt curieux, Ronnie aime toucher à tout et explorer les styles musicaux qui l'entoure.",
  "Il écoute des artistes de différents horizons et ses selecta s'en ressentent avec des sets toujours plus originaux les uns que les autres.",
  "C’est dans le style house aux mélodies de piano entraînantes qu’il s'épanouit le plus et où il essaiera de vous y plonger en vous partageant ses dernières découvertes.",
  'Un seul objectif, transmettre cette énergie qui l’anime pour vous faire danser et oublier le temps d’un instant ce qui vous fatigue.',
]

export const artistes: artistesProps[] = [
  {
    name: 'ANTMO',
    description: antmoDesc,
    imgUrl: 'src/img/antmo.jpg',
    cutPercent: '78',
    styles: ['Hargroove', 'Techno'],
    network: {
      insta: 'https://www.instagram.com/antmo_dule_/',
      soundCloud: 'https://soundcloud.com/krambzh/sets/antmo',
    },
    trackIds: ['253A2190957747', '253A2190957507', '253A2056585340'],
  },
  {
    name: 'MIRA',
    description: miraDesc,
    imgUrl: 'src/img/mira.jpeg',
    styles: ['Breakbeat', 'Bailey', 'Latine Core'],
    network: {
      insta: 'https://www.instagram.com/mira3o3/',
      soundCloud: 'https://soundcloud.com/mira303',
    },
    trackIds: [
      '253A2206343819',
      '253A2193743643',
      '253A2187448993',
      '253A2134135164',
      '253A2047582812',
    ],
    cutPercent: '29',
  },
  {
    name: 'RONNIE',
    description: ronnieDesc,
    imgUrl: 'src/img/ronnie.JPG',
    styles: ['House', 'Hard House', 'Trance'],
    network: {
      insta: 'https://www.instagram.com/ronni_lusion/',
      soundCloud: 'https://soundcloud.com/raoul-rivier',
    },
    trackIds: ['253A2197414259', '253A2197390623', '253A2177484102', '253A2191290279'],
    cutPercent: '32',
  },
]

export const colorByImageUrl: Map<string, { color1: THREE.Color; color2: THREE.Color }> = new Map([
  [
    'src/img/antmo.jpg',
    {
      color1: new THREE.Color(156 + 50, 221 + 50, 214 + 50),
      color2: new THREE.Color(0 + 50, 142 + 50, 145 + 50),
    },
  ],
  [
    'src/img/mira.jpeg',
    {
      color1: new THREE.Color(111 + 50, 118 + 50, 42 + 50),
      color2: new THREE.Color(44 + 50, 71 + 50, 0 + 50),
    },
  ],
  [
    'src/img/ronnie.JPG',
    {
      color1: new THREE.Color(180 + 50, 124 + 50, 146 + 50),
      color2: new THREE.Color(166 + 50, 111 + 50, 140 + 50),
    },
  ],
])
