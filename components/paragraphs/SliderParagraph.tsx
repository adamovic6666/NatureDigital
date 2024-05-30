import { TYPES, WEB_PAGES } from "@nature-digital/constants";
import SpecieSpecieRelationships from "@nature-digital/storage/src/schema/SpecieSpecieRelationships";
import { AdditionalInformationAboutSpecieType, EntityTypeWeb, ItemTypes } from "@nature-digital/types";
import styles from "@nature-digital/web-styles/components/paragraphs.module.scss";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { A11y, Navigation, Pagination, Scrollbar } from "swiper";
import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";
import CardParagraph from "./CardParagraph";

// aditional classes for alignment of title or text (textRight, textLeft, textCenter)
// aditional class for background color (hasBackground)
// additional class for container (container-small, container-medium, container)

type SlideContentData = {
  slideType: string;
  roundedImages: boolean;
  title: string;
  images: any;
  alt: string;
  fileId?: string;
};

type SliderData = {
  heroSlidesAreRounded?: boolean;
  headline?: string;
  // slides: SlideContentData[];
  slides: EntityTypeWeb[] | SpecieSpecieRelationships[] | AdditionalInformationAboutSpecieType[];
  type: ItemTypes | "slider_carousel" | "slider";
  entityType: ItemTypes;
};

const SlideContent = ({ slideType, roundedImages, title, images, fileId, alt }: SlideContentData) => {
  // HELPER CONSTANTS FOR STYLING

  const SLIDER_CAROUSEL = slideType === "slider_carousel";
  const roundedStyle = roundedImages && styles.paragraphSlider__roundedSlideImage;
  const textCenterStyleForRoundedImages = roundedImages && styles.paragraphSlider__sectionSlideTextCenter;
  const heroSectionStyle = !SLIDER_CAROUSEL && styles.paragraphSlider__heroSectionSlideImage;

  return (
    <div className={styles.paragraphSlider__slide}>
      <div className={`${styles.paragraphSlider__slideImage} ${heroSectionStyle} ${roundedStyle} `}>
        <Image
          src={`${process.env.NEXT_PUBLIC_DRUPAL_URL}/getImage/web_medium_1_1/${
            !images ? fileId : images[0]?.fileId
          }?responseType=file`}
          alt={alt || "slider-image"}
          width={300}
          height={300}
          className={styles.paragraphSlider__image}
        />
      </div>
      {slideType === "slider_carousel" && (
        <p className={`${styles.paragraphSlider__sectionSlideText} ${textCenterStyleForRoundedImages} titleCenter`}>
          {title}
        </p>
      )}
    </div>
  );
};

const SliderParagraph = ({ type, slides, headline, entityType }: SliderData) => {
  const { pathname } = useRouter();
  const swiperRef = useRef(null);
  const isSearchPage = pathname === WEB_PAGES.MAP;

  // CUSTOM NAVIGATION AND PAGINATION ELEMENTS INITIALIZED
  // const navigationPrevRef = useRef(null);
  // const navigationNextRef = useRef(null);
  const paginationRef = useRef(null);
  const [navigationPrevRef, setPrevEl] = useState<HTMLElement | null>(null);
  const [navigationNextRef, setNextEl] = useState<HTMLElement | null>(null);

  // SLIDER TYPES
  const SLIDER = type === "slider";
  const SLIDER_CAROUSEL = type === "slider_carousel";

  // SLIDER SECTION BACKGROUND
  const sliderHasBackground = SLIDER_CAROUSEL && (headline === "Sehenswürdigkeiten" || headline === "Gebiete");

  // SLIDES PER VIEW
  let slidesPerView: any;

  // Add eventlisteners for swiper after initializing

  switch (type) {
    case "slider_carousel":
      slidesPerView = {
        mobile: "auto",
        tablet: 3,
        laptop: isSearchPage ? "auto" : 4,
        desktop: isSearchPage ? "auto" : 4,
      };
      break;
    case "slider":
      slidesPerView = 1;
      break;
    default:
      slidesPerView = 1;
  }

  // ARROWS VISIBILITY
  let arrowsAreVisible: any;
  let paginationIsVisible: any;

  if (SLIDER) {
    arrowsAreVisible = slides.length > 1;
    paginationIsVisible = slides.length > 1;
  } else if (SLIDER_CAROUSEL) {
    arrowsAreVisible = slides.length > slidesPerView.desktop;
    paginationIsVisible = slides.length > 2;
  } else {
    arrowsAreVisible = true;
  }

  // SETTING SLIDES ACCORDING TO THE TYPE

  const setSlide = slideData => {
    const {
      fileId,
      alt,
      title,
      images,
      specie,
      habitat,
      url,
      type: pageType,
      relationship,
      additionalInformation,
    } = slideData;
    const slideContentData = { fileId, alt, title, images };
    const roundedImages = (pageType && pageType === TYPES.specie) || specie || habitat;

    if (SLIDER) {
      return (
        <CardParagraph
          data={specie || habitat}
          tag={relationship}
          roundedImages={roundedImages}
          additionalInformation={additionalInformation}
        />
      );
    }

    if (SLIDER_CAROUSEL) {
      return (
        <Link className={styles.paragraphSlider__link} href={`/${pageType}${url}`}>
          <SlideContent slideType={type} roundedImages={roundedImages} {...slideContentData} />
        </Link>
      );
    }

    return <SlideContent slideType={type} roundedImages={roundedImages} {...slideContentData} />;
  };

  // ============ HELPER CONSTANTS FOR STYLING ========================

  const sliderCarouselWrapperStyle = SLIDER_CAROUSEL && styles.paragraphSlider__wrapperMaxWidth;
  const sliderAreCentered =
    SLIDER_CAROUSEL && slides.length < slidesPerView.tablet && styles.paragraphSlider__centeredOnDesktop;
  const sliderArrowPrevTransformedPostion = SLIDER && styles.paragraphSlider__arrowTopPositionTransformedPrev;
  const sliderArrowNextTransformedPostion = SLIDER && styles.paragraphSlider__arrowTopPositionTransformedNext;
  const paginationStyle = !sliderHasBackground && styles.paragraphSlider__paginationBgWhite;
  const extendedPaginationStyle = slides.length > 15 && styles.paragraphSlider__paginationExtendedWidth;
  const titleAlignLeftMobile =
    (headline === "Art-Art Beziehungen" || headline === "Verwechslung") && styles.paragraphSlider__titleAlignLeftMobile;
  const sliderEntityTypeClass = `sliderEntity__${entityType}__${headline}`;
  const sliderMaxWidth = SLIDER && styles.paragraphSlider__sliderWrapperMaxWidth;
  const sliderPagination = paginationIsVisible;
  const sliderPaginationOnBigScreeens = isSearchPage && styles.paragraphSlider__paginationOnSearchPage;
  const isArten = headline === "Arten";
  const arrowsOnPage = (arrowsAreVisible && !isSearchPage) || (isSearchPage && isArten && arrowsAreVisible);
  const sliderArtenStyle = isArten && isSearchPage && styles.paragraphSlider__artenSliderStyle;

  return (
    <div
      className={`${styles.paragraphSlider} ${sliderArtenStyle} ${
        sliderHasBackground && "hasBackground "
      } paragraphSlider`}
    >
      <div
        className={`${styles.paragraphSlider__wrapper}  ${sliderAreCentered} ${sliderMaxWidth} ${sliderEntityTypeClass} ${extendedPaginationStyle}  ${sliderCarouselWrapperStyle}`}
      >
        <h3 className={`${styles.paragraphSlider__title} ${titleAlignLeftMobile}`}>{headline || ""}</h3>
        <Swiper
          ref={swiperRef}
          speed={500}
          slidesPerView="auto"
          observer
          observeParents
          breakpoints={{
            320: {
              slidesPerView: SLIDER_CAROUSEL ? slidesPerView.mobile : slidesPerView,
              spaceBetween: slides.length > 1 ? 24 : 0,
            },
            768: {
              slidesPerView: SLIDER_CAROUSEL ? slidesPerView.tablet : slidesPerView,
              spaceBetween: slides.length > 1 ? 20 : 0,
            },

            992: {
              slidesPerView: SLIDER_CAROUSEL ? slidesPerView.laptop : slidesPerView,
              spaceBetween: slides.length > 1 ? 20 : 0,
            },
            1440: {
              slidesPerView: SLIDER_CAROUSEL ? slidesPerView.desktop : slidesPerView,
              spaceBetween: slides.length > 1 ? 20 : 0,
            },
          }}
          pagination={{
            el: paginationRef.current,
            clickable: true,
            renderBullet: (_, className) => `<span class='${className}'></span>`,
          }}
          navigation={{
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            prevEl: navigationPrevRef,
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            nextEl: navigationNextRef,
            disabledClass: `${styles.paragraphSlider__arrowDisabled} disabled`,
          }}
          modules={[Navigation, Pagination, Scrollbar, A11y]}
        >
          {slides.map((data, idx) => {
            if ("specie" in data && !data.specie) return;
            if ("habitat" in data && !data.habitat) return;

            let key;

            if (data.drupalId) {
              key = `SLIDER_PARAGRAPH_SWIPER_SLIDE_${data?.drupalId}_${data?.drupalId + idx}`;
            } else {
              key = `SLIDER_PARAGRAPH_SWIPER_SLIDE_${data?._id}_${data?._id + idx}`;
            }

            return <SwiperSlide key={key}>{setSlide(data)}</SwiperSlide>;
          })}
        </Swiper>
        {arrowsOnPage && (
          <div
            className={`${styles.paragraphSlider__arrow} ${styles.paragraphSlider__arrowPrev}  ${sliderArrowPrevTransformedPostion} arrow-prev`}
            // ref={navigationPrevRef}
            ref={node => setPrevEl(node)}
          />
        )}
        {arrowsOnPage && (
          <div
            className={`${styles.paragraphSlider__arrow} ${styles.paragraphSlider__arrowNext}  ${sliderArrowNextTransformedPostion} arrow-next`}
            // ref={navigationNextRef}
            ref={node => setNextEl(node)}
          />
        )}
        {sliderPagination && (
          <div
            className={`${styles.paragraphSlider__pagination} ${sliderPaginationOnBigScreeens}  ${paginationStyle} pagination`}
            ref={paginationRef}
          />
        )}
      </div>
    </div>
  );
};
export default SliderParagraph;
