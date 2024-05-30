import { API_ENDPOINTS, FORM_FIELDS, REQUEST_SECRET, TEXTS, WEB_PAGES } from "@nature-digital/constants";
import icons from "@nature-digital/web-styles";
import styles from "@nature-digital/web-styles/components/login.module.scss";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/router";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { createToast } from "../toast/Toast";
import Form from "./components/Form";
import Input from "./components/Input";

const PasswordResetForm = ({ login }: { login: string }) => {
  const { push } = useRouter();
  const methods = useForm();

  const onSubmit = useCallback(input => {
    input.login = login;
    axios
      .post(process.env.NEXT_PUBLIC_API_URL + API_ENDPOINTS.RESET_PASSWORD_VALIDATE, input, {
        headers: {
          secretkey: REQUEST_SECRET,
        },
      })
      .then(({ data }) => {
        if (data?.message) {
          createToast({ message: data.message, type: "success" });

          setTimeout(() => {
            push(WEB_PAGES.USER_LOGIN);
          }, 1000);
        }
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
        name={FORM_FIELDS.newPassword.name}
        rules={{ validate: FORM_FIELDS.newPassword.validate }}
        type="password"
        isPassword
        label={TEXTS.Profile_password}
      />
      <Input
        name="confirmNewPassword"
        rules={{ validate: v => FORM_FIELDS.repeatPassword.validate(v, methods.getValues()) }}
        type="password"
        isPassword
        label={TEXTS.Profile_new_password_repeat}
      />

      <div className={`${styles.login__buttons} `}>
        <button
          onClick={methods.handleSubmit(onSubmit)}
          className={`button buttonImage ${styles.login__submitButton} `}
          type="submit"
        >
          <Image src={icons.userWhite} alt="user" />
          <span>{TEXTS.Button_profile_save}</span>
        </button>
      </div>
    </Form>
  );
};

export default PasswordResetForm;
