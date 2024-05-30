import { TEXTS, WEB_PAGES } from "@nature-digital/constants";
import icons from "@nature-digital/web-styles";
import styles from "@nature-digital/web-styles/components/paragraphs.module.scss";
import Image from "next/image";
import { useRouter } from "next/router";

type NoResultsParagraphData = {
  inPageBody: boolean;
};

const NoResultsParagraph = ({ inPageBody }: NoResultsParagraphData) => {
  const { pathname } = useRouter();
  const isListOrMapPage = pathname === WEB_PAGES.LIST || pathname === WEB_PAGES.MAP;

  const style = isListOrMapPage && inPageBody ? styles.paragraphNoResults__listPage : styles.paragraphNoResults;

  return (
    <div className={style}>
      <Image src={icons.noSearchIconResult} alt="no-search-results" />
      <div className={styles.paragraphNoResults__textWrapper}>
        <p>{TEXTS.NoResultModal_no_data_title}</p>
        <p>{TEXTS.NoResultModal_no_data_text}</p>
      </div>
    </div>
  );
};

export default NoResultsParagraph;
