import { FULL_NODE_TITLES } from "@nature-digital/constants";
import styles from "@nature-digital/web-styles/components/paragraphs.module.scss";
import TextParagraph from "./TextParagraph";

// aditional classes for alignment of title or text (textRight, textLeft, textCenter)
// aditional class for background color (hasBackground)
// additional class for container (container-small, container-medium, container)

const TextBackgroundParagraph = ({ links, rechtliches }) => {
  return (
    <div className={`${styles.paragraphTextBackground} paragraphTextBackground`}>
      <div className={`${styles.paragraphTextBackground__wrapper}  paragraphTextBackgroundWrapper`}>
        <div className={`${styles.paragraphTextBackground__text} paragraphTextBackgroundText`}>
          {links && <TextParagraph headline={FULL_NODE_TITLES.SOURCE} text={links} />}
          {rechtliches && <TextParagraph headline={FULL_NODE_TITLES.LEGAL} text={rechtliches} />}
        </div>
      </div>
    </div>
  );
};
export default TextBackgroundParagraph;
