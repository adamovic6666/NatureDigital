import { REQUEST_SECRET } from "@nature-digital/constants";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect } from "react";

const RenderHTML = ({ text, noLink }: { text: string; noLink?: boolean }) => {
  const { push } = useRouter();
  let renderedText = text;
  if (typeof text === "string" && noLink) {
    renderedText = text.replace(/<a(?![^>]*\bhref\b)[^>]*>(.*?)<\/a>/g, "$1");
  }
  const extractPathFromURL = url => {
    const { pathname } = new URL(url);
    return pathname;
  };

  useEffect(() => {
    const handleClick = async e => {
      e.preventDefault();
      if (e?.target?.href?.includes("/node")) {
        const extractedPath = extractPathFromURL(e.target?.href);
        const { data } = await axios.get(`${`${process.env.NEXT_PUBLIC_API_URL}/entity?url=${extractedPath}`}`, {
          headers: {
            secretkey: REQUEST_SECRET,
          },
        });
        push(`/${data.type}${data?.url}`);
      }
    };
    window.addEventListener("click", handleClick);
    // clean up
    return () => window.removeEventListener("click", handleClick);
    // eslint-disable-next-line
  }, []);

  return (
    <div
      dangerouslySetInnerHTML={{
        __html: renderedText,
      }}
    />
  );
};

export default RenderHTML;
