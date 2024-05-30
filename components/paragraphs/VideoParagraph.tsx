import { useState } from "react";
import styles from "@nature-digital/web-styles/components/paragraphs.module.scss";
import icons from "@nature-digital/web-styles";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/router";

// eslint-disable-next-line import/no-unresolved
const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

type Data = {
  url?: string;
  poster?: any;
  headline?: string;
  usageRights: string | null | undefined;
};

const VideoParagraph = ({ url, poster, headline, usageRights }: Data) => {
  const { pathname } = useRouter();
  const searchPage = pathname === "/search";
  const [isPlaying, setIsPlaying] = useState(false);

  const videoPoster = poster?.url || "https://thumbs.dreamstime.com/b/tiger-portrait-horizontal-11392212.jpg";

  return (
    <div className={`${styles.paragraphVideo} ${searchPage && styles.paragraphVideo__modifiedHeight}`}>
      <h3 className={`${styles.paragraphVideo__title}  titleCenter`}>{headline}</h3>
      <div className={styles.paragraphVideo__wrapper}>
        {!isPlaying && <div className={styles.paragraphVideo__overlay} />}
        {url && (
          <ReactPlayer
            playing
            width="100%"
            height="100%"
            url={process.env.NEXT_PUBLIC_DRUPAL_URL + url}
            playsinline
            controls
            type="video/mp4"
            muted
            light={process.env.NEXT_PUBLIC_DRUPAL_URL + videoPoster}
            playIcon={
              <Image
                src={icons.videoPlayButton}
                alt="play-button-image"
                onClick={() => setIsPlaying(true)}
                className={styles.paragraphVideo__playButton}
              />
            }
          />
        )}
      </div>
      {usageRights && (
        <div className={`${styles.paragraphVideo__usageRights}`} dangerouslySetInnerHTML={{ __html: usageRights }} />
      )}
    </div>
  );
};

export default VideoParagraph;
