import icons from "@nature-digital/web-styles";
import Image from "next/image";
import Link from "next/link";
import styles from "@nature-digital/web-styles/components/main-navigation.module.scss";
import { signOut, useSession } from "next-auth/react";
import { useState, useEffect, memo } from "react";
import { useRouter } from "next/router";
import { TEXTS, WEB_PAGES } from "@nature-digital/constants";
import navigations from "./navigation.json";

const MainNavigation = ({ onClose }) => {
  const session = useSession();
  const isLoggedIn = session.status === "authenticated";
  const { push } = useRouter();
  const [open, setTrigger] = useState(false);
  const { asPath } = useRouter();

  const navigation = navigations.main;

  const handleTrigger = () => {
    setTrigger(!open);
  };

  useEffect(() => {
    if (["/kontakt", "/datenschutz", "/nutzungsbedingungen"].includes(asPath)) {
      setTrigger(true);
      return;
    }
    setTrigger(false);
  }, [asPath]);

  return (
    <ul className={styles.mainNavigation} style={{ overflow: "auto", overflowX: "clip" }}>
      {navigation.map(({ label, path, requiredSession, icon, items }) => {
        if (requiredSession && !isLoggedIn) return null;
        return (
          <li
            key={`MAIN_NAVIGATION_ITEM_${path}`}
            className={`${styles.mainNavigation__item} ${asPath === path ? styles.mainNavigation__item__active : ""}`}
          >
            {!items && (
              <Link href={path} onClick={onClose}>
                <Image src={icons[icon]} alt={`${label} icon`} />
                {label}
              </Link>
            )}
            {items && items.length && (
              <span
                role="presentation"
                className={
                  open
                    ? `${styles.mainNavigation__item__expanded} ${styles.mainNavigation__item__expanded__open}`
                    : `${styles.mainNavigation__item__expanded}`
                }
              >
                <span
                  className={styles.mainNavigation__item__expandedMenu}
                  role="presentation"
                  onClick={() => {
                    handleTrigger();
                  }}
                  onKeyDown={() => {
                    handleTrigger();
                  }}
                >
                  <span className={styles.mainNavigation__item__expanded__label}>
                    <Image src={icons[icon]} alt={`${label} icon`} />
                    {label}
                  </span>
                  <span
                    className={
                      open
                        ? `${styles.mainNavigation__item__expanded__dropdown} ${styles.mainNavigation__item__expanded__dropdown__open}`
                        : `${styles.mainNavigation__item__expanded__dropdown}`
                    }
                  >
                    <Image src={icons.dropdownWhite} alt="dropdown" />
                  </span>{" "}
                </span>
                <ul className={styles.mainNavigation__subMenu}>
                  {items.map(({ items_label, items_path }) => {
                    return (
                      <li
                        key={`MAIN_NAVIGATION_SUBMENU_ITEM_${items_path}`}
                        className={`${styles.mainNavigation__subMenu__item} ${
                          asPath === items_path ? styles.mainNavigation__item__active : ""
                        }`}
                      >
                        <Link href={items_path} onClick={onClose}>
                          {items_label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </span>
            )}
          </li>
        );
      })}
      {!isLoggedIn && (
        <li className={`${styles.mainNavigation__item} ${styles.mainNavigation__item__login}`}>
          <Link href={WEB_PAGES.USER_LOGIN} onClick={onClose}>
            <Image src={icons.logInWhite} alt="login" />
            {TEXTS.Button_login}
          </Link>
        </li>
      )}

      {isLoggedIn && (
        <li className={`${styles.mainNavigation__item} ${styles.mainNavigation__item__logout}`}>
          <div
            className="link"
            style={{ cursor: "pointer" }}
            onClickCapture={() => {
              signOut({ redirect: false });

              push(WEB_PAGES.HOME_PAGE);
            }}
          >
            <Image src={icons.logInWhite} alt="logout" />
            {TEXTS.Button_logout}
          </div>
        </li>
      )}
    </ul>
  );
};

export default memo(MainNavigation);
