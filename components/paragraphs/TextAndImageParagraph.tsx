import icons from "@nature-digital/web-styles";
import styles from "@nature-digital/web-styles/components/paragraphs.module.scss";
import Image from "next/image";

const TextAndImageParagraph = () => {
  return (
    <div className={styles.paragraphTextAndImage}>
      <h3 className={styles.paragraphTextAndImage__title}>Text And Image Paragraph</h3>
      <div className={`${styles.paragraphTextAndImage__wrapper} ${styles.paragraphTextAndImage__imageRight}`}>
        <Image src={icons.cardTeaser} alt="image" className={styles.paragraphTextAndImage__image} />
        <div className={styles.paragraphTextAndImage__text}>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut feugiat lectus id quam dictum, eget pharetra mi
            porttitor. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam at sapien velit. Vivamus
            vehicula, lorem eget suscipit commodo, nunc risus volutpat ligula, sed vulputate velit eros sed felis. Ut
            dictum elit sit amet vehicula hendrerit. Integer iaculis tincidunt bibendum. Nulla auctor eu massa nec
            dignissim. In iaculis quam turpis.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TextAndImageParagraph;
