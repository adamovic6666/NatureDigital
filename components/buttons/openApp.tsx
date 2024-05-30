import { TEXTS, WEB_PAGES } from "@nature-digital/constants";
import Link from "next/link";
import isMobileUser from "../../utils/functions/isMobileUser";

const OpenApp = () => {
  return (
    <>
      {isMobileUser() && (
        <p>
          <Link href={WEB_PAGES.OPEN_APP_LOGIN}>{TEXTS.OPEN_APP}</Link>
        </p>
      )}
    </>
  );
};

export default OpenApp;
