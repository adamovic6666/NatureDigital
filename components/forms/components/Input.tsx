import { BasicTextInputProps } from "@nature-digital/types";
import icons from "@nature-digital/web-styles";
import Image from "next/image";
import { useState } from "react";

const Input = (props: BasicTextInputProps) => {
  const { error, value, label, name, placeholder, onChange, isPassword, type, disabled } = props;

  const [show, setShow] = useState(false);

  return (
    <div className={`formItem formText${isPassword ? " formPassword" : ""}${error ? " error" : ""}`}>
      <label htmlFor={name}>
        <span>{label}</span>
        <input
          id={name}
          disabled={disabled}
          type={show ? "text" : type}
          placeholder={placeholder}
          onChange={({ target }) => onChange?.(target?.value || "")}
          name={name}
          value={value}
        />
        {isPassword && (
          <span className="show">
            <Image
              src={show ? icons.hidePassword : icons.showPassword}
              alt="showPassword"
              onClick={() => setShow(!show)}
            />
          </span>
        )}
        {error && <span className="errorMessage">{error}</span>}
      </label>
    </div>
  );
};

Input.defaultProps = {
  isPassword: false,
  type: "text",
} as BasicTextInputProps;

export default Input;
