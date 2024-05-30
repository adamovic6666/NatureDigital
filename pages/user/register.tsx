import { TEXTS, WEB_PAGES } from "@nature-digital/constants";
import icons from "@nature-digital/web-styles";
import styles from "@nature-digital/web-styles/components/login.module.scss";
import { getSession } from "next-auth/react";
import { NextSeo } from "next-seo";
import Image from "next/image";
import Link from "next/link";
import RegisterForm from "../../components/forms/RegisterForm";

export default function Register() {
  return (
    <>
      <NextSeo title={TEXTS.Profile_register_title} description={TEXTS.Profile_register_title} />
      <div className={styles.register}>
        <div className={styles.register__left}>
          <div className={styles.register__left__wrapper}>
            <div className={`${styles.register__mainTitle} title--with-icon`}>
              <Image src={icons.user} alt="user" />
              <h1>{TEXTS.Profile_register_title}</h1>
            </div>
            <p>
              Die Registrierung kann sich auf Metriken wie Aufbewahrung Aktivierung und Empfehlung auswirken. Die
              Registrierung kann das Engagement verbessern, es hat keine Auswirkung auf andere.
            </p>
            <RegisterForm />
          </div>
        </div>
        <div className={styles.register__right}>
          <div className={styles.register__right__wrap}>
            <h1 className={styles.register__title}>
              Danke für Ihre
              <br />
              Registrieren!
            </h1>
            <Link
              className={` button buttonImage ${styles.login__registerButton}`}
              type="button"
              href={WEB_PAGES.USER_LOGIN}
            >
              <Image src={icons.logIn} alt="user" />
              <span>{TEXTS.Button_login}</span>
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
