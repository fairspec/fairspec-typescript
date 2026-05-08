import { defineConfig } from "livemark"

export default defineConfig({
  site: "https://typescript.fairspec.org",
  title: "Fairspec TypeScript",
  description: "Data management framework",
  logo: "/logo.svg",
  favicon: "/logo.png",
  include: ["README.md", "docs/**/*.md", "CONTRIBUTING.md"],
  sections: [
    { title: "Docs", prefix: "/" },
    {
      title: "Changelog",
      prefix: "/changelog/",
      type: "changelog",
      source: "https://github.com/fairspec/fairspec-typescript",
      version: true,
    },
  ],
  links: [
    {
      url: "https://fairspec.org",
      title: "Home",
      position: "header",
    },
    {
      url: "https://fairspec.org/overview/introduction/",
      title: "Standard",
      position: "header",
    },
    {
      url: "https://python.fairspec.org",
      title: "Python",
      position: "header",
    },
    {
      url: "https://fairspec.org/mcp-server/",
      title: "MCP Server",
      position: "header",
    },
    {
      url: "https://application.fairspec.org",
      title: "Application",
      position: "header",
    },
    {
      url: "https://github.com/fairspec/fairspec-typescript",
      title: "GitHub",
      icon: "github",
    },
  ],
  patches: [
    {
      file: "README.md",
      article: {
        title: "Fairspec TypeScript",
        label: "Getting Started",
        description: "Data management framework",
        icon: "rocket",
        path: "/",
        group: "Articles",
        order: 0,
      },
    },
    {
      file: "CONTRIBUTING.md",
      article: {
        title: "Contributing",
        description:
          "How to set up the repository, propose changes, and ship a release.",
        icon: "heart-handshake",
        path: "/contributing/",
        order: -1,
      },
    },
  ],
})
