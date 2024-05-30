import { MediaType } from "@nature-digital/types";
import styles from "@nature-digital/web-styles/components/paragraphs.module.scss";
import Waveform from "../../utils/waveform";

const SoundParagraph = ({ data, type }: { data: Array<MediaType>; type: string }) => {
  return (
    <>
      {data.map(({ title, url, duration }) => {
        if (!duration) return;

        return (
          <div key={`SOUND_PARAGRAPH_ITEM_${url}`} className={styles.paragraphSound}>
            <div className={`${styles.paragraphSound__wrapper} container-small `}>
              <div className={styles.paragraphSound__sound}>
                <Waveform url={url as string} duration={duration} type={type} />
              </div>
              <p className={styles.paragraphSound__title}>{title}</p>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default SoundParagraph;
