import { WEB_PAGES } from "@nature-digital/constants";
import icons from "@nature-digital/web-styles";
import styles from "@nature-digital/web-styles/components/footer.module.scss";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback } from "react";

const { iconPlay, iconApple, footerLogo, appStore, playStore, bnv } = icons;

const Footer = ({ small }: { small: boolean }) => {
  const router = useRouter();

  const withoutFooter = router.pathname === WEB_PAGES.MAP;

  const linkOpenHandler = useCallback((url: string) => {
    window.open(url, "_blank");
  }, []);

  return (
    <div id="footer" className={`${styles.footer} ${withoutFooter ? styles.footer_hide : ""}`}>
      {!small && (
        <>
          <div className={styles.region__footer__first}>
            <div className={styles.blockLogo}>
              <Link href={WEB_PAGES.HOME_PAGE}>
                <Image src={footerLogo} alt="logo" />
              </Link>
            </div>
          </div>
          <div className={styles.region__footer__second}>
            <div className={styles.footer__menu}>
              <div key="apps" className={styles.footer__menuDownload}>
                <a
                  target="_blank"
                  href={WEB_PAGES.GOOGLE_PLAY}
                  className={styles.footer__menuDownload__link}
                  rel="noreferrer"
                >
                  <Image src={iconPlay} alt="Google play" />
                </a>
                <a
                  target="_blank"
                  href={WEB_PAGES.APP_STORE}
                  className={styles.footer__menuDownload__link}
                  rel="noreferrer"
                >
                  <Image src={iconApple} alt="App store" />
                </a>
              </div>
            </div>
          </div>
          <div className={styles.region__footer__third}>
            <div className={styles.footer__container}>
              <div className={styles.block}>
                <h5>Herausgeber</h5>
                <div>
                  {/*  // TODO: Add link later */}
                  {/* <Link href="https://www.google.com/googleplay" target="_blank"> */}
                  <Image src={bnv} alt="bvn" />
                  {/* </Link> */}
                </div>
              </div>
              <div className={styles.block}>
                <h5>Laden Sie unsere App herunter</h5>
                <div className={styles.downloadLogo}>
                  <span onClickCapture={() => linkOpenHandler(WEB_PAGES.APP_STORE)}>
                    <Image src={appStore} alt="app Store" />
                  </span>
                  <span onClickCapture={() => linkOpenHandler(WEB_PAGES.GOOGLE_PLAY)}>
                    <Image src={playStore} alt="play Store" />
                  </span>
                </div>
              </div>
              {/* <div className={styles.block}>
              <h5>Apps</h5>
              <div className={styles.appsLogo}>
                <Link href="https://www.google.com/appstore">
                  <Image src={logoMap} alt="play Store" />
                </Link>
                <Link href="https://www.google.com/appstore">
                  <Image src={logoLeaf} alt="play Store" />
                </Link>
                <Link href="https://www.google.com/appstore">
                  <Image src={logoCheck} alt="play Store" />
                </Link>
              </div>
            </div> */}
              <div className={styles.block}>
                <h5>Partners</h5>
                <div className={styles.partnersLogo}>
                  <span
                    className={styles.partnersLogo__link}
                    onClickCapture={() => linkOpenHandler(WEB_PAGES.MUSEUM_OF_NATURAL_SCIENCE)}
                  />
                  <span
                    className={styles.partnersLogo__link}
                    onClickCapture={() => linkOpenHandler(WEB_PAGES.FEDERATION_NATURE_PROTECTION)}
                  />
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <div
        className={`${styles.region__footer__fourth} ${
          small ? styles.region__footer__fourth__grid : styles.region__footer__fourth__flex
        }`}
      >
        <div className={styles.blockCopyright}>
          <p>© Natur Digital. All rights reserved.</p>
          <span onClickCapture={() => linkOpenHandler(WEB_PAGES.NATURE_EXPERIENCE)}>Datenschutzrichtlinien</span>
        </div>
        {small && (
          <ul className={styles.menuApp}>
            <li className={`${styles.menuItem} ${styles.menuApp__menuItem}`}>
              <a
                target="_blank"
                href={WEB_PAGES.GOOGLE_PLAY}
                className={styles.menuApp__menuItem__link}
                rel="noreferrer"
              >
                <Image src={iconPlay} alt="Google play" />
              </a>
            </li>
            <li className={`${styles.menuItem} ${styles.menuApp__menuItem}`}>
              <a target="_blank" href={WEB_PAGES.APP_STORE} className={styles.menuApp__menuItem__link} rel="noreferrer">
                <Image src={iconApple} alt="App store" />
              </a>
            </li>
          </ul>
        )}
        <div className={styles.blockPoweredBy}>
          <p>
            Designed and developed by&nbsp;
            <span onClickCapture={() => linkOpenHandler(WEB_PAGES.STUDIO_PRESENT)}>Studio Present</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
