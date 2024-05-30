import { FULL_NODE_TITLES } from "@nature-digital/constants";
import { MediaType } from "@nature-digital/types";
import icons from "@nature-digital/web-styles";
import styles from "@nature-digital/web-styles/components/paragraphs.module.scss";
import Image from "next/image";

const DocumentsParagraph = ({ data }: { data: MediaType[] }) => {
  return (
    <div className={styles.paragraphDocuments}>
      <div className={`${styles.paragraphDocuments__wrapper} container-small documentsWrap`}>
        <h3 className={`${styles.paragraphDocuments__title} titleCenter`}>{FULL_NODE_TITLES.PDFS}</h3>
        <div className={`${styles.paragraphDocuments__wrapper} `}>
          {data &&
            data.length &&
            data.map(({ url, title }) => {
              if (!url) return null;

              return (
                <p key={`DOCUMENTS_PARAGRAPH_${title}`}>
                  <a href={process.env.NEXT_PUBLIC_DRUPAL_URL + url} download target="_blank" rel="noopener noreferrer">
                    <Image src={icons.iconDownload} alt="download icon" />
                    {title}
                  </a>
                </p>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default DocumentsParagraph;
