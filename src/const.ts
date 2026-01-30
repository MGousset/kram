import type { artistesProps } from './components/artistItem.vue'
import * as THREE from 'three'

import antmoUrl from '@/assets/img/antmo.jpg'
import blancSoleilUrl from '@/assets/img/blancSoleil.png'
import miraUrl from '@/assets/img/mira.jpeg'
import ronnieUrl from '@/assets/img/ronnie.jpg'

const antmoDesc = [
  'DJ brestois à l’origine du collectif KRAM, son style est taillé pour le club avec une techno sans concession, axée sur l’efficacité.',
  'Il construit ses sets en mêlant la répétition mentale de la techno hypnotique à un groove constant porté par ses tracks hardgroove.',
  'Son objectif est clair : maintenir la tension et vous faire bouger du début à la fin.',
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
    name: 'Antmo',
    description: antmoDesc,
    imgUrl: antmoUrl,
    cutPercent: '78',
    styles: ['Hardgroove', 'Techno'],
    network: {
      insta: 'https://www.instagram.com/antmo_dule_/',
      soundCloud: 'https://soundcloud.com/krambzh/sets/antmo',
    },
    trackIds: ['253A2190957747', '253A2190957507', '253A2056585340'],
    prodIds: [],
    imageCenter: 70,
  },
  {
    name: 'MIRA',
    description: miraDesc,
    imgUrl: miraUrl,
    styles: ['Breakbeat', 'Bass', 'Techno'],
    network: {
      insta: 'https://www.instagram.com/mira3o3/',
      soundCloud: 'https://soundcloud.com/mira303',
    },
    trackIds: [
      '253A2221518107',
      '253A2206343819',
      '253A2193743643',
      '253A2187448993',
      '253A2134135164',
    ],
    prodIds: [],
    cutPercent: '29',
    imageCenter: 30,
  },
  {
    name: 'Ronnie',
    description: ronnieDesc,
    imgUrl: ronnieUrl,
    styles: ['House', 'Hard House', 'Trance'],
    network: {
      insta: 'https://www.instagram.com/ronni_lusion/',
      soundCloud: 'https://soundcloud.com/raoul-rivier',
    },
    trackIds: ['253A2197414259', '253A2197390623', '253A2177484102', '253A2191290279'],
    prodIds: [],
    cutPercent: '32',
    imageCenter: 30,
  },
]

export const colorByImageUrl: Map<string, { color1: THREE.Color; color2: THREE.Color }> = new Map([
  [
    antmoUrl,
    {
      color1: new THREE.Color(156 + 50, 221 + 50, 214 + 50),
      color2: new THREE.Color(0 + 50, 142 + 50, 145 + 50),
    },
  ],
  [
    miraUrl,
    {
      color1: new THREE.Color(111 + 50, 118 + 50, 42 + 50),
      color2: new THREE.Color(44 + 50, 71 + 50, 0 + 50),
    },
  ],
  [
    ronnieUrl,
    {
      color1: new THREE.Color(180 + 50, 124 + 50, 146 + 50),
      color2: new THREE.Color(166 + 50, 111 + 50, 140 + 50),
    },
  ],
])
