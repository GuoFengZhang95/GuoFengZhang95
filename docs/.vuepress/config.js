module.exports = {
  title: "峰峰的笔记",
  description: "javascript vue web node",
  themeConfig: {
    nav: [
      { text: "指南", link: "/guide/one" },
      { text: "Javascript", link: "/javascript/" },
      { text: "Vue", link: "/vue/" },
      { text: "Node", link: "/node/" },
      { text: "其他", link: "/other/" },
      { text: "External", link: "https://github.com/GuoFengZhang95" },
    ],
    displayAllHeaders: true, // 默认值：false
    /**配置侧边栏 auto/自定义 */
    sidebar: {
      "/guide/": [
        {
          title: "指南", // 必要的
          collapsable: true, // 可选的, 默认值是 true,
          sidebarDepth: 1, // 可选的, 默认值是 1
          children: ["/guide/one", "/guide/two"],
        },
      ],
    },
  },
};
