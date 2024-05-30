import { ParagraphBasicInfo } from "@nature-digital/types";
import styles from "@nature-digital/web-styles/components/paragraphs.module.scss";
import RenderHTML from "../../utils/renderHtml";

const NoticeParagraph = ({ headline, text }: ParagraphBasicInfo) => {
  return (
    <div className={`${styles.paragraphNotice} container-small paragraphNotice`}>
      <h3 className={`${styles.paragraphNotice__title} titleCenter`}>{headline}</h3>
      <div className={`${styles.paragraphNotice__text}`}>
        <RenderHTML text={text} />
      </div>
    </div>
  );
};

export default NoticeParagraph;
