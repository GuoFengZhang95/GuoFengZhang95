module.exports = {
  title: 'fengfengbook',
  description: 'javascript vue web node',
  base: '/blog/',
  head: [
    ['link', { rel: 'shortcut icon', type: "image/x-icon", href: `./favicon.ico` }]
  ],
  themeConfig: {
    // logo: '/blog/public/logo.jpg',
    nav: [
      { text: '指南', link: '/guide/one' },
      { text: 'Javascript', link: '/javascript/' },
      { text: 'Vue', link: '/vue/' },
      { text: 'Webpack', link: '/webpack/' },
      { text: 'Node', link: '/node/' },
      { text: '其他', link: '/other/git' },
      { text: 'External', link: 'https://github.com/GuoFengZhang95' },
    ],
    displayAllHeaders: true, // 默认值：false
    /**配置侧边栏 auto/自定义 */
    sidebar: {
      '/guide/': [
        {
          title: '指南', // 必要的
          collapsable: false, // 可选的, 默认值是 true,
          sidebarDepth: 1, // 可选的, 默认值是 1
          children: ['/guide/one', '/guide/two'],
        },
      ],
      '/javascript/': [
        {
          title: '浏览器',
          collapsable: false,
          sidebarDepth: 1,
          children: [
            'browser-storage',
          ]
        },
      ],
      '/node/': [],
      '/other/': [
        {
          title: '其他',
          collapsable: false,
          sidebarDepth: 1,
          children: ['/other/git', '/other/linux', '/other/ecs'],
        },
      ],
      '/vue/': [],
      '/webpack/': [
        {
          title: '介绍',
          collapsable: false,
          sidebarDepth: 1,
          children: ['']
        },
        {
          title: 'loader',
          collapsable: false,
          sidebarDepth: 1,
          children: [
            'thread-loader',
            'style-resources-loader',
          ]
        },
        {
          title: '配置',
          collapsable: false,
          sidebarDepth: 1,
          children: [
            'optimization',
          ]
        },
        {
          title: '其他',
          collapsable: false,
          sidebarDepth: 1,
          children: [
            'other',
          ]
        }
      ],
    },
  },
}

