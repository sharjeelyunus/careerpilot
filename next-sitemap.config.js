/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://careerpilot.dev',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  changefreq: 'daily',
  priority: 0.7,
  sitemapSize: 7000,
  autoLastmod: true,
  exclude: [
    '/api/*',
    '/404',
    '/500',
    '/_error',
    '/signin',
    '/signup',
    '/api-doc',
    '/terms',
    '/privacy',
    '/interview',
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/*',
          '/404',
          '/500',
          '/_error',
          '/signin',
          '/signup',
          '/api-doc',
          '/interview',
        ],
      },
    ],
  },
  transform: async (config, path) => {
    // Custom transform function for dynamic priority
    const priorities = {
      '/': 1.0,
      '/about': 0.9,
      '/contact': 0.8,
      '/challenges': 0.9,
      '/leaderboard': 0.9,
      '/interview-history': 0.8,
      '/features': 0.9,
      '/pricing': 0.9,
      '/dashboard': 0.8,
      '/profile': 0.7,
      '/settings': 0.6
    };

    // Define paths that should update daily
    const dailyUpdatePaths = ['/', '/challenges', '/leaderboard'];
    const weeklyUpdatePaths = ['/interview-history', '/profile'];

    return {
      loc: path,
      changefreq: dailyUpdatePaths.includes(path) ? 'daily' :
        weeklyUpdatePaths.includes(path) ? 'weekly' :
          'monthly',
      priority: priorities[path] || config.priority,
      lastmod: new Date().toISOString(),
    };
  },
}; 