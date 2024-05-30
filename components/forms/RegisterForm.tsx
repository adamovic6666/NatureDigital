import { API_ENDPOINTS, FORM_FIELDS, REQUEST_SECRET, TEXTS } from "@nature-digital/constants";
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

const RegisterForm = () => {
  const methods = useForm();
  const { push } = useRouter();

  const onSubmit = useCallback(input => {
    // eslint-disable-next-line
    const { newPassword, repeatPassword, ...payload } = input;

    payload.password = newPassword;
    payload.source = "web";
    axios
      .post(process.env.NEXT_PUBLIC_API_URL + API_ENDPOINTS.REGISTER, payload, {
        headers: {
          secretkey: REQUEST_SECRET,
        },
      })
      .then(({ data }) => {
        if (data?.message) {
          createToast({ message: data.message, type: "success" });
        }

        push("/user/login");
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
        rules={{ validate: FORM_FIELDS.username.validate }}
        name={FORM_FIELDS.username.name}
        label={TEXTS.Profile_username}
      />
      <Input
        rules={{ validate: FORM_FIELDS.email.validate }}
        name={FORM_FIELDS.email.name}
        label={TEXTS.Profile_email_adress}
      />
      <Input
        rules={{ validate: FORM_FIELDS.newPassword.validate }}
        name={FORM_FIELDS.newPassword.name}
        type="password"
        isPassword
        label={TEXTS.Profile_password}
      />
      <Input
        rules={{ validate: v => FORM_FIELDS.repeatPassword.validate(v, methods.getValues()) }}
        name={FORM_FIELDS.repeatPassword.name}
        type="password"
        isPassword
        label={TEXTS.Profile_password_confirm}
      />

      <div className={`${styles.register__buttons} `}>
        <button
          onClick={methods.handleSubmit(onSubmit)}
          className={`button buttonImage ${styles.register__submitButton}`}
          type="submit"
        >
          <Image src={icons.check} alt="check icon" />
          <span>{TEXTS.Button_registration}</span>
        </button>
      </div>
    </Form>
  );
};

export default RegisterForm;
