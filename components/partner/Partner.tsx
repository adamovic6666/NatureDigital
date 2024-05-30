import styles from "@nature-digital/web-styles/components/partners.module.scss";
import icons from "@nature-digital/web-styles";
import Image from "next/image";
import Link from "next/link";

// use aditional class simple__circle to form a card variation with circle image and title
// use aditional class circle to form a card variation with circle image, title, text
const Partner = () => {
  return (
    <Link href="/" className={`${styles.partner}`}>
      <div className={styles.partner__image}>
        <Image src={icons.partnerLogo} alt="news-img" />
      </div>

      <div className={styles.partner__wrapper}>
        <h4 className={styles.partner__title}>Hazel grouse</h4>
        <p className={styles.partner__website}>www.companyname.com</p>
        <p className={styles.partner__description}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam at sapien velit. Vivamus vehicula, lorem eget
          suscipit commodo, nunc risus volutpat ligula
        </p>
      </div>
    </Link>
  );
};

export default Partner;
