import { TEXTS, WEB_PAGES } from "@nature-digital/constants";
import icons from "@nature-digital/web-styles";
import styles from "@nature-digital/web-styles/components/login.module.scss";
import { NextSeo } from "next-seo";
import Image from "next/image";
import Link from "next/link";
import PasswordResetForm from "../components/forms/PasswordResetForm";

export default function Reset({ login }) {
  return (
    <>
      <NextSeo title="Verification" />
      <div className={styles.login}>
        <div className={styles.login__left}>
          <div className={styles.login__left__wrapper}>
            <div className={styles.login__mainTitle}>
              <Image src={icons.user} alt="user" />
              <h3>{TEXTS.Profile_reset_password_title}</h3>
            </div>
            <PasswordResetForm login={login} />
          </div>
        </div>
        <div className={styles.login__right}>
          <div className={styles.login__right__wrap}>
            <div className={styles.login__right__wrap}>
              <h1 className={styles.login__title}>{TEXTS.Profile_login_now}</h1>
              <Link
                className={` button buttonImage ${styles.login__registerButton}`}
                type="button"
                href={WEB_PAGES.USER_LOGIN}
              >
                <Image src={icons.user} alt="user" />
                <span>{TEXTS.Button_login}</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(ctx) {
  const { login = null } = ctx.query;

  if (login === null) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      login,
    },
  };
}
