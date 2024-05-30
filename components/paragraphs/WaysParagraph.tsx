import { FULL_NODE_TITLES } from "@nature-digital/constants";
import styles from "@nature-digital/web-styles/components/paragraphs.module.scss";
import CardRouteParagraph from "./CardRouteParagraph";

const WaysPragraph = ({ routes }) => {
  return (
    <div className={`${styles.paragraphWays} paragraph`}>
      <h3 className={`${styles.paragraphWays__title} titleCenter`}>{FULL_NODE_TITLES.ROUTES}</h3>
      <div className={`${styles.paragraphWays__wrapper} waysWrap`}>
        {routes &&
          routes.map(route => {
            return (
              route && (
                <CardRouteParagraph roundedImages={false} key={`WAYS_PARAGRAPH_CARD_ITEM_${route?.url}`} data={route} />
              )
            );
          })}
      </div>
    </div>
  );
};
export default WaysPragraph;
