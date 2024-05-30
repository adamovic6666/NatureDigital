import { WEB_PAGES } from "@nature-digital/constants";
import icons from "@nature-digital/web-styles";
import Image from "next/image";
import Link from "next/link";

export default function FourOhFour() {
  return (
    <div className="container-small errorPage textCenter">
      <Image className="errorPage__image" src={icons.errorPage} alt="404 page" />

      <h1>Page Not Found</h1>
      <h4>The link you followed probably be broken, or the page may have been removed.</h4>
      <Link className="button buttonImage" href={WEB_PAGES.HOME_PAGE}>
        <Image src={icons.home} alt="home" />
        Back home
      </Link>
    </div>
  );
}
