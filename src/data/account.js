import { daysAgo } from '../lib/format';

/** Demo buyer profile. */
export const buyerProfile = {
  name: 'Alex Morgan',
  email: 'alex.morgan@example.com',
  location: 'London, UK',
  memberSince: '2026-02-11',
  notificationPrefs: {
    offers: true,
    inquiries: true,
    priceDrops: true,
    dropsAndAuctions: true,
    newsletter: false,
  },
};

export const seedNotifications = [
  {
    id: 'n-seed-1',
    type: 'auction',
    title: 'Auction ending soon',
    body: 'The 911 Carrera S closes in 30 hours. Your watch is set.',
    read: false,
    time: daysAgo(0),
  },
  {
    id: 'n-seed-2',
    type: 'price',
    title: 'Price drop on a saved listing',
    body: 'Classic Flap Medium is now listed 4% below its previous asking price.',
    read: false,
    time: daysAgo(1),
  },
  {
    id: 'n-seed-3',
    type: 'inquiry',
    title: 'Seller replied',
    body: 'Aisha Rahman answered your question about the Birkin 25 Togo.',
    read: true,
    time: daysAgo(3),
  },
  {
    id: 'n-seed-4',
    type: 'drop',
    title: 'New drop announced',
    body: 'The Ferrari Heritage Drop opens to registered members next week.',
    read: true,
    time: daysAgo(5),
  },
];

export const seedOffers = [
  {
    id: 'o-seed-1',
    productId: 'vx-009',
    productTitle: 'Submariner Date',
    askingPrice: 14800,
    amount: 13900,
    note: 'Happy to arrange collection in Dubai.',
    status: 'Countered',
    createdAt: daysAgo(4),
  },
];

export const seedInquiries = [
  {
    id: 'i-seed-1',
    productId: 'vx-013',
    productTitle: 'Birkin 25 Togo, Gold',
    sellerName: 'Aisha Rahman',
    message: 'Could you share additional photos of the interior and the date stamp?',
    status: 'Replied',
    createdAt: daysAgo(3),
  },
  {
    id: 'i-seed-2',
    productId: 'vx-007',
    productTitle: '911 Carrera S',
    sellerName: 'Daniel Okafor',
    message: 'Is the PPF on the rear as well?',
    status: 'Awaiting reply',
    createdAt: daysAgo(1),
  },
];

/** SAMPLE revenue figures for the seller dashboard (demonstration only). */
export const sampleRevenueByMonth = [
  { month: 'Dec', value: 18200 },
  { month: 'Jan', value: 22400 },
  { month: 'Feb', value: 19800 },
  { month: 'Mar', value: 31500 },
  { month: 'Apr', value: 27600 },
  { month: 'May', value: 34900 },
  { month: 'Jun', value: 29300 },
  { month: 'Jul', value: 41200 },
  { month: 'Aug', value: 38700 },
  { month: 'Sep', value: 46100 },
  { month: 'Oct', value: 43800 },
  { month: 'Nov', value: 52400 },
];
