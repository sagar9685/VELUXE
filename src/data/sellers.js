import { photo } from '../lib/images';

/**
 * Sample seller profiles. Ratings and review counts are DEMO values and are
 * labelled as such wherever they appear.
 */
export const sellers = [
  {
    id: 's-hale',
    name: 'Marcus Hale',
    studio: 'Hale Motor Collective',
    location: 'Austin, TX',
    verified: true,
    memberSince: '2021-03-14',
    avatar: photo('photo-1507003211169-0a1dd7228f2d', 400),
    banner: photo('photo-1558981403-c5f9899a28bc', 2000),
    bio: 'Touring motorcycles, factory parts and rider apparel. Every machine is inspected in our Texas workshop before listing.',
    demoRating: 4.9,
    demoReviews: 128,
  },
  {
    id: 's-rocca',
    name: 'Isabella Rocca',
    studio: 'Rocca Collezione',
    location: 'Milan, Italy',
    verified: true,
    memberSince: '2020-09-02',
    avatar: photo('photo-1494790108377-be9c29b29330', 400),
    banner: photo('photo-1492144534655-ae79c964c9d7', 2000),
    bio: 'Former paddock hospitality manager. I curate racing-inspired lifestyle pieces and Ferrari collectibles from private collections.',
    demoRating: 4.8,
    demoReviews: 214,
  },
  {
    id: 's-laurent',
    name: 'Henri Laurent',
    studio: 'Maison Laurent Timepieces',
    location: 'Geneva, Switzerland',
    verified: true,
    memberSince: '2019-11-20',
    avatar: photo('photo-1500648767791-00dcc994a43e', 400),
    banner: photo('photo-1523170335258-f5ed11844a49', 2000),
    bio: 'Independent watch dealer specialising in Swiss sport and complication references with complete papers.',
    demoRating: 5.0,
    demoReviews: 96,
  },
  {
    id: 's-rahman',
    name: 'Aisha Rahman',
    studio: 'Rahman Atelier',
    location: 'Dubai, UAE',
    verified: true,
    memberSince: '2022-01-08',
    avatar: photo('photo-1544005313-94ddf0286df2', 400),
    banner: photo('photo-1584917865442-de89df76afd3', 2000),
    bio: 'Maison handbags, Dior footwear and fine watches, offered through a discreet private concierge service.',
    demoRating: 4.9,
    demoReviews: 173,
  },
  {
    id: 's-okafor',
    name: 'Daniel Okafor',
    studio: 'Okafor Garage',
    location: 'Munich, Germany',
    verified: false,
    memberSince: '2024-05-27',
    avatar: photo('photo-1506794778202-cad84cf45f1d', 400),
    banner: photo('photo-1503376780353-7e6692767b70', 2000),
    bio: 'Performance cars and sneaker releases. Identity verification is currently in progress.',
    demoRating: 4.6,
    demoReviews: 41,
  },
  {
    id: 's-you',
    name: 'Alex Morgan',
    studio: 'Alex Morgan Studio',
    location: 'London, UK',
    verified: false,
    memberSince: '2026-02-11',
    avatar: null,
    banner: photo('photo-1549298916-b41d501d3772', 2000),
    bio: 'Selling a small number of pieces from my own collection.',
    demoRating: null,
    demoReviews: 0,
  },
];

export const sellerById = (id) => sellers.find((s) => s.id === id);

export const initialsOf = (name = '') =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();
