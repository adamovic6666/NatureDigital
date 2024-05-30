import { SWR_KEYS } from "@nature-digital/constants";
import { ArticleImageDetails, ArticleSlide, SWRTypes } from "@nature-digital/types";
import styles from "@nature-digital/web-styles/components/article-slider.module.scss";
import Image from "next/image";
import { useRouter } from "next/router";
import { createRef, useEffect, useState } from "react";
import Slider from "react-slick";
import useSWR from "swr";
import ImagesPreviewSlider from "../imagesPreviewSlider/ImagesPreviewSlider";
import Portal from "../portal/Portal";

// aditional classes for alignment of title or text (textRight, textLeft, textCenter)
// aditional class for background color (hasBackground)
// additional class for container (container-small, container-medium, container)

const ArticleSlider = ({ heroSlidesAreRounded, slides }) => {
  const [previewSlider, setPreviewSlider] = useState(false);
  const [userCanOpenLightbox, setUserCanOpenLightbox] = useState(true);
  const [activeSlide, setActiveSlide] = useState(0);
  const swiperWrapperRef = createRef<any>();

  const [isLoading, setIsLoading] = useState(true);
  const { data: isLoadingOnSearchPage } = useSWR<SWRTypes["ARTICLE_SLIDER_STATE"]>(SWR_KEYS.ARTICLE_SLIDER_STATE);
  const { pathname } = useRouter();
  const isSearchPage = pathname === "/search";

  useEffect(() => {
    setIsLoading(true);
    const id = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(id);
  }, []);

  function generateImageUrl(fileId: string): string {
    return `${process.env.NEXT_PUBLIC_DRUPAL_URL}/getImage/original/${fileId}?responseType=file`;
  }

  function generateSourcesAndImageDetails(sliders: ArticleSlide[]): {
    sources: string[];
    imageDetails: ArticleImageDetails;
  } {
    const sources = sliders.map((slide: ArticleSlide) => generateImageUrl(slide?.fileId));
    const imageDetails = {
      authors: sliders.map((slide: ArticleSlide) => (slide?.author ? slide.author : "Unknown")),
      altTexts: sliders.map((slide: ArticleSlide) => (slide?.alt ? slide.alt : "No description available")),
    };

    return { sources, imageDetails };
  }

  let sliders: ArticleSlide[] = [];

  if (slides?.length === 1 || slides?.length > 3) {
    sliders = slides;
  } else if (slides?.length === 2) {
    sliders = [...slides, ...slides];
  } else if (slides?.length === 3) {
    sliders = [...slides, ...Array.from(slides).slice(0, 1)];
  }

  const { sources, imageDetails } = generateSourcesAndImageDetails(sliders);

  const settings = {
    className: "center",
    centerMode: true,
    dotsClass: "slick-dots slick-thumb",
    dots: !heroSlidesAreRounded,
    centerPadding: "60px",
    slidesToShow: sliders.length === 1 ? 1 : 3,
    speed: 600,
    variableWidth: true,
    swipeToSlide: true,

    beforeChange() {
      setUserCanOpenLightbox(false);
      setTimeout(() => {
        setUserCanOpenLightbox(true);
      }, 300);
    },
  };

  const isHidden = (!isSearchPage && isLoading) || (isSearchPage && isLoading && isLoadingOnSearchPage?.isLoading);
  const roundedStyle = heroSlidesAreRounded ? styles.articleSlider__slider__roundedSlides : "";
  const searchPageStyle = isSearchPage ? styles.articleSlider__slider__search : "";
  const autoWidthStyle = !heroSlidesAreRounded ? styles.articleSlider__slider__autoWidth : "";
  const visibilityStyle = isHidden ? styles.articleSlider__hidden : styles.articleSlider__visible;

  return (
    <>
      <div
        className={`${roundedStyle} ${searchPageStyle} ${autoWidthStyle} ${styles.articleSlider} ${
          sliders.length === 1 && styles.articleSlider__slider__center
        }`}
      >
        {isHidden && <span className={styles.articleSlider__loader} />}
        <div className={visibilityStyle}>
          <div ref={swiperWrapperRef} className="article-slider-wrapper">
            <Slider {...settings}>
              {sliders.map((slide, i) => {
                return (
                  <Image
                    key={`${slide.drupalId}_${slide.drupalId + i}`}
                    src={`${process.env.NEXT_PUBLIC_DRUPAL_URL}/getImage/${
                      heroSlidesAreRounded ? "web_medium_1_1" : "web_medium_carousel"
                    }/${slide.fileId}?responseType=file`}
                    alt={slide.alt || "slider-image"}
                    width={slide.width ?? 300}
                    height={slide.height ?? 300}
                    onClickCapture={() => {
                      if (!userCanOpenLightbox) return;
                      setPreviewSlider(!previewSlider);
                      setActiveSlide(++i);
                    }}
                  />
                );
              })}
            </Slider>
          </div>
        </div>
      </div>
      <Portal>
        <ImagesPreviewSlider
          sources={sources}
          imageDetails={imageDetails}
          toggler={previewSlider}
          activeSlide={activeSlide}
        />
      </Portal>
    </>
  );
};
export default ArticleSlider;
