import { MONTHS } from "@nature-digital/constants";
import { AnnualCalendarType, AnnualCalendarValueType } from "@nature-digital/types";
import styles from "@nature-digital/web-styles/components/paragraphs.module.scss";

const getCombinedValues = (val: Array<AnnualCalendarValueType>) => {
  const result: number[] = [];

  for (let i = 0; i < val.length; i++) {
    const { start, end } = val[i];

    if (start > end) {
      for (let j = start; j <= 23; j++) {
        result.push(j);
      }
      for (let j = 0; j <= end; j++) {
        result.push(j);
      }
    } else {
      for (let j = start; j <= end; j++) {
        result.push(j);
      }
    }
  }

  return result;
};

const Month = (props: { index: number; month: string; values: number[] }) => {
  const { index, month, values } = props;
  let firstCellPart = false;
  let secondCellPart = false;
  const monthIndex = index * 2;

  if (values.includes(monthIndex)) {
    firstCellPart = true;
  }
  if (values.includes(monthIndex + 1)) {
    secondCellPart = true;
  }
  return (
    <div className={styles.paragraphStage__month} key={`STAGE_PARAGRAPH_ITEM_${index}`}>
      <div className={styles.paragraphStage__month__cell}>
        <span
          key={`${index}-first`}
          className={
            firstCellPart
              ? `${styles.paragraphStage__month__cell__firstHalf} ${styles.paragraphStage__month__cell__firstHalf__full}`
              : `${styles.paragraphStage__month__cell__firstHalf}`
          }
        />
        <span
          key={`${index}-second`}
          className={
            secondCellPart
              ? `${styles.paragraphStage__month__cell__secondHalf} ${styles.paragraphStage__month__cell__secondHalf__full}`
              : `${styles.paragraphStage__month__cell__secondHalf}`
          }
        />
      </div>
      <span className={styles.paragraphStage__monthName}>{month.charAt(0)}</span>
    </div>
  );
};

const StageParagraph = ({ values, label }: AnnualCalendarType) => {
  const combinedValues = getCombinedValues(values);

  return (
    <div className={styles.paragraphStage}>
      <p className={styles.paragraphStage__title}>{label}</p>
      <div className={styles.paragraphStage__wrapper}>
        {MONTHS.map((month, idx) => {
          return (
            <Month key={`STAGE_PARAGRAPH_MONTH_ITEM_${month}`} index={idx} month={month} values={combinedValues} />
          );
        })}
      </div>
    </div>
  );
};

export default StageParagraph;
