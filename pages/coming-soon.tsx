import { NextSeo } from "next-seo";
import icons from "@nature-digital/web-styles";
import Image from "next/image";
import styles from "@nature-digital/web-styles/components/coming-soon.module.scss";
import Newsletter from "../components/newsletter/Newsletter";

export default function ComingSoon() {
  return (
    <>
      <NextSeo
        title="Touren und Tipps – so entdeckst du Bayerns Natur"
        description="Erlebe Bayerns Natur mit unserer kostenfreien App! Tipps, Routen & Expertenwissen immer dabei - online und offline. Entdecke Tiere und Pflanzen auf neuen Wegen."
      />
      <div className={styles.comingSoon__page}>
        <div className="container-small">
          <div className={`textCenter logoLanding ${styles.comingSoon__logo}`}>
            <Image src={icons.logoHeader} alt="logo" />
          </div>

          <div className={styles.comingSoon__text}>
            <div className={styles.comingSoon__text__withImage}>
              <div className={styles.comingSoon__text__withImage__wrap}>
                <h1 className="title--with-line">Dein AugenBLICK in die Natur!</h1>
                <p>Du bist gern in der Natur Bayerns unterwegs? Möchtest neue Routen kennenlernen? </p>
                <p>
                  Hast du dich schon immer gefragt, ob der Gänsesäger wirklich Gänse zersägt? Warum querfeldein keine
                  gute Idee ist?
                </p>
                <p>Oder kennst du Thymian nur von deiner Pizza?</p>
              </div>
              <div className={styles.comingSoon__text__withImage__image} />
            </div>
            <h1 className="title--with-line">natur.digital die neue Alles-in-Einem-App</h1>
            <p>
              Für alle Naturentdecker und die, die es noch werden wollen, ist natur.digital genau das Richtige.
              Kostenlos. Online und offline nutzbar. Herausgeber ist die Bayerische Naturschutzverwaltung, alle Infos
              von Experten aufbereitet. Und demnächst auf Deinem Handy immer griffbereit.
            </p>
            <h1 className="title--with-line">Dein digitaler Natur-Begleiter – allzeit bereit & alles in einem</h1>
            <p>Zwei Fliegen mit einer Klappe! Statt einer Routen-App und einer Wissens-App gibts jetzt all-in-one. </p>
            <ul>
              <li>übersichtliche und interessante Inhalte</li>
              <li>spannendes Expertenwissen</li>
              <li>immer auf dem aktuellen Stand dank regelmäßig neuer Inhalte</li>
            </ul>
            <h1 className="title--with-line">
              Bald ist es soweit, dann kannst du natur.digital im Web und als App nutzen
            </h1>
            <p>Schon jetzt spannende Infos gefällig? Und zum Start direkt dabei: </p>{" "}
            <p>
              natur.digital startet Mitte 2023. Wenn du schon jetzt spannende Natur-Infos, tolle Tipps und
              Hintergrundwissen haben willst, dann trag dich hier ein. So bleibst du am Ball und gehörst dann zu den
              Ersten, die mit natur.digital unterwegs sind:
            </p>
          </div>
        </div>
        <Newsletter />
      </div>
    </>
  );
}
