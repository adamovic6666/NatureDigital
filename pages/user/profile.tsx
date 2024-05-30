import { TEXTS } from "@nature-digital/constants";
import icons from "@nature-digital/web-styles";
import styles from "@nature-digital/web-styles/components/login.module.scss";
import { getSession } from "next-auth/react";
import { NextSeo } from "next-seo";
import Image from "next/image";
import UpdateProfile from "../../components/forms/UpdateProfile";

export default function Profile() {
  return (
    <>
      <NextSeo title={TEXTS.Profile_login_title} description={TEXTS.Profile_login_title} />
      <div className={styles.login}>
        <div className={styles.login__left}>
          <div className={styles.login__left__wrapper}>
            <div className={`${styles.login__mainTitle} title--with-icon`}>
              <Image src={icons.user} alt="user" />
              <h1>Mein profil</h1>
            </div>
            <h3>Persönliche Daten</h3>
            <UpdateProfile />
          </div>
        </div>
        <div className={styles.login__right}>
          <div className={styles.login__right__wrap} />
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(ctx) {
  const session = await getSession(ctx);

  if (!session) {
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
