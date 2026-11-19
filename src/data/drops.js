import { photo } from '../lib/images';
import { hoursFromNow } from '../lib/format';

export const drops = [
  {
    id: 'ferrari-heritage-drop',
    title: 'Ferrari Heritage Drop',
    subtitle: 'Numbered Scuderia pieces from a private Milan collection. Eleven pieces, once only.',
    startsAt: hoursFromNow(70),
    image: photo('photo-1492144534655-ae79c964c9d7', 1800),
    accent: 'Rosso Corsa',
  },
  {
    id: 'harley-anniversary-capsule',
    title: 'Anniversary Riding Capsule',
    subtitle: 'Leather, tin and touring hardware from a limited anniversary run.',
    startsAt: hoursFromNow(140),
    image: photo('photo-1558981403-c5f9899a28bc', 1800),
    accent: 'Milwaukee Black',
  },
];
