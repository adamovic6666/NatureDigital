import { API_ENDPOINTS, REQUEST_SECRET } from "@nature-digital/constants";
import axios from "axios";
import EntityBuilder from "../../components/entityBuilder/entityBuilder";
import getStaticPaths from "../../utils/getStaticPaths";

export default function Article({ result }) {
  return <EntityBuilder data={result} />;
}

export async function getStaticProps(ctx: { params: { slug?: string[] } }) {
  const { slug } = ctx.params;

  if (slug === undefined) {
    return {
      notFound: true,
    };
  }

  const url = `/${slug.join("/")}`;
  let result = false;

  try {
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL + API_ENDPOINTS.NODE}`, {
      headers: {
        secretkey: REQUEST_SECRET,
      },
      params: {
        url,
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
