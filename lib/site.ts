// Общие константы (не локализуются)
export const site = {
  name: 'PROFMONOLITH',
  legalName: 'PROFMONOLITH LLC',
  phone: '+374 99 050488',
  phoneHref: 'tel:+37499050488',
  email: 'monilitarmenia@gmail.com',
  emailHref: 'mailto:monilitarmenia@gmail.com',
  domain: 'profmonolith.am',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://profmonolith.am',
  // Соцсети — заглушки (реальные ссылки добавим, см. TODO.md)
  facebook: '#',
  instagram: '#',
  // Координаты офиса (Ереван, Грибоедова 54/1)
  geo: { lat: 40.213509, lng: 44.515471 },
  // OpenStreetMap embed (как в дизайне; на Vercel работает без ключа)
  mapEmbed:
    'https://www.openstreetmap.org/export/embed.html?bbox=44.510471%2C40.210509%2C44.520471%2C40.216509&layer=mapnik&marker=40.213509%2C44.515471',
} as const;
