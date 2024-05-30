import { API_ENDPOINTS, REQUEST_SECRET } from "@nature-digital/constants";
import icons from "@nature-digital/web-styles";
import axios from "axios";
import { NextSeo } from "next-seo";
import Image from "next/image";
import { useState } from "react";
import NewsTeaser from "../../components/news/NewsTeaser";
import ShowMore from "../../components/showMore/ShowMore";

const { iconBell } = icons;

export default function Blog({ result }) {
  const { data, count } = result;

  const numberOfInitiallyVisibleBlogs = 3;
  const modifiedData = data;

  const [blogs, setAllBlogs] = useState(modifiedData.slice(0, numberOfInitiallyVisibleBlogs));
  const [showAll, setShowAll] = useState(true);

  return (
    <>
      <NextSeo title="Unser Natur-Blog" />
      <div className="container-small blog">
        <div className="title--with-icon">
          <Image src={iconBell} alt="news-bell" />
          <h1>Unser Natur-Blog</h1>
        </div>
        {blogs &&
          blogs.map(item => {
            return <NewsTeaser key={`BLOG_SCREEN_NEWS_TEASER_ITEM_${item?.url}`} data={item} />;
          })}
      </div>
      {showAll && numberOfInitiallyVisibleBlogs < count && (
        <ShowMore
          moreToGo={count - numberOfInitiallyVisibleBlogs}
          onClick={() => {
            setShowAll(false);
            setAllBlogs(data);
          }}
        />
      )}
    </>
  );
}

export async function getStaticProps() {
  let result = false;

  /// TODO - enable when blog endpoint is done
  try {
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL + API_ENDPOINTS.BLOGLIST}`, {
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
