import HCaptcha from "@hcaptcha/react-hcaptcha";
import icons from "@nature-digital/web-styles";
import styles from "@nature-digital/web-styles/components/newsletter.module.scss";
import Image from "next/image";
import { useState } from "react";

const Newsletter = () => {
  const [verified, setVerified] = useState(false);

  return (
    <div className={`${styles.newsletter}`}>
      <div className={`container-medium ${styles.newsletter__wrapper}`}>
        <div className={`${styles.newsletter__left}`}>
          <Image src={icons.newsletter} alt="newsletter" />
        </div>
        <div className={`${styles.newsletter__right}`}>
          <h3>Jetzt anmelden für den </h3>
          <h2>Newsletter!</h2>
          <form className={`${styles.newsletter__form}`}>
            <div className={`formItem formText ${styles.newsletter__email}`}>
              <label htmlFor="email">
                <input id="email" type="email" placeholder="E-mail" />
              </label>
            </div>

            <div className={`${styles.newsletter__buttons} `}>
              <HCaptcha
                sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY as string}
                onVerify={() => setVerified(true)}
              />
              <button className={`button ${styles.newsletter__submitButton} `} type={verified ? "submit" : "button"}>
                Anmelden
              </button>
            </div>
          </form>
          <div className={`${styles.newsletter__text}`}>
            <p>
              Ich bin einverstanden, dass das Ministerium für Umwelt und Verbraucherschutz meine Daten zur
              Anfrage-/Auftragsbearbeitung speichert. Sie werden nicht an unbeteiligte Dritte weitergegeben. .
            </p>
            <p>Ich habe die Datenschutzbedingungen gelesen und akzeptiere diese.</p>
            <p>
              natur.digital – App und Website – werden vom bayerischen Staatsministerium für Umwelt und
              Verbraucherschutz und der Bayerischen Naturschutzverwaltung herausgegeben.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Newsletter;
