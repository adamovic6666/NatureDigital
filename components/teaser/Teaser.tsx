import { ItemType } from "@nature-digital/types";
import styles from "@nature-digital/web-styles/components/teaser.module.scss";
import Image from "next/image";
import Link from "next/link";

const Teaser = ({ item }: { item: ItemType }) => {
  const { title, subtitle, type, images, url } = item;
  const { fileId, alt } = images?.[0] || {};

  return (
    <Link className={`${styles.teaser} teaserType__${type}`} href={`/${type}${url}`}>
      <div className={styles.teaser__image}>
        <Image
          src={`${process.env.NEXT_PUBLIC_DRUPAL_URL}/getImage/web_medium_1_1/${fileId || 1}`}
          alt={alt || "No image"}
          width={250}
          height={250}
          priority
        />
      </div>
      <div className={styles.teaser__wrapper}>
        <h4 className={styles.teaser__title}>{title}</h4>
        {subtitle !== "" && subtitle && (
          <div className={styles.teaser__category}>
            <p className={styles.teaser__category__subtitle}>{subtitle}</p>
          </div>
        )}
      </div>
    </Link>
  );
};

export default Teaser;
