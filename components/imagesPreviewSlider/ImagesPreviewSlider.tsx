import styles from "@nature-digital/web-styles/components/ImagesPreviewSlider.module.scss";
import { ArticleImageDetails } from "@nature-digital/types";
import FsLightbox from "./lightbox-plugin";

const ImagesPreviewSlider = ({
  imageDetails,
  sources,
  toggler,
  activeSlide,
}: {
  imageDetails?: ArticleImageDetails;
  sources: string[];
  toggler: boolean;
  activeSlide: number;
}) => {
  const captionElements = imageDetails?.authors?.map((author: string, index: number) => (
    <div className="lightbox" key={`author-${author}`}>
      <span className="lightbox__title">{author}</span>
      <span className="lightbox__alt-text">{imageDetails.altTexts[index]}</span>
    </div>
  ));

  const altAttributes = imageDetails?.altTexts?.map((altText: string) => ({
    alt: altText,
  }));

  return (
    <div className={styles.imagesPreviewSlider}>
      {/* @ts-ignore */}
      <FsLightbox
        toggler={toggler}
        captions={captionElements}
        customAttributes={altAttributes}
        sources={sources}
        slide={activeSlide}
        type="image"
        zoom
      />
    </div>
  );
};

export default ImagesPreviewSlider;
