const formatTime = seconds => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.round(seconds % 60);

  const sec = s > 9 ? s : `0${s}`;
  const helper = h ? `0${m}` : m || "0";
  const min = m > 9 ? m : helper;

  return [h, min, sec].filter(Boolean).join(":");
};

export default formatTime;
