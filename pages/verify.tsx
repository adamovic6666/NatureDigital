import { API_ENDPOINTS, REQUEST_SECRET, TEXTS, WEB_PAGES } from "@nature-digital/constants";
import icons from "@nature-digital/web-styles";
import styles from "@nature-digital/web-styles/components/login.module.scss";
import axios from "axios";
import { NextSeo } from "next-seo";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";

const ApplicationButton = dynamic(() => import("../components/buttons/openApp"), {
  ssr: false,
});

export default function Verify({ result }) {
  return (
    <>
      <NextSeo title="Verification" />
      <div className={styles.login}>
        <div className={styles.login__left}>
          <div className={styles.login__left__wrapper}>
            <div className={styles.login__mainTitle}>
              <Image src={icons.user} alt="user" />
              <h3>Verification</h3>
            </div>
            <p>
              <strong>{result?.message}</strong>
            </p>
            <ApplicationButton />
          </div>
        </div>
        <div className={styles.login__right}>
          <div className={styles.login__right__wrap}>
            <h1 className={styles.login__title}>{TEXTS.Profile_login_now}</h1>
            <Link className={` button ${styles.login__registerButton}`} type="button" href={WEB_PAGES.USER_LOGIN}>
              <span>{TEXTS.Button_login}</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(ctx: { query: { login: string } }) {
  const { login } = ctx.query || null;

  if (!login) {
    return {
      notFound: true,
    };
  }

  let result;

  try {
    const { data } = await axios.get(process.env.NEXT_PUBLIC_API_URL + API_ENDPOINTS.VERIFY(login), {
      headers: {
        secretkey: REQUEST_SECRET,
      },
    });

    result = data;
  } catch (error) {
    console.log(error);
  }

  return {
    props: {
      result,
    },
  };
}
