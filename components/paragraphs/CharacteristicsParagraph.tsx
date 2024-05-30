import { FULL_NODE_TITLES } from "@nature-digital/constants";
import { RangeValueType } from "@nature-digital/types";
import styles from "@nature-digital/web-styles/components/paragraphs.module.scss";

const Column = ({ cells, values }: RangeValueType) => {
  const items: boolean[] = [];
  for (let i = 0; i < cells; i++) {
    if (values.includes(i)) {
      items.push(true);
    } else {
      items.push(false);
    }
  }

  const valuesToString = values.join("");

  return (
    <>
      {items.map((item, idx) => {
        if (item) {
          return (
            <div
              key={`CHARACTERISTICS_PARAGRAPHS_COLUMN_ACTIVE_ITEM_${item}_${JSON.stringify(item) + idx}`}
              className={`${styles.paragraphCharacteristics__square} ${styles.paragraphCharacteristics__square_active}`}
            />
          );
        }
        return (
          <div
            key={`CHARACTERISTICS_PARAGRAPHS_COLUMN_ITEM_${valuesToString}_${valuesToString + idx}`}
            className={`${styles.paragraphCharacteristics__square}`}
          />
        );
      })}
    </>
  );
};

const CharacteristicsParagraph = (props: { calendars: Array<RangeValueType> }) => {
  const { calendars } = props;
  return (
    <div className="container-small">
      <div className={styles.paragraphCharacteristics}>
        <h3 className={styles.paragraphCharacteristics__title}>{FULL_NODE_TITLES.RANGE_VALUES}</h3>
        <div className={styles.paragraphCharacteristics__wrapper}>
          {calendars.length &&
            calendars.map(({ startLabel, endLabel, cells, values }, idx) => {
              return (
                <div
                  className={styles.paragraphCharacteristics__characteristic}
                  key={`CHARACTERISTICS_PARAGRAPH_${startLabel}_${endLabel}_${cells}_${cells + idx}`}
                >
                  <span className={styles.paragraphCharacteristics__start__value}>{startLabel}</span>
                  {cells && values?.length && (
                    <div className={styles.paragraphCharacteristics__range}>
                      <Column cells={cells} values={values} />
                    </div>
                  )}
                  <span className={styles.paragraphCharacteristics__end__value}>{endLabel}</span>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default CharacteristicsParagraph;
