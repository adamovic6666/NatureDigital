import { SWR_KEYS } from "@nature-digital/constants";
import { SWRTypes } from "@nature-digital/types";
import styles from "@nature-digital/web-styles/components/map.module.scss";
import { useRouter } from "next/router";
import useSWR from "swr";

const Tooltip = () => {
  const { query } = useRouter();
  const { data } = useSWR<SWRTypes["HOVER"]>(SWR_KEYS.HOVER);
  const { data: activeList = !!query?.url || !!query?.lng || !!query.textSearch || false } = useSWR<
    SWRTypes["ACTIVE_LIST_STATE"]
  >(SWR_KEYS.ACTIVE_LIST_STATE);

  const isMobileDevice = typeof window !== "undefined" && window.innerWidth < 480;

  if (!data || isMobileDevice) {
    return null;
  }

  const left = activeList ? data.x - 305 : data.x + 20;

  return (
    <div
      style={{
        top: data?.y,
        left,
      }}
      className={styles.map__tooltip}
    >
      {data.title}
    </div>
  );
};

export default Tooltip;
