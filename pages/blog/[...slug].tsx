import { API_ENDPOINTS, REQUEST_SECRET } from "@nature-digital/constants";
import axios from "axios";
import getStaticPaths from "../../utils/getStaticPaths";
import EntityBuilder from "../../components/entityBuilder/entityBuilder";

export default function Blog({ result }) {
  return <EntityBuilder data={result} />;
}

export async function getStaticProps(ctx: { params: { slug: Array<string> } }) {
  const { slug } = ctx.params;

  if (slug === undefined) {
    return {
      notFound: true,
    };
  }

  const url = `/${slug.join("/")}`;
  let result = false;

  try {
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL + API_ENDPOINTS.BLOG(url)}`, {
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
