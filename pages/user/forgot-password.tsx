import { TEXTS, WEB_PAGES } from "@nature-digital/constants";
import icons from "@nature-digital/web-styles";
import styles from "@nature-digital/web-styles/components/login.module.scss";
import { NextSeo } from "next-seo";
import Image from "next/image";
import Link from "next/link";
import ForgotPasswordForm from "../../components/forms/ForgotPasswordForm";

export default function ForgotPassword() {
  return (
    <>
      <NextSeo title={TEXTS.Profile_reset_password_title} description={TEXTS.Profile_reset_password_title} />
      <div className={styles.forgotPass}>
        <div className={styles.forgotPass__left}>
          <div className={styles.forgotPass__left__wrapper}>
            <div className={`${styles.forgotPass__mainTitle} title--with-icon`}>
              <Image src={icons.resetPass} alt="user" />
              <h1>{TEXTS.Profile_reset_password_title}</h1>
            </div>
            <p>{TEXTS.Profile_reset_link}</p>
            <ForgotPasswordForm />
          </div>
        </div>
        <div className={styles.forgotPass__right}>
          <div className={styles.forgotPass__right__wrap}>
            <h1 className={styles.forgotPass__title}>{TEXTS.Profile_login_now}</h1>
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
