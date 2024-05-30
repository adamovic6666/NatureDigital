import styles from "@nature-digital/web-styles/components/gallery.module.scss";
import icons from "@nature-digital/web-styles";
import Image from "next/image";
import { useState, useEffect } from "react";

const Gallery = ({ data, onDelete, onClick, uncheckAll }) => {
  const { title, subtitle, userPhotos } = data;
  const [checked, setChecked] = useState<any[]>([]);

  // WITH REAL DATA INDEX CAN BE REPLACED WITH UNIQUE IDENTIFIER LIKE ID
  const isAlreadyChecked = id => checked.some(({ drupalId }) => drupalId === id);

  const setCheckedHandler = photo => {
    const checkedItems = isAlreadyChecked(photo.drupalId)
      ? checked.filter(({ drupalId }) => drupalId !== photo.drupalId)
      : [...checked, photo];
    onDelete(photo);
    setChecked(checkedItems);
  };

  useEffect(() => {
    uncheckAll && setChecked([]);
  }, [uncheckAll]);

  return (
    <div className={styles.gallery}>
      <h3 className={styles.gallery__title}>{title}</h3>
      <h5 className={styles.gallery__subtitle}>{subtitle}</h5>
      <div className={styles.gallery__gallery}>
        {userPhotos.map(photo => {
          return (
            <div
              className={styles.gallery__gallery__image}
              key={`GALLERY_USER_PHOTOS_${photo?.url}`}
              aria-hidden="true"
            >
              <Image
                src={process.env.NEXT_PUBLIC_DRUPAL_URL + photo.url}
                alt="image"
                width={photo.width ?? 300}
                height={photo.height ?? 300}
                onClick={() => onClick(photo.idx)}
              />
              <div className={`formItem formTypeCheckbox filter ${styles.gallery__gallery__image__filter}`}>
                <>{/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}</>
                {/* <label htmlFor="main-category" /> */}
                <span
                  className={` ${
                    isAlreadyChecked(photo.drupalId) ? styles.gallery__checked__true : styles.gallery__checked
                  }`}
                />
                <input
                  id="main-category"
                  type="checkbox"
                  checked={isAlreadyChecked(photo.drupalId)}
                  onChange={() => {
                    setCheckedHandler(photo);
                  }}
                />
              </div>
              {photo.status === "published" && (
                <div className={styles.gallery__gallery__image__published}>
                  <Image src={icons.publish} alt="publish" />
                  <span>geteilt</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Gallery;
