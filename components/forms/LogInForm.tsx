import { API_ENDPOINTS, FORM_FIELDS, REQUEST_SECRET, TEXTS, WEB_PAGES } from "@nature-digital/constants";
import icons from "@nature-digital/web-styles";
import styles from "@nature-digital/web-styles/components/login.module.scss";
import axios from "axios";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { createToast } from "../toast/Toast";
import Form from "./components/Form";
import Input from "./components/Input";

const LogInForm = () => {
  const { push } = useRouter();
  const methods = useForm();

  const onSubmit = useCallback(input => {
    axios
      .post(process.env.NEXT_PUBLIC_API_URL + API_ENDPOINTS.LOGIN, input, {
        headers: {
          secretkey: REQUEST_SECRET,
        },
      })
      .then(async ({ data }) => {
        if (data.data) {
          await signIn("credentials", {
            redirect: false,
            user: JSON.stringify(data.data),
          });
        }

        if (data.message) {
          createToast({ message: data.message, type: "success" });
        }
        push(WEB_PAGES.HOME_PAGE);
      })
      .catch(({ response }) => {
        if (response.data?.message) {
          createToast({ message: response.data.message, type: "error" });
        }
      });
    // eslint-disable-next-line
  }, []);

  return (
    <Form {...methods}>
      <Input
        name={FORM_FIELDS.username.name}
        label={TEXTS.Profile_username}
        rules={{ validate: FORM_FIELDS.username.validate }}
      />
      <Input
        name={FORM_FIELDS.password.name}
        type="password"
        isPassword
        label={TEXTS.Profile_password}
        rules={{ validate: FORM_FIELDS.username.validate }}
      />

      <div className={`${styles.login__buttons} `}>
        <button
          onClick={methods.handleSubmit(onSubmit)}
          className={`button buttonImage ${styles.login__submitButton} `}
          type="submit"
        >
          <Image src={icons.userWhite} alt="user" />
          <span>{TEXTS.Button_login}</span>
        </button>
        <Link className={`button ${styles.login__forgotPassword} `} href={WEB_PAGES.USER_FORGOT_PASSWORD}>
          {TEXTS.Button_forgot_password}
        </Link>
      </div>
    </Form>
  );
};

export default LogInForm;
