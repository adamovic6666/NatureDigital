import { GetStaticPaths } from "next";

const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export default getStaticPaths;
