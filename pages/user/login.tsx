import { TEXTS, WEB_PAGES } from "@nature-digital/constants";
import icons from "@nature-digital/web-styles";
import styles from "@nature-digital/web-styles/components/login.module.scss";
import { getSession } from "next-auth/react";
import { NextSeo } from "next-seo";
import Image from "next/image";
import Link from "next/link";
import LogInForm from "../../components/forms/LogInForm";

export default function Login() {
  return (
    <>
      <NextSeo title={TEXTS.Profile_login_title} description={TEXTS.Profile_login_title} />
      <div className={styles.login}>
        <div className={styles.login__left}>
          <div className={styles.login__left__wrapper}>
            <div className={`${styles.login__mainTitle} title--with-icon`}>
              <Image src={icons.logIn} alt="user" />
              <h1>{TEXTS.Profile_login_title}</h1>
            </div>
            <div className={styles.login__form}>
              <LogInForm />
            </div>
          </div>
        </div>
        <div className={styles.login__right}>
          <div className={styles.login__right__wrap}>
            <h1 className={styles.login__title}>{TEXTS.Profile_register_now}</h1>
            <Link
              className={` button buttonImage ${styles.login__registerButton}`}
              type="button"
              href={WEB_PAGES.USER_REGISTER}
            >
              <Image src={icons.user} alt="user" />
              <span>{TEXTS.Button_registration}</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(ctx) {
  const session = await getSession(ctx);

  if (session) {
    return {
      redirect: { destination: "/" },
    };
  }

  return {
    props: {
      session,
    },
  };
}
