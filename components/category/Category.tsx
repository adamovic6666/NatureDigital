import { SWR_KEYS, URL_KEYS } from "@nature-digital/constants";
import { SWRTypes } from "@nature-digital/types";
import styles from "@nature-digital/web-styles/components/category.module.scss";
import { useRouter } from "next/router";
import { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AutoSizer, CellMeasurer, CellMeasurerCache, List, ListRowProps, WindowScroller } from "react-virtualized";
import useSWR from "swr";
import Url from "../../utils/urlHandler";
import NoResultsParagraph from "../paragraphs/NoResultsParagraph";
import Teaser from "../teaser/Teaser";

// eslint-disable-next-line
export let setTeaserSize: (size: number) => void = () => {};

const Category = () => {
  // VALUE FROM LOCAL-STORAGE
  const teaserCardSizeFromLocalStorage = localStorage.getItem("teaser-card-size");
  // PARSED VALUE
  const parsedCardSize = teaserCardSizeFromLocalStorage && JSON.parse(teaserCardSizeFromLocalStorage);
  const { data } = useSWR<SWRTypes["SEARCH"]>(SWR_KEYS.SEARCH);
  const [teaserSize, setSize] = useState(parsedCardSize ?? 220);
  const initialScrollRow = useRef(Number(Url.getParam(URL_KEYS.ROW) || 0));
  const scrollInitialized = useRef(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  // used for scrolling the list itself
  const listRef = useRef<List>(null);
  const router = useRouter();
  let itemsPerRow = 9;

  useEffect(() => {
    router.beforePopState(({ as }) => {
      if (as !== router.asPath) {
        scrollInitialized.current = false;
      }

      return true;
    });
  }, [router]);

  useEffect(() => {
    // No initial scrolling happened, set scrollInitialized to true.
    if (!initialScrollRow.current && !scrollInitialized.current) {
      scrollInitialized.current = true;
    }
  }, []);

  const _cache = useMemo(
    () =>
      new CellMeasurerCache({
        fixedWidth: true,
        minHeight: 200,
        defaultHeight: 200,
      }),
    [],
  );

  setTeaserSize = useCallback(size => {
    setSize(size);
    listRef?.current?.recomputeRowHeights();
    _cache.clearAll();
    // eslint-disable-next-line
  }, []);

  // renders each row
  const rowRenderer = useCallback(
    ({ index, key, style, parent }: ListRowProps) => {
      // checks if there is data
      if (!data || !Array.isArray(data)) return null;

      const items: ReactNode[] = [];
      const fromIndex = index * itemsPerRow;
      const toIndex = Math.min(fromIndex + itemsPerRow, data.length);

      // adds every teaser item to the "items" array
      for (let i = fromIndex; i < toIndex; i++) {
        const item = data[i];
        items.push(
          <div
            key={`TEASER_ITEM_${item._id}`}
            className={styles.listItem}
            style={{ flexBasis: `calc(100% / ${itemsPerRow}` }}
          >
            <Teaser item={item} />
          </div>,
        );
      }

      return (
        // @ts-ignore
        <CellMeasurer cache={_cache} columnIndex={0} key={key} parent={parent} rowIndex={index}>
          {({ measure }) => (
            <div
              className={styles.list}
              onLoad={measure}
              key={key}
              style={{ ...style, display: "grid", gridTemplateColumns: `repeat(${itemsPerRow}, 1fr)` }}
            >
              {items}
            </div>
          )}
        </CellMeasurer>
      );
    },
    // eslint-disable-next-line
    [data, itemsPerRow, teaserSize, _cache],
  );

  if (Array.isArray(data) && data.length === 0) {
    return <NoResultsParagraph inPageBody />;
  }

  if (Array.isArray(data) && _cache) {
    return (
      <div className={styles.category} ref={wrapperRef}>
        <div className={`${styles.category__container} ${styles.moreTeasers}`}>
          {/* @ts-ignore */}
          <WindowScroller>
            {({ height, isScrolling, scrollTop }) => (
              /* @ts-ignore */
              <AutoSizer disableHeight>
                {({ width }) => {
                  itemsPerRow = Math.round(width / teaserSize);

                  const rowCount = Math.ceil(data.length / itemsPerRow);

                  return (
                    <div>
                      {/* @ts-ignore */}
                      <List
                        width={width}
                        height={height}
                        deferredMeasurementCache={_cache}
                        ref={listRef}
                        isScrolling={isScrolling}
                        autoHeight
                        rowCount={rowCount}
                        rowHeight={_cache.rowHeight}
                        onRowsRendered={a => {
                          if (initialScrollRow.current && wrapperRef.current && listRef.current) {
                            const scrollTo = initialScrollRow.current - 1;
                            const cell =
                              /* @ts-ignore */
                              listRef.current.Grid?.state?.instanceProps?.rowSizeAndPositionManager?.getSizeAndPositionOfCell(
                                scrollTo,
                              );

                            if (cell.offset && cell.size) {
                              window.scrollTo({ top: cell.offset + cell.size - wrapperRef.current.offsetTop });
                            }

                            // Check if enough cells are rendered.
                            if (scrollTo < a.stopIndex) {
                              setTimeout(() => {
                                initialScrollRow.current = 0;
                                scrollInitialized.current = true;
                              }, 500);
                            }
                          } else if (scrollInitialized.current) {
                            // Don't change the URL, until the initial scrolling is finished.
                            Url.changeParam([URL_KEYS.ROW, String(a.startIndex + 1)]);
                            Url.changeURL();
                          }
                        }}
                        style={{ height: "100% !important" }}
                        scrollTop={scrollTop}
                        rowRenderer={rowRenderer}
                        overscanRowCount={5}
                      />
                    </div>
                  );
                }}
              </AutoSizer>
            )}
          </WindowScroller>
        </div>
      </div>
    );
  }

  return null;
};

export default Category;
