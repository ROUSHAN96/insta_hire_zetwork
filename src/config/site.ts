export const siteConfig = {
  name: 'ShopZet',
  description:
    'Premium e-commerce store with curated products across Electronics, Clothing, Books, and Home & Kitchen.',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  ogImage: 'https://og-image.vercel.app/ShopZet.png',
  mainNav: [
    {
      title: 'Home',
      href: '/',
    },
    {
      title: 'Cart',
      href: '/cart',
    },
  ],
  links: {
    twitter: 'https://twitter.com/zetwerk',
    github: 'https://github.com/zetwerk',
  },
};
