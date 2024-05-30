import { TEXTS, WEB_PAGES } from "@nature-digital/constants";
import icons from "@nature-digital/web-styles";
import styles from "@nature-digital/web-styles/components/secondary-navigation.module.scss";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { memo, useCallback, useEffect, useState } from "react";
import Backdrop from "../backdrop/Backdrop";
import Portal from "../portal/Portal";
import MainNavigation from "./MainNavigation";
import navigations from "./navigation.json";

const { iconMenu, cheeseTrigger, iconMenuGreen, openNav, logIn } = icons;

const SecondaryNavigation = () => {
  const navigation = navigations.secondary;
  const [open, setTrigger] = useState(false);
  const { pathname, push } = useRouter();
  const session = useSession();
  const isLoggedIn = session.status === "authenticated";

  const handleTrigger = useCallback(() => {
    setTrigger(!open);
    const nav = document.getElementById("navigation");
    nav?.classList.toggle("openNav");

    // eslint-disable-next-line
  }, [open]);

  const [height, setHeight] = useState<any>(typeof window !== "undefined" && window.innerHeight);
  const updateDimensions = () => {
    setHeight(window.innerHeight);
  };

  useEffect(() => {
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  return (
    <>
      <div
        id="navigation"
        className={open ? `${styles.navigation} ${styles.navigation__openSec}` : `${styles.navigation}`}
      >
        {/* cheeseburger trigger */}

        {/* navigation content */}
        <ul className={styles.secondaryNavigation}>
          {navigation.map(({ label, path, icon }) => {
            return (
              <li
                key={`SECONDARY_NAVIGATION_ITEM_${path}`}
                className={`${styles.secondaryNavigation__item} ${
                  pathname === path && styles.secondaryNavigation__item__active
                }`}
              >
                <Link href={path}>
                  <span>
                    <Image src={icons[icon]} alt={`${label} icon`} />
                    {label}
                  </span>
                </Link>
              </li>
            );
          })}

          <li
            className={
              open
                ? `${styles.secondaryNavigation__item} ${styles.secondaryNavigation__item__mainMenu} secNav show`
                : `${styles.secondaryNavigation__item} ${styles.secondaryNavigation__item__mainMenu} secNav`
            }
          >
            <span>
              <span>
                <Image src={iconMenu} alt="menu" className={styles.menuHover} />
                <Image src={iconMenuGreen} alt="menu" className={styles.menuRegular} />
                <span className={styles.secondaryNavigation__item__mainMenu__label}>Menü</span>
              </span>
            </span>
            <div
              className={
                height > 700
                  ? `${styles.secondaryNavigation__submenu}`
                  : `${styles.secondaryNavigation__submenu} ${styles.secondaryNavigation__submenu__scroll}`
              }
              style={{ maxHeight: "100vh", overflowX: "clip" }}
            >
              <MainNavigation
                onClose={() => {
                  handleTrigger();
                }}
              />
            </div>
          </li>
          {!isLoggedIn && (
            <li className={`${styles.secondaryNavigation__item} ${styles.secondaryNavigation__item__login}`}>
              <Link href={WEB_PAGES.USER_LOGIN}>
                <span>
                  <Image src={logIn} alt="login" />
                  {TEXTS.Button_login}
                </span>
              </Link>
            </li>
          )}

          {isLoggedIn && (
            <li className={`${styles.secondaryNavigation__item} ${styles.secondaryNavigation__item__logout}`}>
              <div
                className="link"
                style={{ cursor: "pointer" }}
                onClickCapture={() => {
                  signOut({ redirect: false });

                  push(WEB_PAGES.HOME_PAGE);
                }}
              >
                <span>
                  <Image src={logIn} alt="logout" />
                  {TEXTS.Button_logout}
                </span>
              </div>
            </li>
          )}
        </ul>
        <button
          className={
            open
              ? `${styles.cheeseburgerTrigger} ${styles.cheeseburgerTrigger__openMenu}`
              : `${styles.cheeseburgerTrigger}`
          }
          type="button"
          onClick={handleTrigger}
        >
          <Image
            src={cheeseTrigger}
            alt="trigger"
            className={`${styles.cheeseburgerTrigger__image} ${styles.cheeseburgerTrigger__image__closed}`}
          />
          <Image
            src={openNav}
            alt="trigger"
            className={`${styles.cheeseburgerTrigger__image} ${styles.cheeseburgerTrigger__image__opened}`}
          />
          <span className={styles.cheeseburgerTrigger__label}>Menü</span>
        </button>
      </div>
      <Portal>{open && <Backdrop onClose={() => setTrigger(false)} type="over-footer" />}</Portal>
    </>
  );
};

export default memo(SecondaryNavigation);
