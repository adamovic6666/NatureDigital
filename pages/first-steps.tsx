import icons from "@nature-digital/web-styles";
import styles from "@nature-digital/web-styles/components/first-steps.module.scss";
import { NextSeo } from "next-seo";
import Image from "next/image";
import ONBOARDING_DATA from "@nature-digital/onboarding";

import { FirstStepsItem } from "@nature-digital/types";

// First steps item component
function FirstStepsItem({ item }: { item: FirstStepsItem }) {
  return (
    <div className={`${styles.firstSteps__step}`} key={`FIRST_STEPS_ITEM_${item?.id}`}>
      <div className={`${styles.firstSteps__image}`}>
        <Image src={item?.image} alt="step one" />
      </div>
      <div className={`${styles.firstSteps__text} `}>
        <h3>{item?.title}</h3>
        <div className={`${styles.firstSteps__description} `}>{item?.description}</div>
      </div>
    </div>
  );
}

// First steps list component
export default function FirstStepsList() {
  const filteredData = ONBOARDING_DATA?.slice(6);

  return (
    <>
      <NextSeo title="Erste Schritte" description="Page description" />
      <div className={`container-small ${styles.firstSteps} `}>
        <div className="title--with-icon">
          <Image src={icons.hikeMap} alt="news-bell" />
          <h1>Erste Schritte</h1>
        </div>
        <div className={`${styles.firstSteps__wrapper} `}>
          {filteredData.map((item: FirstStepsItem) => (
            <FirstStepsItem key={item.id} item={item} />
          ))}
        </div>
      </div>
    </>
  );
}
