/* eslint-disable jsx-a11y/label-has-associated-control */
import { MapViewState, TRANSITION_EVENTS } from "@deck.gl/core/typed";
import { MAP_IDS, MAP_SCREEN_LABELS, MAP_TYPES, SWR_KEYS, TEXTS } from "@nature-digital/constants";
import { SWRTypes } from "@nature-digital/types";
import icons from "@nature-digital/web-styles";
import styles from "@nature-digital/web-styles/components/map.module.scss";
import Image from "next/image";
import useSWR, { mutate } from "swr";
import { transitionInterpolator } from ".";
import { mapRef } from "../../utils/fetchers/mapFetcher";
import Backdrop from "../backdrop/Backdrop";
import Portal from "../portal/Portal";
import { goToMe, goToMeRef } from "./CurrentPosition";

const defaultRoutes = {
  biking: false,
  hiking: false,
};

export const MapModal = () => {
  const { data: isOpen, mutate: setIsOpen } = useSWR<SWRTypes["MAP_MODAL_STATE"]>(SWR_KEYS.MAP_MODAL_STATE);
  const { data, mutate: mutateID } = useSWR<SWRTypes["MAP_TYPE"]>(SWR_KEYS.MAP_TYPE);

  const handleChange = () => ({});

  return (
    <>
      {isOpen && (
        <Portal>
          <Backdrop type="over-footer-and-header" onClose={() => setIsOpen(!isOpen)} />
        </Portal>
      )}
      <div
        style={{
          display: isOpen ? "flex" : "none",
        }}
        className={styles.map__modal}
      >
        <h2 className={`${styles.map__modal__section__title} ${styles["map__modal__section__title--map-type"]}`}>
          {MAP_SCREEN_LABELS.TITLE}
        </h2>
        <div
          onChangeCapture={e => {
            // @ts-ignore
            if (e.target.value === MAP_TYPES.CITY_LABELS && data === MAP_TYPES.CITY_LABELS) {
              mutateID(MAP_TYPES.LUFTBILD);
            } else {
              // @ts-ignore
              mutateID(e.target.value);
            }
          }}
          className={styles.map__modal__section}
        >
          <div className="formItem formTypeRadio">
            <input
              type="radio"
              value={MAP_TYPES.WEBKARTE}
              checked={data === MAP_TYPES.WEBKARTE}
              name="map_id"
              id="webMap"
              onChange={handleChange}
            />{" "}
            <label htmlFor="webMap">
              <Image src={icons.webMap} alt="" /> {MAP_IDS.WEBKARTE}
            </label>
          </div>
          <div className="formItem formTypeRadio checkInsideRadio">
            <input
              type="radio"
              value={MAP_TYPES.LUFTBILD}
              checked={data === MAP_TYPES.LUFTBILD || data === MAP_TYPES.CITY_LABELS}
              name="map_id"
              id="luftbild"
              onChange={handleChange}
            />
            <label htmlFor="luftbild">
              <Image src={icons.areaMap} alt="" />
              {MAP_IDS.LUFTBILD}
            </label>
            <div className="formItem formTypeCheckbox">
              <input
                type="checkbox"
                value={MAP_TYPES.CITY_LABELS}
                checked={data === MAP_TYPES.CITY_LABELS}
                name="map_id"
                id="city"
                onChange={handleChange}
              />{" "}
              <label htmlFor="city">Ortsnamen </label>
            </div>
          </div>
          <div className="formItem formTypeRadio">
            <input
              type="radio"
              value={MAP_TYPES.TOPOGRAPHISCHE}
              name="map_id"
              checked={data === MAP_TYPES.TOPOGRAPHISCHE}
              id="topo"
            />{" "}
            <label htmlFor="topo">
              <Image src={icons.topgMap} alt="" />
              {MAP_SCREEN_LABELS.TOPOGRAPHISCHE}
            </label>
          </div>
        </div>

        <div className={styles.map__modal__section}>
          <h2 className={`${styles.map__modal__section__title} ${styles["map__modal__section__title--road-network"]}`}>
            {MAP_SCREEN_LABELS.GENERAL_ROAD_NETWORK}
          </h2>
          <div className="formItem formTypeCheckbox">
            <input
              type="checkbox"
              onChange={e =>
                mutate(SWR_KEYS.ROUTES, (state = defaultRoutes) => ({
                  hiking: e.target.checked,
                  biking: state.biking,
                }))
              }
              id="hikeTrail"
            />

            <label htmlFor="hikeTrail">
              <Image src={icons.hikeMap} alt="" />
              {TEXTS.MapType_hiking_trails}
            </label>
          </div>
          <div className="formItem formTypeCheckbox">
            <input
              type="checkbox"
              onChange={e =>
                mutate(SWR_KEYS.ROUTES, (state = defaultRoutes) => ({
                  biking: e.target.checked,
                  hiking: state.hiking,
                }))
              }
              id="bikeTrail"
            />
            <label htmlFor="bikeTrail">
              <Image src={icons.bikeMap} alt="" />
              {TEXTS.MapType_Biking_trails}
            </label>
          </div>
        </div>
        <button className="button secondaryButton" type="button" onClick={() => setIsOpen(false)}>
          {MAP_SCREEN_LABELS.CLOSE}
        </button>
      </div>
    </>
  );
};

export const LegendModal = () => {
  const { data: isOpen, mutate: setIsOpen } = useSWR<SWRTypes["LEGEND_MODAL_STATE"]>(SWR_KEYS.LEGEND_MODAL_STATE);

  return (
    <>
      {isOpen && (
        <Portal>
          <Backdrop type="over-footer-and-header" onClose={() => setIsOpen(!isOpen)} />
        </Portal>
      )}
      <div
        style={{
          display: isOpen ? "flex" : "none",
        }}
        className={`${styles.map__modal} ${styles.map__modal__legendModal}`}
      >
        <h2>{TEXTS.MapLegend_modal_title}</h2>
        <div className={styles.map__modal__legend}>
          {/* Punkte group */}
          <div className={styles.map__modal__legend__group}>
            <h3 className={`${styles.map__modal__legend__group__title}`}>{TEXTS.LEGENDE.TITLE.PUNKTE}</h3>
            {/* Natur erleben */}
            <div className={`${styles.map__modal__legendType} ${styles.map__modal__legendType__multipleColumns}`}>
              <div className={`${styles.map__modal__legendType__iconWrapper}`}>
                <Image alt={TEXTS.LEGENDE.GEOTOP} src={icons.geotopIcon} width="40" height="40" />
                <Image alt={TEXTS.LEGENDE.NATUR_ERLEBEN} src={icons.infopunktIcon} width="40" height="40" />
              </div>
              <div className={styles.map__modal__legendType__listWrapper}>
                <span>{TEXTS.LEGENDE.NATUR_ERLEBEN_GEOTOP}</span>
              </div>
            </div>

            {/* Umweltbildung */}
            <div className={`${styles.map__modal__legendType} ${styles.map__modal__legendType__multipleColumns}`}>
              <div className={`${styles.map__modal__legendType__iconWrapper}`}>
                <Image alt={TEXTS.LEGENDE.UMWELTBILDUNG} src={icons.museumIcon} width="40" height="40" />
              </div>
              <div className={styles.map__modal__legendType__listWrapper}>
                <span>{TEXTS.LEGENDE.UMWELTBILDUNG}</span>
              </div>
            </div>

            {/* Ausblick */}
            <div className={`${styles.map__modal__legendType} ${styles.map__modal__legendType__multipleColumns}`}>
              <div className={`${styles.map__modal__legendType__iconWrapper}`}>
                <Image alt={TEXTS.LEGENDE.UMWELTBILDUNG} src={icons.lauschpunktIcon} width="40" height="40" />
                <Image alt={TEXTS.LEGENDE.UMWELTBILDUNG} src={icons.beobachtungspunktIcon} width="40" height="40" />
                <Image alt={TEXTS.LEGENDE.UMWELTBILDUNG} src={icons.ausblickIcon} width="40" height="40" />
              </div>
              <div className={styles.map__modal__legendType__listWrapper}>
                <span>{TEXTS.LEGENDE.AUSBLICK_LAUSCHPUNKT_BEOBACHTUNGSPUNKT}</span>
              </div>
            </div>

            {/* Zaitreise */}
            <div className={`${styles.map__modal__legendType} ${styles.map__modal__legendType__multipleColumns}`}>
              <div className={`${styles.map__modal__legendType__iconWrapper}`}>
                <Image alt={TEXTS.LEGENDE.ZEITREISE} src={icons.zeitreiseIcon} width="40" height="40" />
              </div>
              <div className={styles.map__modal__legendType__listWrapper}>
                <span>{TEXTS.LEGENDE.ZEITREISE}</span>
              </div>
            </div>

            {/* Offentlicher & Parkplatze */}
            <div className={`${styles.map__modal__legendType} ${styles.map__modal__legendType__multipleColumns}`}>
              <div className={`${styles.map__modal__legendType__iconWrapper}`}>
                <Image alt={TEXTS.LEGENDE.OFFENTLICHER} src={icons.offentlicherIcon} width="40" height="40" />
                <Image alt={TEXTS.LEGENDE.PARKMOGLICHKEIT} src={icons.parkmoglichkeitIcon} width="40" height="40" />
              </div>
              <div className={styles.map__modal__legendType__listWrapper}>
                <span>{TEXTS.LEGENDE.OFFENTLICHER_PARKPLATZE}</span>
              </div>
            </div>
          </div>

          {/* Wege group */}
          <div className={styles.map__modal__legend__group}>
            <h3
              className={`${styles.map__modal__legend__group__title} ${styles["map__modal__legend__group__title--marginTop"]}`}
            >
              {TEXTS.LEGENDE.TITLE.WEGE}
            </h3>
            {/* Route */}
            <div className={`${styles.map__modal__legendType} ${styles.map__modal__legendType__multipleColumns}`}>
              <div className={`${styles.map__modal__legendType__iconWrapper}`}>
                <Image alt={TEXTS.LEGENDE.ROUTE} src={icons.routenvorschlageIcon} width="110" />
              </div>
              <div className={styles.map__modal__legendType__listWrapper}>
                <span>{TEXTS.LEGENDE.ROUTE}</span>
              </div>
            </div>
          </div>

          {/* Gebiete group */}
          <div className={styles.map__modal__legend__group}>
            <h3
              className={`${styles.map__modal__legend__group__title} ${styles["map__modal__legend__group__title--marginTop"]}`}
            >
              {TEXTS.LEGENDE.TITLE.GEBIETE}
            </h3>
            {/* Keine besonderen */}
            <div className={`${styles.map__modal__legendType} ${styles.map__modal__legendType__multipleColumns}`}>
              <div className={`${styles.map__modal__legendType__iconWrapper}`}>
                <Image alt={TEXTS.LEGENDE.GEBIETE.KEINE_BESONDEREN} src={icons.besonderenIcon} width="110" />
              </div>
              <div className={styles.map__modal__legendType__listWrapper}>
                <span>{TEXTS.LEGENDE.GEBIETE.KEINE_BESONDEREN}</span>
              </div>
            </div>

            {/* Bitte beachte */}
            <div className={`${styles.map__modal__legendType} ${styles.map__modal__legendType__multipleColumns}`}>
              <div className={`${styles.map__modal__legendType__iconWrapper}`}>
                <Image alt={TEXTS.LEGENDE.GEBIETE.BITTE_BEACHTE} src={icons.beachteIcon} width="110" />
              </div>
              <div className={styles.map__modal__legendType__listWrapper}>
                <span>{TEXTS.LEGENDE.GEBIETE.BITTE_BEACHTE}</span>
              </div>
            </div>

            {/* Beachte Geltende */}
            <div className={`${styles.map__modal__legendType} ${styles.map__modal__legendType__multipleColumns}`}>
              <div className={`${styles.map__modal__legendType__iconWrapper}`}>
                <Image alt={TEXTS.LEGENDE.GEBIETE.BEACHTE_GELTENDE} src={icons.verUndGeboteIcon} width="110" />
              </div>
              <div className={styles.map__modal__legendType__listWrapper}>
                <span>{TEXTS.LEGENDE.GEBIETE.BEACHTE_GELTENDE}</span>
              </div>
            </div>
          </div>
        </div>

        <button className="button secondaryButton" type="button" onClick={() => setIsOpen(false)}>
          {MAP_SCREEN_LABELS.CLOSE}
        </button>
      </div>
    </>
  );
};

const MapButtons = () => {
  const { data: isOpen, mutate: setIsOpen } = useSWR<SWRTypes["MAP_MODAL_STATE"]>(SWR_KEYS.MAP_MODAL_STATE);
  const { data: isOpenLegend, mutate: setIsOpenLegend } = useSWR<SWRTypes["LEGEND_MODAL_STATE"]>(
    SWR_KEYS.LEGEND_MODAL_STATE,
  );
  const { mutate: mutateMapViewState } = useSWR<MapViewState>(SWR_KEYS.MAP_VIEW_STATE);

  return (
    <div className={`${styles.map__buttons} mapButtons`}>
      <div className={styles.map__buttons__top}>
        <button
          className={
            isOpen
              ? `button modalButton ${styles.map__layersButton} ${styles.map__layersButton__open}`
              : `button modalButton ${styles.map__layersButton}`
          }
          type="button"
          onClickCapture={() => setIsOpen(!isOpen)}
        >
          open modal
        </button>
        <button
          className={
            isOpen
              ? `button modalButton ${styles.map__meButton} ${styles.map__meButton__open}`
              : `button modalButton ${styles.map__meButton}`
          }
          type="button"
          onClick={() => goToMe()}
          style={{ display: "none" }}
          ref={goToMeRef}
        >
          go to me
        </button>
        <button
          className={
            isOpen
              ? `button modalButton ${styles.map__rotateButton} ${styles.map__rotateButton__open}`
              : `button modalButton ${styles.map__rotateButton}`
          }
          type="button"
          onClickCapture={() => {
            // @ts-ignore
            const viewState = mapRef?.current?.deck?.viewState["default-view"] ?? mapRef?.current?.deck?.viewState;

            if (viewState.bearing !== 0 || viewState.pitch !== 0) {
              const commonViewStateProps = {
                transitionInterpolator,
                transitionInterruption: TRANSITION_EVENTS.IGNORE,
                transitionDuration: "auto",
              };

              const updatedState = {
                ...viewState,
                ...commonViewStateProps,
                transitionDuration: 800,
                bearing: 0,
                pitch: 0,
              };

              mapRef?.current?.deck?.setProps?.({
                initialViewState: updatedState,
              });
              mutateMapViewState(updatedState);
            }
          }}
        >
          rotate map
        </button>
      </div>
      <div className={styles.map__buttons__bottom}>
        <button
          className={
            isOpenLegend
              ? `button modalButton ${styles.map__legendButton} ${styles.map__legendButton__open}`
              : `button modalButton ${styles.map__legendButton}`
          }
          type="button"
          onClickCapture={() => setIsOpenLegend(!isOpenLegend)}
        >
          legend
        </button>
      </div>
    </div>
  );
};

export default MapButtons;
