import { API_ENDPOINTS, REQUEST_SECRET } from "@nature-digital/constants";
import axios from "axios";
import { NextSeo } from "next-seo";
import getStaticPaths from "../utils/getStaticPaths";
import RenderHTML from "../utils/renderHtml";

export default function BasicPage({ result }) {
  const { title, body } = result;

  return (
    <>
      <NextSeo title={title} description="Page description" />
      <div className="basicPage container-small">
        <h1>{title}</h1>
        {body && <RenderHTML text={body} />}
      </div>
    </>
  );
}

export async function getStaticProps(ctx: { params: { slug: string[] } }) {
  const { slug } = ctx.params;

  if (slug === undefined) {
    return {
      notFound: true,
    };
  }

  const url = `/${slug.join("/")}`;
  let result = false;

  try {
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL + API_ENDPOINTS.BASICPAGE(url)}`, {
      headers: {
        secretkey: REQUEST_SECRET,
      },
    });

    result = data;
  } catch (error) {
    console.log(error);
  }

  if (!slug || !result) {
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

export { getStaticPaths };
