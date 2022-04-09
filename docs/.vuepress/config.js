module.exports = {
  title: '峰峰的笔记',
  description: 'javascript vue web node',
  base: '/blog/',
  themeConfig: {
    nav: [
      { text: '指南', link: '/guide/one' },
      { text: 'Javascript', link: '/javascript/' },
      { text: 'Vue', link: '/vue/' },
      { text: 'Webpack', link: '/webpack/thread-loader' },
      { text: 'Node', link: '/node/' },
      { text: '其他', link: '/other/linux' },
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
      '/webpack/': [
        {
          title: 'loader',
          collapsable: true,
          sidebarDepth: 2,
          children: [
            '',
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
        }
      ],
      '/other/': [
        {
          title: '其他',
          collapsable: false,
          sidebarDepth: 1,
          children: ['/other/linux', '/other/ecs'],
        },
      ],
    },
  },
}

