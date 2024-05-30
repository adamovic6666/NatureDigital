import { API_ENDPOINTS, FORM_FIELDS, REQUEST_SECRET, TEXTS, URL_KEYS, WEB_PAGES } from "@nature-digital/constants";
import icons from "@nature-digital/web-styles";
import styles from "@nature-digital/web-styles/components/login.module.scss";
import axios from "axios";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { createToast } from "../toast/Toast";
import Form from "./components/Form";
import Input from "./components/Input";

const UpdateProfile = () => {
  const { data } = useSession();

  const defaultValues = {
    [FORM_FIELDS.username.name]: data?.user.username,
    [FORM_FIELDS.email.name]: data?.user.email,
  };

  const methods = useForm({ defaultValues });

  const onSubmit = useCallback(
    input => {
      if (input[FORM_FIELDS.webNewPassword.name] === "") {
        delete input[FORM_FIELDS.webNewPassword.name];
      } else {
        input[FORM_FIELDS.newPassword.name] = input[FORM_FIELDS.webNewPassword.name];
        delete input[FORM_FIELDS.webNewPassword.name];
      }

      axios
        .put(process.env.NEXT_PUBLIC_API_URL + API_ENDPOINTS.UPDATE_USER, input, {
          headers: {
            secretkey: REQUEST_SECRET,
            Authorization: data?.user.token || "",
          },
        })
        .then(({ data: response }) => {
          if (response?.message) {
            createToast({ message: response.message, type: "success" });

            axios.get(WEB_PAGES.USER_UPDATE, {
              params: { [URL_KEYS.USERNAME]: input.username },
            });
          }
        })
        .catch(({ response }) => {
          if (response.data?.message) {
            createToast({ message: response.data.message, type: "error" });
          }
        });
    },
    [data],
  );

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
        disabled
        label={TEXTS.Profile_email}
      />
      <Input
        rules={{ validate: FORM_FIELDS.webNewPassword.validate }}
        name={FORM_FIELDS.webNewPassword.name}
        type="password"
        isPassword
        label={TEXTS.Profile_new_password_title}
      />
      <Input
        name={FORM_FIELDS.confirmNewPassword.name}
        dependencies={[
          {
            name: FORM_FIELDS.webNewPassword.name,
            visibleWhen: v => v !== undefined && v !== "",
          },
        ]}
        rules={{ validate: v => FORM_FIELDS.confirmNewPassword.validate(v, methods.getValues()) }}
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

export default UpdateProfile;
