import { DefaultSeoProps } from "next-seo";

const config: DefaultSeoProps = {
  title: undefined,
  titleTemplate: "%s | natur.digital",
  defaultTitle: "natur.digital",
  additionalLinkTags: [
    {
      rel: "icon",
      href: "/favicon-32x32.png",
    },
  ],
  openGraph: {
    type: "website",
    locale: "en_IE",
    url: "https://www.studiopresent.com/",
    siteName: "SiteName",
  },
  twitter: {
    handle: "@handle",
    site: "@site",
    cardType: "summary_large_image",
  },
};

export default config;
