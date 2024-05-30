import { FULL_NODE_TITLES } from "@nature-digital/constants";
import { AnnualCalendarType } from "@nature-digital/types";
import styles from "@nature-digital/web-styles/components/paragraphs.module.scss";
import StageParagraph from "./StageParagraph";

// aditional classes for alignment of title or text (textRight, textLeft, textCenter)
// aditional class for background color (hasBackground)
// additional class for container (container-small, container-medium, container)

const CycleParagraph = (props: { calendars: Array<AnnualCalendarType> }) => {
  const { calendars } = props;

  return (
    <div className={`${styles.paragraphCycle}`}>
      <div className={`${styles.paragraphCycle__wrapper} container-medium container-small `} style={{ padding: 0 }}>
        <h3 className={`${styles.paragraphCycle__title} titleCenter`}>{FULL_NODE_TITLES.ANNUAL_CALENDAR}</h3>
        <div className={styles.paragraphCycle__cycle}>
          {calendars.length &&
            calendars.map(({ cells, values, label }) => {
              return (
                <div key={`CYCLE_PARAGRAPH_${label}`}>
                  <StageParagraph cells={cells} values={values} label={label} />
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};
export default CycleParagraph;
