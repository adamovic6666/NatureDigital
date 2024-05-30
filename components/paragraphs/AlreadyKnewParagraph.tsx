import { FULL_NODE_TITLES } from "@nature-digital/constants";
import { DidYouKnowType } from "@nature-digital/types";
import styles from "@nature-digital/web-styles/components/paragraphs.module.scss";
import TextParagraph from "./TextParagraph";

const AlreadyKnewParagraph = ({ data }: { data: Array<DidYouKnowType> }) => {
  return (
    <div className={styles.paragraphAlreadyKnew}>
      <div className={styles.paragraphAlreadyKnew__bg}>
        <div className={styles.paragraphAlreadyKnew__wrapper}>
          <h3 className={styles.paragraphAlreadyKnew__title}>
            <span>{FULL_NODE_TITLES.DID_YOU_KNOW}</span>
          </h3>
          {data.length &&
            data.map(({ headline, text }, idx) => {
              return (
                <div
                  className={styles.paragraphAlreadyKnew__paragraph}
                  key={`ALREADY_KNEW_PARAGRAPH_${headline}_${JSON.stringify(headline) + idx}`}
                >
                  <TextParagraph headline={headline} text={text || ""} />
                  <div className={styles.paragraphAlreadyKnew__dividers}>
                    <span className={styles.paragraphAlreadyKnew__divider} />
                    <span className={styles.paragraphAlreadyKnew__divider} />
                    <span className={styles.paragraphAlreadyKnew__divider} />
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default AlreadyKnewParagraph;
