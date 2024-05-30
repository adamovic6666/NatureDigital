import styles from "@nature-digital/web-styles/components/instructions.module.scss";
import icons from "@nature-digital/web-styles";
import Image from "next/image";

// use aditional class simple__circle to form a card variation with circle image and title
// use aditional class circle to form a card variation with circle image, title, text
const Instructions = () => {
  return (
    <div className={`${styles.instructions}`}>
      <div className={`${styles.instructions__card}`}>
        <Image src={icons.insApp} alt="instructions app" />

        <div className={styles.instructions__wrapper}>
          <div className={styles.instructions__text}>Laden Sie unsere Anwendung herunter</div>
        </div>
      </div>
      <div className={`${styles.instructions__card}`}>
        <Image src={icons.insTasks} alt="instructions tasks" />

        <div className={styles.instructions__wrapper}>
          <div className={styles.instructions__text}>Wie man sich in der Natur verhält</div>
        </div>
      </div>
      <div className={`${styles.instructions__card}`}>
        <Image src={icons.insCalendar} alt="instructions calendar" />

        <div className={styles.instructions__wrapper}>
          <div className={styles.instructions__text}>Verbote in der Natur</div>
        </div>
      </div>
    </div>
  );
};

export default Instructions;
