import { photo } from '../lib/images';

export const collections = [
  {
    id: 'racing-heritage',
    title: 'The Racing Heritage',
    description: 'Italian and German performance — from the circuit to the showroom floor.',
    tag: 'racing',
    image: photo('photo-1492144534655-ae79c964c9d7'),
  },
  {
    id: 'timepiece-vault',
    title: 'The Timepiece Vault',
    description: 'Sport and dress references from Geneva and beyond, with papers where available.',
    tag: 'timepieces',
    image: photo('photo-1523170335258-f5ed11844a49'),
  },
  {
    id: 'open-road',
    title: 'The Open Road Edit',
    description: 'Touring machines, riding leathers and the parts that make them yours.',
    tag: 'open-road',
    image: photo('photo-1558981403-c5f9899a28bc'),
  },
  {
    id: 'maison-edit',
    title: 'The Maison Edit',
    description: 'Houses of leather and savoir-faire: Hermès, Chanel, Louis Vuitton and Dior.',
    tag: 'maison',
    image: photo('photo-1584917865442-de89df76afd3'),
  },
  {
    id: 'limited-numbered',
    title: 'Limited & Numbered',
    description: 'Small runs, anniversary editions and collectibles with provenance notes.',
    tag: 'limited',
    image: photo('photo-1591047139829-d91aecb6caaf'),
  },
];

export const collectionById = (id) => collections.find((c) => c.id === id);
