import styles from "@nature-digital/web-styles/components/press.module.scss";
import icons from "@nature-digital/web-styles";
import Image from "next/image";

const PressRelease = () => {
  return (
    <div className={styles.pressRelease}>
      <div className={styles.pressRelease__date}>
        {" "}
        <Image src={icons.iconCalendar} alt="calendar" />
        <span>01. 11. 2022</span>
      </div>
      <div className={styles.pressRelease__text}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut feugiat lectus id quam dictum, eget pharetra mi
        porttitor. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam at sapien velit. Vivamus vehicula,
        lorem eget suscipit commodo, nunc risus volutpat ligula, sed vulputate velit eros
      </div>
    </div>
  );
};

export default PressRelease;
