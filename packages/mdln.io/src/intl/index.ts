import { createIntl, createIntlCache } from "@formatjs/intl";
import messages from "./messages";

const cache = createIntlCache();
const intl = createIntl(
  {
    locale: "en-US",
    onError: () => {
      return;
    },
  },
  cache,
);
export { intl, messages };
