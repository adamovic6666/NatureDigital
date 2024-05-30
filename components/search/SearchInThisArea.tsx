import { SWR_KEYS, TEXTS, WEB_MAP_SETTINS } from "@nature-digital/constants";
import { SWRTypes } from "@nature-digital/types";
import icons from "@nature-digital/web-styles";
import styles from "@nature-digital/web-styles/components/searchInThisArea.module.scss";
import Image from "next/image";
import useSWR from "swr";
import { mapFetcher } from "../../utils/fetchers";
import { searchRef } from "../../utils/fetchers/mapFetcher";

const { search } = icons;

const SearchInThisArea = ({
  isActiveSearchOpen,
}: {
  isActiveSearchOpen: SWRTypes["ACTIVE_LIST_STATE"] | undefined;
}) => {
  const { data: mapZoom } = useSWR<SWRTypes["MAP_ZOOM"]>(SWR_KEYS.MAP_ZOOM);
  const { data: filterState = {} } = useSWR<SWRTypes["FILTER_STATE"]>(SWR_KEYS.FILTER_STATE);
  const { mutate: mutateState } = useSWR<SWRTypes["ACTIVE_LIST_STATE"]>(SWR_KEYS.ACTIVE_LIST_STATE);
  const { mutate: setActiveList } = useSWR<SWRTypes["ACTIVE_LIST_STATE"]>(SWR_KEYS.ACTIVE_LIST_STATE);
  const handleClick = () => {
    mapFetcher({ withCoordinates: true });
    mutateState(true);
    setActiveList(true);
  };

  // @ts-ignore
  return (
    <div
      className={`
        ${styles.searchInThisArea}
        ${isActiveSearchOpen ? styles["searchInThisArea--activeSearch"] : ""}
        ${styles.secondRow}`}
    >
      {(searchRef?.current?.value || Object?.keys?.(filterState)?.length !== 0) &&
        mapZoom &&
        mapZoom > WEB_MAP_SETTINS.DEFAULT_ZOOM + 1 && (
          <button className={styles.searchInThisArea__button} type="button" onClick={handleClick}>
            <Image src={search} width={20} height={20} alt="magnifying" />
            {TEXTS.Map_search_this_area}
          </button>
        )}
    </div>
  );
};

export default SearchInThisArea;
