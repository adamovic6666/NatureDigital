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
  additionalInformation?: string;
};

const CardParagraph = ({ data, roundedImages, tag, additionalInformation }: CardData) => {
  return (
    <div className={styles.paragraphCard}>
      <div
        className={` ${styles.paragraphCard__image} ${roundedImages ? styles.paragraphCard__imageWrapperRounded : ""}`}
      >
        {data?.images && (
          <Link href={`/${data.type}${data?.url}`} className={styles.paragraphCard__linkImageWrapper}>
            <Image
              src={`${process.env.NEXT_PUBLIC_DRUPAL_URL}/getImage/web_medium_1_1/${data.images[0]?.fileId}?responseType=file`}
              // src={`${process.env.NEXT_PUBLIC_DRUPAL_URL + API_ENDPOINTS.IMAGE(data.images[0]?.fileId, "quad")}`}
              alt="news-img"
              width={200}
              height={200}
            />
          </Link>
        )}
      </div>
      <div className={styles.paragraphCard__wrapper}>
        {tag && (
          <div className={styles.paragraphCard__type}>
            <Image alt="info-square-icon" src={icons.infoSquareRounded} />
            <span>{tag}</span>
          </div>
        )}
        <Link href={`/${data.type}${data?.url}`} className={styles.paragraphCard__linkTitleWrapper}>
          <h4 className={styles.paragraphCard__title}>{data?.title}</h4>
        </Link>
        {data?.tourLength && (
          <span className={styles.paragraphCard__distance}>
            {data?.tourLength}, {data?.tourDuration}, {data?.tourFeatures}
          </span>
        )}
        <div className={styles.paragraphCard__text}>
          {(additionalInformation || data?.intro) && <RenderHTML text={additionalInformation ?? data?.intro} noLink />}
        </div>
      </div>
    </div>
  );
};

export default CardParagraph;
