import { ParagraphBasicInfo } from "@nature-digital/types";
import styles from "@nature-digital/web-styles/components/paragraphs.module.scss";
import RenderHTML from "../../utils/renderHtml";

const TextParagraph = ({ headline, text, noLink }: ParagraphBasicInfo) => {
  return (
    <div className={styles.paragraphText}>
      {headline && <h4 className={styles.paragraphText__title}>{headline}</h4>}
      <div className={styles.paragraphText__wrapper}>
        <div className={`${styles.paragraphText__text} paragraphTextText`}>
          <RenderHTML text={text} noLink={noLink} />
        </div>
      </div>
    </div>
  );
};

export default TextParagraph;
