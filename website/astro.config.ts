import starlight from "@astrojs/starlight"
import { defineConfig } from "astro/config"
import starlightChangelogs, {
  makeChangelogsSidebarLinks,
} from "starlight-changelogs"
import starlightGitHubAlerts from "starlight-github-alerts"
import starlightScrollToTop from "starlight-scroll-to-top"
import starlightTypeDoc from "starlight-typedoc"

const PACKAGES = {
  fairspec: "../fairspec",
  "@fairspec/library": "../library",
  "@fairspec/dataset": "../dataset",
  "@fairspec/document": "../document",
  "@fairspec/metadata": "../metadata",
  "@fairspec/table": "../table",
}

export default defineConfig({
  site: "https://typescript.fairspec.org",
  srcDir: ".",
  outDir: "build",
  integrations: [
    starlight({
      title: "Fairspec TypeScript",
      description:
        "Fairspec Typescript is a fast data management framework built on top of the Fairspec standard and Polars DataFrames. It supports various formats like CSV, JSON, and Parquet and integrates with data platforms such as CKAN, Zenodo, and GitHub",
      customCss: ["/styles/custom.css"],
      logo: {
        src: "/assets/fairspec-logo.svg",
        alt: "Fairspec Logo",
      },
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/fairspec/fairspec-typescript",
        },
      ],
      favicon: "fairspec-logo.png",
      editLink: {
        baseUrl: "https://github.com/fairspec/fairspec-typescript/edit/main/",
      },
      lastUpdated: true,
      tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 4 },
      expressiveCode: {
        themes: ["starlight-dark", "starlight-light"],
      },
      plugins: [
        starlightGitHubAlerts(),
        starlightScrollToTop(),
        starlightChangelogs(),
        starlightTypeDoc({
          entryPoints: generatePackageEntrypoints(),
          tsconfig: "../tsconfig.json",
          typeDoc: { entryPointStrategy: "packages", router: "structure" },
          output: "reference",
          sidebar: {
            label: "API Reference",
            collapsed: true,
          },
        }),
      ],
      sidebar: [
        {
          label: "Overview",
          items: [
            { label: "Getting Started", slug: "index" },
            { label: "Contributing", slug: "overview/contributing" },
          ],
        },
        { label: "Guides", autogenerate: { directory: "guides" } },
        {
          label: "API Reference",
          collapsed: true,
          items: generatePackageSidebars(),
        },
        {
          label: "Changelog",
          collapsed: true,
          items: makeChangelogsSidebarLinks([
            {
              type: "recent",
              base: "changelog",
              count: 10,
            },
          ]),
        },
      ],
    }),
  ],
})

function generatePackageEntrypoints() {
  return Object.values(PACKAGES)
}

function generatePackageSidebars() {
  return Object.entries(PACKAGES).map(([name, _path]) =>
    generatePackageSidebar({ name }),
  )
}

function generatePackageSidebar(props: { name: string }) {
  const name = props.name
  const slug = name.replace("@", "_")

  return {
    label: name,
    collapsed: true,
    autogenerate: { directory: `reference/${slug}` },
  }
}
