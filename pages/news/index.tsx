import { API_ENDPOINTS, REQUEST_SECRET } from "@nature-digital/constants";
import icons from "@nature-digital/web-styles";
import axios from "axios";
import { NextSeo } from "next-seo";
import Image from "next/image";
import { useState } from "react";
import NewsTeaser from "../../components/news/NewsTeaser";
import ShowMore from "../../components/showMore/ShowMore";

const { iconBell } = icons;

export default function NewsList({ result }) {
  const { data, count } = result;
  // THIS JUST FOR THE TEST
  const numberOfInitiallyVisibleNews = 3;
  const [news, setAllNews] = useState(data.slice(0, numberOfInitiallyVisibleNews));
  const [showAll, setShowAll] = useState(true);

  return (
    <>
      <NextSeo title="Nachrichten" />
      <div className="container-small news">
        <div className="title--with-icon">
          <Image src={iconBell} alt="news-bell" />
          <h1>Nachrichten</h1>
        </div>
        {news.map(item => {
          return <NewsTeaser data={item} key={`NEWS_SCREEN_NEWS_TEASER_ITEM_${item?.url}`} />;
        })}
      </div>
      {showAll && numberOfInitiallyVisibleNews < count && (
        <ShowMore
          moreToGo={count - numberOfInitiallyVisibleNews}
          onClick={() => {
            setShowAll(false);
            setAllNews(data);
          }}
        />
      )}
    </>
  );
}

export async function getStaticProps() {
  let result = false;

  try {
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL + API_ENDPOINTS.NEWSLIST_WEB}`, {
      headers: {
        secretkey: REQUEST_SECRET,
      },
    });

    result = data;
  } catch (error) {
    console.log(error);
  }

  if (!result) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      result,
    },
  };
}
