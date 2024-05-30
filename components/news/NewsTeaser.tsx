import { BlogType } from "@nature-digital/types";
import icons from "@nature-digital/web-styles";
import styles from "@nature-digital/web-styles/components/news.module.scss";
import Image from "next/image";
import Link from "next/link";
import RenderHTML from "../../utils/renderHtml";

const { iconCalendar } = icons;

const NewsTeaser = ({ data }: { data: BlogType }) => {
  const { title, type, images, url, intro, created } = data || {};

  const { fileId, alt } = images[0] || {};

  return (
    <Link href={`/${type}${url}`} className={styles.newsTeaser}>
      {fileId && (
        <Image
          src={`${process.env.NEXT_PUBLIC_DRUPAL_URL}/getImage/web_medium_1_1/${fileId || 1}`}
          alt={alt || "No image"}
          width={parseInt("480", 10)}
          height={parseInt("480", 10)}
          className={styles.newsTeaser__image}
        />
      )}
      <div className={styles.newsTeaser__wrapper}>
        {title && <h3 className={styles.newsTeaser__title}>{title}</h3>}
        {created && (
          <div className={styles.newsTeaser__info}>
            <div className={styles.newsTeaser__date}>
              <Image src={iconCalendar} alt="calendar" />
              {created}
            </div>
          </div>
        )}
      </div>

      <div className={styles.newsTeaser__text}>
        <RenderHTML text={intro} noLink />
      </div>
    </Link>
  );
};

export default NewsTeaser;
