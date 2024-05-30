import icons from "@nature-digital/web-styles";
import styles from "@nature-digital/web-styles/components/paragraphs.module.scss";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";

const RenderHTML = dynamic(() => import("../../utils/renderHtml"), { ssr: false });

// use aditional class simple__circle to form a card variation with circle image and title
// use aditional class circle to form a card variation with circle image, title, text

type CardData = {
  data: any;
  roundedImages?: boolean;
  tag?: string;
};

const CardRouteParagraph = ({ data, roundedImages, tag }: CardData) => {
  return (
    <div className={`${styles.paragraphCardRoute}`}>
      <Link
        href={`/${data?.type}${data?.url}`}
        className={`${styles.paragraphCardRoute__imageWrapper} ${
          roundedImages ? styles.paragraphCardRoute__rounded : ""
        }`}
      >
        {data?.images && (
          <Image
            src={`${process.env.NEXT_PUBLIC_DRUPAL_URL}/getImage/web_medium_1_1/${data.images[0]?.fileId}?responseType=file`}
            // src={`${process.env.NEXT_PUBLIC_DRUPAL_URL + API_ENDPOINTS.IMAGE(data.images[0]?.fileId, "quad")}`}
            alt="news-img"
            width={200}
            height={200}
            className={`${styles.paragraphCardRoute__image}`}
          />
        )}
      </Link>

      <div className={styles.paragraphCardRoute__wrapper}>
        {tag && (
          <div className={styles.paragraphCardRoute__type}>
            <Image alt="info-square-icon" src={icons.infoSquareRounded} />
            <span>{tag}</span>
          </div>
        )}
        <Link href={`/${data?.type}${data?.url}`}>
          <h4 className={styles.paragraphCardRoute__title}>{data?.title}</h4>
        </Link>
        {data?.tourLength && (
          <span className={styles.paragraphCardRoute__distance}>
            {data?.tourLength}, {data?.tourDuration}, {data?.tourFeatures}
          </span>
        )}
      </div>
      <div className={styles.paragraphCardRoute__text}>{data?.intro && <RenderHTML text={data?.intro} noLink />}</div>
    </div>
  );
};

export default CardRouteParagraph;
