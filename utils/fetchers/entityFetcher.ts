import { API_ENDPOINTS, REQUEST_SECRET } from "@nature-digital/constants";
import axios from "axios";

type EntityFetcherProps = {
  url: string;
};

const entityFetcher = async (props: EntityFetcherProps) => {
  const { url } = props;

  const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL + API_ENDPOINTS.NODE}`, {
    headers: {
      secretkey: REQUEST_SECRET,
    },
    params: {
      url,
    },
  });

  return data;
};

export default entityFetcher;
