import { WEB_PAGES } from "@nature-digital/constants";
import icons from "@nature-digital/web-styles";
import styles from "@nature-digital/web-styles/components/branding.module.scss";
import Image from "next/image";
import Link from "next/link";

const { logoHeader, logo } = icons;

const Branding = () => {
  return (
    <div className={styles.logo}>
      <Link href={WEB_PAGES.HOME_PAGE}>
        <Image src={logoHeader} alt="logo" className={styles.logo__desktop} />
        <Image src={logo} alt="logo" className={styles.logo__mobile} />
      </Link>
    </div>
  );
};

export default Branding;
