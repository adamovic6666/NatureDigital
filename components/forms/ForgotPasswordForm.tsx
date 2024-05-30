import { API_ENDPOINTS, FORM_FIELDS, REQUEST_SECRET, TEXTS } from "@nature-digital/constants";
import styles from "@nature-digital/web-styles/components/login.module.scss";
import axios from "axios";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { createToast } from "../toast/Toast";
import Form from "./components/Form";
import Input from "./components/Input";

const ForgotPasswordForm = () => {
  const methods = useForm();

  const onSubmit = useCallback(input => {
    axios
      .post(process.env.NEXT_PUBLIC_API_URL + API_ENDPOINTS.RESET_PASSWORD, input, {
        headers: {
          secretkey: REQUEST_SECRET,
        },
      })
      .then(({ data }) => {
        if (data?.message) {
          createToast({ message: data.message, type: "success" });
        }
      })
      .catch(({ response }) => {
        if (response.data?.message) {
          createToast({ message: response.data.message, type: "error" });
        }
      });
  }, []);

  return (
    <Form {...methods}>
      <Input
        rules={{ validate: FORM_FIELDS.email.validate }}
        name={FORM_FIELDS.email.name}
        label={TEXTS.Profile_email_adress}
      />

      <div className={`${styles.forgotPass__buttons} `}>
        <button
          onClick={methods.handleSubmit(onSubmit)}
          className={`button buttonImage ${styles.forgotPass__submitButton} `}
          type="submit"
        >
          <span>{TEXTS.Button_reset_link}</span>
        </button>
      </div>
    </Form>
  );
};

export default ForgotPasswordForm;
