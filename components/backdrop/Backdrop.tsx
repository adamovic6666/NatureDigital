import styles from "@nature-digital/web-styles/components/backdrop.module.scss";
import { BackdropProps } from "@nature-digital/types";

const Backdrop = ({ type, children, onClose }: BackdropProps) => {
  const BACKDROP_TYPE = {
    ON_FILTER_ACTIVE: "filter-backdrop",
    ON_FILTER_MOBILE_ONLY: "filter-backdrop-mobile",
    ON_WHOLE_SCREEN: "over-footer-and-header",
    ON_SUGGESTION_OPEN: "over-footer",
    ON_MENU_OPEN: "over-header",
    DEFAULT_OPEN: "default",
  };

  const desktopHidden = type === BACKDROP_TYPE.ON_FILTER_ACTIVE && styles.backdrop__desktop__hidden;
  const desktopHiddenBellowHeader = type === BACKDROP_TYPE.ON_FILTER_MOBILE_ONLY && styles.backdrop__under__header;
  const backdropOverFooterAndHeader = type === BACKDROP_TYPE.ON_WHOLE_SCREEN && styles.backdrop__over__footerAndHeader;
  const backdropOverFooter = type === BACKDROP_TYPE.ON_SUGGESTION_OPEN && styles.backdrop__over__footer;
  const backdropOverHeader = type === BACKDROP_TYPE.ON_MENU_OPEN && styles.backdrop__over__header;
  const defaultBackdrop = type === BACKDROP_TYPE.ON_SUGGESTION_OPEN && styles.backdrop__default;

  return (
    <div
      onClickCapture={onClose}
      id="backdrop"
      className={`${styles.backdrop} ${desktopHidden} ${desktopHiddenBellowHeader} ${backdropOverFooterAndHeader} ${backdropOverFooter} ${backdropOverHeader} ${defaultBackdrop}`}
    >
      {children}
    </div>
  );
};

export default Backdrop;
