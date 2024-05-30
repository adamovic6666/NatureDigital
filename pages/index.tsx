import { API_ENDPOINTS, REQUEST_SECRET, WEB_PAGES } from "@nature-digital/constants";
import { BlogType } from "@nature-digital/types";
import icons from "@nature-digital/web-styles";
import axios from "axios";
import { NextSeo } from "next-seo";
import Image from "next/image";
import Link from "next/link";
import Instructions from "../components/instructions/Instructions";
import NewsTeaser from "../components/news/NewsTeaser";
import LandingSearch from "../components/search/Search";

type BlogsType = {
  count: number;
  data: BlogType[];
};

export default function Index({ blogs = { count: 0, data: [] } }: { blogs: BlogsType }) {
  return (
    <>
      <NextSeo title="" description="Nature Digital" />
      <div className="landingPage container-small">
        <div className="textCenter logoLanding">
          <Image src={icons.logoHeader} alt="logo" />
        </div>

        <LandingSearch />
        <Instructions />
        {blogs.count > 0 && (
          <>
            <div className="title--with-icon">
              <Image src={icons.iconBell} alt="news-bell" />
              <h3>Nature Bloggen</h3>
            </div>
            <div className="news">
              {blogs.data.map(item => {
                return <NewsTeaser key={`NEWS_TEASER_ITEM_${item.url}`} data={item} />;
              })}
              <Link href={WEB_PAGES.BLOG} className="button">
                Gehe zum Archiv
              </Link>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export async function getServerSideProps() {
  const { data: blogs } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL + API_ENDPOINTS.BLOGLIST}`, {
    headers: {
      secretkey: REQUEST_SECRET,
    },
    params: {
      limit: 3,
    },
  });

  return {
    props: {
      blogs,
    },
  };
}
