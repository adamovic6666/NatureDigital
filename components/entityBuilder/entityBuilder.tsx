import { TRANSITION_EVENTS } from "@deck.gl/core/typed";
import { FULL_NODE_TITLES, TYPES, URL_KEYS, WEB_PAGES } from "@nature-digital/constants";
import HabitatEndangerment from "@nature-digital/storage/src/schema/HabitatEndangerment";
import { EntityTypeWeb, SpecieRLBType } from "@nature-digital/types";
import icons from "@nature-digital/web-styles";
import styles from "@nature-digital/web-styles/components/article.module.scss";
import { NextSeo } from "next-seo";
import Image from "next/image";
import { useRouter } from "next/router";
import { mapRef } from "../../utils/fetchers/mapFetcher";
import Url from "../../utils/urlHandler";
import ArticleSlider from "../articleSlider/ArticleSlider";
import Tags from "../category/Tags";
import Danger from "../dangerDropdown/dangerDropdown";
import { transitionInterpolator } from "../map";
import AlreadyKnewParagraph from "../paragraphs/AlreadyKnewParagraph";
import CharacteristicsParagraph from "../paragraphs/CharacteristicsParagraph";
import ContactParagraph from "../paragraphs/ContactParagraph";
import CycleParagraph from "../paragraphs/CycleParagraph";
import DocumentsParagraph from "../paragraphs/DocumentsParagraph";
import HoursParagraph from "../paragraphs/HoursParagraph";
import NoticeParagraph from "../paragraphs/NoticeParagraph";
import SliderParagraph from "../paragraphs/SliderParagraph";
import SoundParagraph from "../paragraphs/SoundParagraph";
import TextBackgroundParagraph from "../paragraphs/TextBackgroundParagraph";
import TextParagraph from "../paragraphs/TextParagraph";
import VideoParagraph from "../paragraphs/VideoParagraph";
import WaysPragraph from "../paragraphs/WaysParagraph";

export default function EntityBuilder({ data }: { data: EntityTypeWeb }) {
  const {
    title,
    subtitle,
    nickname,
    body,
    informative,
    didYouKnows,
    audioFiles,
    rangeValues,
    annualCalendars,
    pdfs,
    intro,
    source,
    images,
    legal,
    notes,
    openingHours,
    video,
    tourDuration,
    tourFeatures,
    tourLength,
    specieRLB,
    specieRLD,
    categories,
    type,
    routes,
    POIs,
    habitats,
    additionalInformationAboutSpecie,
    areas,
    contact,
    confusions,
    typicalPlants,
    typicalAnimals,
    specieSpecieRelationships,
    endangermentHabitat,
    metatags,
    // typicalFungiAndLichens
  } = data || {};

  const { pathname, push } = useRouter();
  const isSearchPage = pathname === WEB_PAGES.MAP;

  let danger = [] as HabitatEndangerment[] | SpecieRLBType[];
  if (type === TYPES.habitat && endangermentHabitat) {
    danger = [endangermentHabitat];
  }
  if (type === TYPES.specie && specieRLB && specieRLD) {
    danger = [specieRLB, specieRLD];
  }

  return (
    <>
      <div className={`entityType ${`entityType__${type}`}`}>
        {/* Article slider */}
        {images && <ArticleSlider heroSlidesAreRounded={type === TYPES.specie} slides={images} key={Date.now()} />}
        <NextSeo title={metatags.title} description={metatags.description} />
        <div className={`${styles.article__header} articleHeader`}>
          <div className={`${styles.article__header__content} container-medium articleHeaderContainer`}>
            <div className={`${styles.article__header__left}`}>
              {danger.length > 0 && <Danger data={danger} />}
              {categories && categories.length > 0 && !(type === TYPES.habitat || type === TYPES.specie) && (
                <Tags data={categories} />
              )}
            </div>
            <div className={`${styles.article__header__right}`}>
              {data?.point?.x && data?.point?.y && (
                <Image
                  alt="share"
                  src={icons.mapBtn}
                  className="seeOnMap"
                  title="See on map"
                  onClick={() => {
                    if (!data?.point?.x && !data?.point?.y) return;

                    if (isSearchPage && mapRef) {
                      // @ts-ignore
                      const viewState = mapRef.current?.deck?.viewState["default-view"];

                      mapRef.current?.deck?.setProps?.({
                        initialViewState: {
                          ...viewState,
                          transitionInterpolator,
                          transitionInterruption: TRANSITION_EVENTS.BREAK,
                          transitionDuration: "auto",
                          longitude: data.point.x,
                          latitude: data.point.y,
                          zoom: 15,
                        },
                      });
                    } else {
                      push(WEB_PAGES.MAP);
                      Url.changeParam([URL_KEYS.LONGITUDE, String(data.point.x)]);
                      Url.changeParam([URL_KEYS.LATITUDE, String(data.point.y)]);
                    }
                  }}
                />
              )}
            </div>
            <div className={`${styles.article__header__middle} articleTitle`}>
              <h1 className={`${styles.article__title} titleCenter`}>{title}</h1>
              <h4 className={`${styles.article__subtitle} titleCenter`}>{subtitle}</h4>
              {(tourDuration || tourFeatures || tourLength) && (
                <h5 className={`${styles.article__distance} titleCenter`}>
                  {tourLength && <span>{tourLength}</span>} {tourDuration && <span>{tourDuration}</span>}{" "}
                  {tourFeatures && <span>{tourFeatures}</span>}
                </h5>
              )}
              {nickname && <h3 className={`${styles.article__speciesDescription} titleCenter`}>“{nickname}”</h3>}
            </div>
          </div>
        </div>
        {/* Audio */}
        {audioFiles && <SoundParagraph type={type || ""} data={audioFiles} />}
        {/* Intro */}
        {intro && (
          <div className="container-small body">
            <TextParagraph text={intro} noLink />
          </div>
        )}
        {/* Notice */}
        {notes && <NoticeParagraph headline={FULL_NODE_TITLES.NOTES} text={notes} />}
        {/* Beschreibung */}
        {body && (
          <div className="container-medium body">
            <TextParagraph headline={FULL_NODE_TITLES.BODY} text={body} noLink />
          </div>
        )}
        {/* Video */}
        {video && (
          <VideoParagraph
            url={video.url}
            usageRights={video?.usageRights}
            poster={video.posterImage}
            headline={FULL_NODE_TITLES.VIDEO}
          />
        )}
        {/* Opening Hours */}
        {openingHours && <HoursParagraph additionalText={openingHours.additionalText} items={openingHours.items} />}
        {/* Kontakt  */}
        {contact && (
          <div className="container-medium body">
            <ContactParagraph headline={FULL_NODE_TITLES.DIRECTION_AND_CONTACT} contactDetails={contact} />
          </div>
        )}
        {/* Before/After */}
        {/* Already know */}
        {didYouKnows && <AlreadyKnewParagraph data={didYouKnows} />}
        {/* Annual Calendar */}
        {annualCalendars && <CycleParagraph calendars={annualCalendars} />}
        {/* Informatives */}
        {informative && (
          <div className="container-medium body">
            <TextParagraph headline={FULL_NODE_TITLES.INFORMATIVE} text={informative} />
          </div>
        )}
        {/* <SliderParagraph /> */}
        {areas && areas.length > 0 && (
          <SliderParagraph
            type="slider_carousel"
            entityType={TYPES.area}
            slides={areas}
            headline={FULL_NODE_TITLES.AREAS}
          />
        )}
        {/* <WaysPragraph /> */} {/* Referenz zu Wegen  */}
        {routes && routes.length > 0 && <WaysPragraph routes={routes} />}
        {/* Anzahl der Felder */}
        {rangeValues && <CharacteristicsParagraph calendars={rangeValues} />}
        {/* Referenz zu POI */}
        {POIs && POIs.length > 0 && (
          <SliderParagraph
            type="slider_carousel"
            entityType={TYPES.poi}
            slides={POIs}
            headline={FULL_NODE_TITLES.POIS}
          />
        )}
        {/* Referenz zu Arten  */}
        {additionalInformationAboutSpecie && additionalInformationAboutSpecie.length > 0 && (
          <SliderParagraph
            type="slider"
            entityType={TYPES.specie}
            slides={additionalInformationAboutSpecie}
            headline={FULL_NODE_TITLES.SPECIES}
          />
        )}
        {/* Referenz zu Lebensraum */}
        {habitats && habitats.length > 0 && (
          <SliderParagraph
            type="slider_carousel"
            entityType={TYPES.habitat}
            slides={habitats}
            headline={FULL_NODE_TITLES.HABITATS}
          />
        )}
        {/* Referenz zu Teilgebieten */}
        {/* Referenz zu Verwechslung */}
        {(type === TYPES.habitat || type === TYPES.specie) && confusions && confusions.length > 0 && (
          <SliderParagraph type="slider" entityType={type} slides={confusions} headline={FULL_NODE_TITLES.CONFUSIONS} />
        )}
        {/* Referenz zu Art-Art Beziehungen */}
        {type === TYPES.specie && specieSpecieRelationships && specieSpecieRelationships.length > 0 && (
          <SliderParagraph
            type="slider"
            entityType={TYPES.specie}
            slides={specieSpecieRelationships}
            headline={FULL_NODE_TITLES.SPECIE_SPECIE_RELATIONSHIP}
          />
        )}
        {/* Typische Pflanzen */}
        {type === TYPES.habitat && typicalPlants && typicalPlants.length > 0 && (
          <SliderParagraph
            type="slider_carousel"
            entityType={TYPES.habitat}
            slides={typicalPlants}
            headline={FULL_NODE_TITLES.TYPICAL_PLANTS}
          />
        )}
        {/* Typische Tiere */}
        {type === TYPES.habitat && typicalAnimals && typicalAnimals.length > 0 && (
          <SliderParagraph
            type="slider_carousel"
            entityType={TYPES.habitat}
            slides={typicalAnimals}
            headline={FULL_NODE_TITLES.TYPICAL_ANIMALS}
          />
        )}
        {/* Typische Pilze und Flechten */}
        {/* PDF */}
        {pdfs && <DocumentsParagraph data={pdfs} />}
        {/* Quellen & Rechtliches */}
        {(source || legal) && <TextBackgroundParagraph links={source} rechtliches={legal} />}
      </div>
    </>
  );
}
