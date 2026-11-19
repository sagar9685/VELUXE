import { photo } from '../lib/images';

export const categories = [
  {
    id: 'motorcycles',
    name: 'Motorcycles',
    blurb: 'Harley-Davidson, Ducati and touring classics',
    icon: 'Bike',
    image: photo('photo-1558981403-c5f9899a28bc'),
  },
  {
    id: 'automobiles',
    name: 'Automobiles',
    blurb: 'Porsche, BMW and performance road cars',
    icon: 'Car',
    image: photo('photo-1503376780353-7e6692767b70'),
  },
  {
    id: 'riding-gear',
    name: 'Riding Gear & Parts',
    blurb: 'Genuine parts, leathers and accessories',
    icon: 'Wrench',
    image: photo('photo-1558981806-ec527fa84c39'),
  },
  {
    id: 'watches',
    name: 'Watches',
    blurb: 'Iconic sport and dress references',
    icon: 'Watch',
    image: photo('photo-1523170335258-f5ed11844a49'),
  },
  {
    id: 'bags',
    name: 'Bags & Accessories',
    blurb: 'Maison handbags and small leather goods',
    icon: 'Briefcase',
    image: photo('photo-1584917865442-de89df76afd3'),
  },
  {
    id: 'fashion',
    name: 'Fashion & Sneakers',
    blurb: 'Lifestyle apparel and limited footwear',
    icon: 'Footprints',
    image: photo('photo-1549298916-b41d501d3772'),
  },
  {
    id: 'collectibles',
    name: 'Collectibles',
    blurb: 'Scale models, memorabilia and editions',
    icon: 'Trophy',
    image: photo('photo-1591047139829-d91aecb6caaf'),
  },
];

export const categoryById = (id) => categories.find((c) => c.id === id);
