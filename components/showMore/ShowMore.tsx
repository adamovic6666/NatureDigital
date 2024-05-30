import styles from "@nature-digital/web-styles/components/show-more.module.scss";
import icons from "@nature-digital/web-styles";
import Image from "next/image";

const { showAllButton } = icons;

const ShowMore = ({ onClick, moreToGo }) => {
  return (
    <div className={styles.showMore__wrapper}>
      <div className={styles.showMore__wrapper__button} aria-hidden="true" onClick={onClick}>
        <Image src={showAllButton} alt="show-all" />
        <p>{moreToGo} more</p>
      </div>
    </div>
  );
};

export default ShowMore;
