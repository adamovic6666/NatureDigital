import { URL_KEYS } from "@nature-digital/constants";
import { NextRouter } from "next/router";

type URLState = Map<string, string | string[]>;
type ParamsType = { [key: string]: string | string[] };

/**
 *
 * Used for URL manipulation
 */
export class URLHandler {
  #state: URLState;

  #router!: NextRouter;

  constructor() {
    this.#state = new Map();

    // doublecheck if we are on client side
    if (typeof window !== "undefined") {
      // gets the full search string
      const currentSearchParams = new URL(window.location.href).search.replace("?", "");

      const temp = {};

      currentSearchParams.split("&").forEach(param => {
        const [key, value] = param.split("=");

        // if there is already item with ['key'] then make it an array
        if (temp[key]) {
          temp[key] = [...(Array.isArray(temp[key]) ? temp[key] : [temp[key]]), value];
        } else {
          temp[key] = value;
        }

        if (key.length) {
          this.#state.set(key, temp[key]);
        }
      });
    }
  }

  /**
   * Sets the router property
   *
   * @param router - next router object
   */
  setRouter(router: NextRouter) {
    this.#router = router;
  }

  /**
   *
   * Sets a parameter with the provided values
   *
   * @param params - [key, value] pair
   */
  changeParam(params: Parameters<URLState["set"]>) {
    this.#state.set(params[0], params[1]);
  }

  /**
   *
   * Returns a string or string[] of the desired ['key'] if exists
   *
   * @param key - identifier of the desired value
   * @returns string | string[]
   */
  getParam(key: Parameters<URLState["get"]>[0]) {
    return this.#state.get(key);
  }

  /**
   *
   * Returns true if there is parameter in the url with the provided key
   *
   * @param key - identifier of the desired value
   * @returns boolean
   */
  hasParam(key: Parameters<URLState["get"]>[0]) {
    return this.#state.has(key);
  }

  /**
   *
   * Removes the value if ['key'] exists
   */
  removeParam(key: Parameters<URLState["delete"]>[0]) {
    this.#state.delete(key);
  }

  /**
   *
   * Returns every search param
   */
  getParams() {
    const exclude = [
      URL_KEYS.ROW,
      URL_KEYS.SEARCH,
      URL_KEYS.URL,
      URL_KEYS.SEASON,
      URL_KEYS.ALLOWGEO,
      URL_KEYS.ALLOWNONGEO,
    ];
    return Object.fromEntries([...this.#state].filter(([key]) => !exclude.includes(key)));
  }

  /**
   *
   * Returns the current state of the filter
   *
   * @returns boolean
   */
  checkState(type: string, filterId?: string): boolean {
    const filter = this.getParam(type);

    if (Array.isArray(filter)) {
      return filter.some(id => filterId === id);
    }

    return filter === filterId;
  }

  /**
   *
   * Returns the current search string   *
   *
   * @returns string
   */
  static getSearchString(params: ParamsType): string {
    let searchParams: string[] | string = Object.entries(params).reduce<string[]>((arr, param) => {
      if (Array.isArray(param[1])) {
        arr.push(param[1].map(p => `${param[0]}=${p}`).join("&"));
      } else {
        arr.push(param.join("="));
      }
      return arr;
    }, []);

    if (Array.isArray(searchParams) && searchParams.length) {
      searchParams = "?".concat(searchParams.join("&"));
    } else {
      searchParams = "";
    }

    return searchParams;
  }

  /**
   *
   * Updates the url
   *
   * @returns string
   */
  changeURL(shouldRemove?: string[]): { object: ParamsType; string: string } {
    const searchObject = Object.fromEntries(this.#state);
    let searchString = URLHandler.getSearchString(searchObject);

    if (window.location.search !== searchString) {
      this.#router.replace(`${window.location.pathname}${searchString}`, undefined, {
        scroll: false,
      });
    }

    if (shouldRemove) {
      shouldRemove.forEach(key => {
        if (key in searchObject) {
          delete searchObject[key];
        }
      });
      searchString = URLHandler.getSearchString(searchObject);
    }

    return { object: searchObject, string: searchString };
  }
}

const Url: URLHandler = new URLHandler();

export default Url;
