import { API_ENDPOINTS, REQUEST_SECRET, URL_KEYS } from "@nature-digital/constants";
import { FilterDataType } from "@nature-digital/types";
import axios from "axios";
import Url from "../urlHandler";
import { searchRef } from "./mapFetcher";

const defaultPrevData = {
  state: false,
  data: null,
  lastTextSearch: ".",
};

const filtersFetcher = async (
  prevData: FilterDataType = defaultPrevData,
  state = prevData.state,
): Promise<FilterDataType> => {
  let textSearch = "";

  if (searchRef.current) {
    textSearch = searchRef.current?.value;
  }

  if (!searchRef.current && Url.getParam(URL_KEYS.SEARCH)) {
    textSearch = Url.getParam(URL_KEYS.SEARCH) as string;
  }

  const { data } =
    prevData.lastTextSearch !== textSearch
      ? await axios.get(`${process.env.NEXT_PUBLIC_API_URL + API_ENDPOINTS.FILTERS}`, {
          headers: {
            secretkey: REQUEST_SECRET,
          },
          params: {
            textSearch,
          },
        })
      : prevData;

  return {
    data,
    state,
    lastTextSearch: textSearch,
  };
};

export default filtersFetcher;
