import dynamic from "next/dynamic";
import { useState } from "react";
import styles from "@nature-digital/web-styles/components/paragraphs.module.scss";
import formatTime from "../formatTime";

const Wavesurfer = dynamic(() => import("react-wavesurfer.js"), { ssr: false });
const Waveform = ({ url, duration, type }: { url: string; duration: number; type: string }) => {
  const [play, setPlay] = useState(false);
  const [position, setPosition] = useState(0);

  const typeBrown = ["wege", "poi", "gebiet", "bayfruhheu", "sehenswertes"];

  return (
    <div className={styles.paragraphSound__soundWrap}>
      <button
        className={play ? `${styles.paragraphSound__soundPause}` : `${styles.paragraphSound__soundPlay}`}
        type="button"
        onClick={() => setPlay(!play)}
      >
        {play ? "Pause" : "Play"}
      </button>
      {formatTime(position)}
      <div className={`${styles.paragraphSound__soundTrack} soundWrap`} style={{ width: 250 }}>
        <Wavesurfer
          src={process.env.NEXT_PUBLIC_DRUPAL_URL + url}
          onPositionChange={pos => setPosition(+pos)}
          pos={position}
          playing={play}
          onFinish={() => {
            setPosition(0);
            setPlay(false);
          }}
          barWidth={3}
          barGap={3}
          height={80}
          waveColor="grey"
          progressColor={typeBrown.includes(type) ? "#c5b7b2" : "#cfd88d"}
          cursorColor="transparent"
          responsive
          autoCenter
        />
      </div>
      {formatTime(duration)}
    </div>
  );
};

export default Waveform;
