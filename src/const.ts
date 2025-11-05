import type { artistesProps } from './components/artistItem.vue'

const antmoDesc = [
  'Depuis une décennie, Antmo, artiste polyvalent et cofondateur du collectif KRAM, explore les multiples facettes de la musique électronique.',
  'Sa passion ardente pour la musique le conduit à travers un panorama sonore vaste, allant de la techno hypnotique aux vibrations envoûtantes de la trance, en passant par les rythmes énergiques aux influences britanniques.',
  "Doté d'une sensibilité musicale aiguisée, Antmo adore naviguer entre les différents styles, créant ainsi des sets captivants et dynamiques. Son objectif : partager avec le public l'émotion et l'énergie qu'il ressent derrière les decks.",
  'Entre deux sessions de mix, Antmo se plonge dans la recherche de nouvelles pépites musicales pour étoffer ses playlists. Cette quête lui permet de se renouveler constamment et de proposer à son public une expérience sonore originale à chaque performance.',
]
const miraDesc = ['']
const ronnieDesc = ['']

export const artistes: artistesProps[] = [
  {
    name: 'ANTMO',
    description: antmoDesc,
    imgUrl: 'src/img/antmo.jpg',
    styles: ['Hargroove', 'Techno'],
    trackIds: ['253A2190957747', '253A2190957507'],
  },
  {
    name: 'MIRA',
    description: miraDesc,
    imgUrl: 'src/img/mira.jpeg',
    styles: ['Breakbeat', 'Bailey'],
    trackIds: [],
  },
  {
    name: 'RONNIE',
    description: ronnieDesc,
    imgUrl: 'src/img/ronnie.JPG',
    styles: ['House', 'Trance'],
    trackIds: [],
  },
]
