import { SWR_KEYS, URL_KEYS } from "@nature-digital/constants";
import { SWRTypes } from "@nature-digital/types";
import icons from "@nature-digital/web-styles";
import styles from "@nature-digital/web-styles/components/map.module.scss";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { ReactNode, useCallback, useEffect, useMemo, useRef } from "react";
import { AutoSizer, CellMeasurer, CellMeasurerCache, ListRowProps, List as VirtualizedList } from "react-virtualized";
import useSWR from "swr";
import Article from "../../pages/articles/[...slug]";
import { mapFetcher } from "../../utils/fetchers";
import Url from "../../utils/urlHandler";
import Backdrop from "../backdrop/Backdrop";
import MapButtons from "../map/MapButtons";
import NoResultsParagraph from "../paragraphs/NoResultsParagraph";
import Teaser from "../teaser/Teaser";

const { smallArrow, externalLink, back } = icons;

const Header = (props: { url?: string; toggleList: () => void; type?: string }) => {
  const { toggleList, url, type } = props;
  const { mutate: mutateArticleSliderState } = useSWR<SWRTypes["ARTICLE_SLIDER_STATE"]>(SWR_KEYS.ARTICLE_SLIDER_STATE);
  const { mutate: setActiveList } = useSWR<SWRTypes["ACTIVE_LIST_STATE"]>(SWR_KEYS.ACTIVE_LIST_STATE);

  const handleBack = useCallback(() => {
    mutateArticleSliderState({ isLoading: false, initial: false });
    setActiveList(true);
    Url.removeParam(URL_KEYS.URL);
    Url.changeURL();
    mapFetcher();
  }, []);

  return (
    <>
      <MapButtons />
      <button type="button" onClick={toggleList} className={styles.map__list_show_button}>
        <Image src={smallArrow} alt="show and close button" />
      </button>
      <div className={styles.map__list__header}>
        {url && (
          <span className={styles.map__list__header__back}>
            <Image src={back} alt="back button" onClick={handleBack} />
          </span>
        )}

        {url && (
          <span className={styles.map__list__header__open}>
            <Link href={`/${type}${url}`}>
              <Image src={externalLink} alt="show and close button" />
            </Link>
          </span>
        )}
      </div>
    </>
  );
};

const List = () => {
  const { query } = useRouter();
  const { data } = useSWR<SWRTypes["SEARCH"]>(SWR_KEYS.SEARCH);
  const { data: activeList = !!query?.url || !!query?.lng || !!query.textSearch || false, mutate: setActiveList } =
    useSWR<SWRTypes["ACTIVE_LIST_STATE"]>(SWR_KEYS.ACTIVE_LIST_STATE);

  const listRef = useRef<HTMLDivElement>(null);
  const itemsPerRow = window.innerWidth < 450 ? 2 : 3;

  const noSideBar = Array.isArray(data) && data.length === 0 ? styles.map__list_closed_noBar : "";
  const className = `${activeList ? styles.map__list : `${styles.map__list} ${styles.map__list_closed} ${noSideBar}`}`;

  const _cache = useMemo(
    () =>
      new CellMeasurerCache({
        fixedWidth: true,
        minHeight: 250,
        defaultHeight: 250,
      }),
    [],
  );

  const rowRenderer = useCallback(
    ({ index, parent, key, style }: ListRowProps) => {
      if (!data || !Array.isArray(data)) return null;
      const items: ReactNode[] = [];
      const fromIndex = index * itemsPerRow;
      const toIndex = Math.min(fromIndex + itemsPerRow, data.length);

      for (let i = fromIndex; i < toIndex; i++) {
        const item = data[i];
        items.push(
          <div className={styles.listItem} key={`TEASER_ITEM_${item._id}`}>
            <Teaser item={item} />
          </div>,
        );
      }

      return (
        // @ts-ignore
        <CellMeasurer cache={_cache} columnIndex={0} key={key} rowIndex={index} parent={parent}>
          {({ measure }) => (
            <div key={key} onLoad={measure} className={styles.list} style={style}>
              {items}
            </div>
          )}
        </CellMeasurer>
      );
    },
    [data, _cache, itemsPerRow],
  );

  const toggleList = useCallback(async () => {
    setActiveList(!activeList);
  }, [activeList]);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTo(0, 0);
    }
  }, [data]);

  if (Array.isArray(data) && _cache) {
    const rowCount = Math.ceil(data.length / itemsPerRow);
    return (
      <>
        <div className={className}>
          <div className={styles.map__list_wrapper}>
            <Header toggleList={toggleList} />
            {/* @ts-ignore */}
            <AutoSizer>
              {({ width, height }) => (
                /* @ts-ignore */
                <VirtualizedList
                  width={width}
                  deferredMeasurementCache={_cache}
                  height={height}
                  rowHeight={_cache.rowHeight}
                  rowCount={rowCount}
                  rowRenderer={rowRenderer}
                  overscanRowCount={5}
                  style={{ paddingBottom: "24px" }}
                />
              )}
            </AutoSizer>
            {data.length === 0 && <NoResultsParagraph inPageBody />}
          </div>
        </div>
        {activeList && <Backdrop type="filter-backdrop-mobile" onClose={() => setActiveList(false)} />}
      </>
    );
  }

  if (typeof data === "object" && data != null && "_id" in data) {
    return (
      <>
        <div className={className}>
          <div className={styles.map__list_wrapper}>
            <Header url={data.url} toggleList={toggleList} type={data.type} />
            <div ref={listRef} className={styles.map__list_wrapper__fullArticle}>
              <Article result={data} />
            </div>
          </div>
        </div>
        {activeList && <Backdrop type="filter-backdrop-mobile" onClose={() => setActiveList(false)} />}
      </>
    );
  }

  return null;
};

export default List;
