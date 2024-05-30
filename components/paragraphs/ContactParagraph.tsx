import styles from "@nature-digital/web-styles/components/paragraphs.module.scss";

const ContactParagraph = ({ headline, contactDetails }) => {
  const { address, phone, email, location } = contactDetails;

  return (
    <div className={styles.paragraphContact}>
      <h3 className={styles.paragraphContact__title}>{headline}</h3>
      <div className={styles.paragraphContact__wrapper}>
        <div className={styles.paragraphContact__text}>
          <span className={styles.paragraphContact__label}>Adresse</span>
          <p>{address}</p>
        </div>
        <div className={styles.paragraphContact__text}>
          <span className={styles.paragraphContact__label}>Telefon</span>
          <p>{phone}</p>
        </div>
        <div className={styles.paragraphContact__text}>
          <span className={styles.paragraphContact__label}>E-Mail</span>
          <p>{email}</p>
        </div>
        <div className={styles.paragraphContact__text}>
          <span className={styles.paragraphContact__label}>Lage & Anfahrt</span>
          <p>{location}</p>
        </div>
      </div>
    </div>
  );
};

export default ContactParagraph;
