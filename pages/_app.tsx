import "@nature-digital/web-styles/global.scss";
import { SessionProvider } from "next-auth/react";
import { DefaultSeo } from "next-seo";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Footer from "../components/footer/Footer";
import Header from "../components/header/Header";
import Toast from "../components/toast/Toast";
import SEO from "../next-seo.config";
import Url from "../utils/urlHandler";

const pagesWithoutHeaderAndFooter = ["/coming-soon"];
const pagesWithSmallFooter = ["/", "/search"];
const pagesWithoutSearch = ["/"];

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received
   * as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      _id: string;
      username: string;
      token: string;
      email: string;
      verified: boolean;
      drupalId: string;
      photos: any[];
    };
  }
}

export default function App({ Component, pageProps }: AppProps) {
  const { session } = pageProps;

  const router = useRouter();
  const disabledHeaderFooter = pagesWithoutHeaderAndFooter.includes(router.pathname);
  const smallFooter = !!pageProps?.fallback?.MAP_ID || pagesWithSmallFooter.includes(router.pathname);
  const withoutSearch = pagesWithoutSearch.includes(router.pathname);

  Url.setRouter(router);

  useEffect(() => {
    router.beforePopState(({ as }) => {
      if (as === router.asPath) {
        router.push(router.asPath);
      }

      return true;
    });
    // eslint-disable-next-line
  }, []);

  return (
    <SessionProvider session={session}>
      <div className="baseContainer">
        <DefaultSeo {...SEO} />
        {!disabledHeaderFooter && <Header withoutSearch={withoutSearch} />}
        <div className="baseComponent">
          <Component {...pageProps} />
        </div>
        {!disabledHeaderFooter && <Footer small={smallFooter} />}
      </div>
      <Toast />
    </SessionProvider>
  );
}
