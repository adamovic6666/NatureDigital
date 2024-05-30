import { MAP_TYPES, SWR_KEYS, URL_KEYS } from "@nature-digital/constants";
import { SWRTypes } from "@nature-digital/types";
import styles from "@nature-digital/web-styles/components/map.module.scss";
import { NextSeo } from "next-seo";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { createRef, useEffect, useRef } from "react";
import useSWR, { SWRConfig } from "swr";
import Filters from "../components/filters/Filters";
import Loader from "../components/loader";
import { LegendModal, MapModal } from "../components/map/MapButtons";
import Tooltip from "../components/map/Tooltip";
import SearchInThisArea from "../components/search/SearchInThisArea";
import mapFetcher, { setMapRef } from "../utils/fetchers/mapFetcher";
import Url from "../utils/urlHandler";

// imported dynamically because map requires window API
const MapComponent = dynamic(() => import("../components/map"), {
  ssr: false,
});

// imported dynamically because list requires window API
const ListComponent = dynamic(() => import("../components/list"), {
  ssr: false,
});

// imported dynamically because list requires window API
const SummaryComponent = dynamic(() => import("../components/summary/Summary"), {
  ssr: false,
});

const PredefinedFiltersComponent = dynamic(() => import("../components/filters/PredefinedFilters"), {
  ssr: false,
});

export default function Search({ fallback }) {
  const { query } = useRouter();

  const isFetched = useRef(false);
  const loaderRef = createRef<HTMLDivElement>();
  const { data } = useSWR<SWRTypes["SEARCH"]>(SWR_KEYS.SEARCH);
  const { data: activeList = !!query?.url || !!query?.lng || !!query.textSearch || false } = useSWR<
    SWRTypes["ACTIVE_LIST_STATE"]
  >(SWR_KEYS.ACTIVE_LIST_STATE);

  useEffect(() => {
    // PARAMS TO EXCLUDE
    [URL_KEYS.SEASON, URL_KEYS.ROW, URL_KEYS.ALLOWGEO, URL_KEYS.ALLOWNONGEO].forEach(param => Url.removeParam(param));

    const fetch = async () => {
      await mapFetcher({ isInitialLoadMap: true });

      if (loaderRef.current) {
        loaderRef.current.style.display = "none";
      }
    };

    if (!isFetched.current) {
      fetch();
      isFetched.current = true;
    }

    return () => {
      setMapRef(undefined);
    };
    // eslint-disable-next-line
  }, []);

  return (
    <SWRConfig
      value={{
        fallback: {
          ...fallback,
          [SWR_KEYS.FILTER_STATE]: Url.getParams(),
        },
      }}
    >
      <NextSeo title="Karte" description="Nature Digital" />
      <div className={`${styles.map} ${activeList && data ? styles.map__transformed : ""} map`}>
        <Filters />
        <SummaryComponent />
        <div
          ref={loaderRef}
          style={{
            background: "url('/grid-image.png')",
            width: "100%",
            height: "100%",
            backgroundColor: "#eee",
            position: "absolute",
          }}
        />
        <MapComponent />
        <Tooltip />
        <ListComponent />
        <MapModal />
        <LegendModal />
        <Loader />
        <SearchInThisArea isActiveSearchOpen={activeList} />
        <PredefinedFiltersComponent />
      </div>
    </SWRConfig>
  );
}

export async function getServerSideProps() {
  return {
    props: {
      fallback: {
        // default state of biking and hiking checkbox in the modal
        [SWR_KEYS.ROUTES]: {
          biking: false,
          hiking: false,
        },
        // default map id for the map
        [SWR_KEYS.MAP_TYPE]: MAP_TYPES.WEBKARTE,
      },
    },
  };
}
