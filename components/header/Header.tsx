import { SWR_KEYS } from "@nature-digital/constants";
import { FilterDataType, SWRTypes } from "@nature-digital/types";
import styles from "@nature-digital/web-styles/components/header.module.scss";
import dynamic from "next/dynamic";
import useSWR, { mutate } from "swr";
import filtersFetcher from "../../utils/fetchers/filtersFetcher";
import Branding from "./Branding";
import HeaderSearch from "./Search";

const SecondaryNavigationComponent = dynamic(() => import("../nav/SecondaryNavigation"), { ssr: false });

const Header = ({ withoutSearch }) => {
  const { data, mutate: filterMutate } = useSWR<SWRTypes["FILTER"]>(SWR_KEYS.FILTER);

  const handleHeaderClick = ({ target }) => {
    if (data && data.state && target.id !== "filter-button") {
      filterMutate({ ...data, state: false });
      mutate(SWR_KEYS.FILTER, (prevData: FilterDataType) => filtersFetcher(prevData, false));
    }
  };

  return (
    <>
      <header
        aria-hidden="true"
        onClickCapture={handleHeaderClick}
        id="header"
        className={withoutSearch ? `${styles.header} ${styles.header__noSearch}` : `${styles.header}`}
      >
        <div className={styles.headerContainer}>
          <div className={styles.headerContainer__test}>
            <Branding />
            <div> {!withoutSearch && <HeaderSearch />}</div>
          </div>
          <SecondaryNavigationComponent />
        </div>
      </header>
    </>
  );
};

export default Header;
