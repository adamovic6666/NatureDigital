import { FULL_NODE_TITLES } from "@nature-digital/constants";
import { OpeningHoursItemProps } from "@nature-digital/types";
import icons from "@nature-digital/web-styles";
import styles from "@nature-digital/web-styles/components/paragraphs.module.scss";
import Image from "next/image";
import RenderHTML from "../../utils/renderHtml";

const HoursParagraph = ({ items, additionalText }: OpeningHoursItemProps) => {
  return (
    <div className={`container-medium ${styles.paragraphHours} hoursWrap`}>
      <h3 className={styles.paragraphHours__title}>{FULL_NODE_TITLES.OPENING_HOURS}</h3>
      <div className={styles.paragraphHours__wrapper}>
        {items &&
          items.length &&
          items.map(({ day, date, month, time }) => {
            return (
              <div className={styles.paragraphHours__element} key={`HOURS_PARAGRAPH_${day}_${date}_${month}_${time}`}>
                <div className={styles.paragraphHours__date}>
                  <Image src={icons.iconCalendar} alt="calendar" />
                  {day || date || month}
                </div>
                <div className={styles.paragraphHours__time}>
                  <Image src={icons.iconClock} alt="clock" />
                  {time}
                </div>
              </div>
            );
          })}
        <div className={styles.paragraphHours__text}>
          <RenderHTML text={additionalText ?? ""} />
        </div>
      </div>
    </div>
  );
};

export default HoursParagraph;
