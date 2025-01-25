import cssText from "data-text:~styles/index.css";
import type { PlasmoCSConfig } from "plasmo";

import Root from "~components/Root";

export const config: PlasmoCSConfig = {
  matches: ["https://www.twitch.tv/*"],
  css: ["../styles/font.css"]
};

export const getStyle = () => {
  const style = document.createElement("style");
  style.textContent = cssText.replaceAll(":root", ":host(plasmo-csui)");
  return style;
};

export const getShadowHostId = () => "plasmo-searchsen";

const PlasmoOverlay = () => {
  return <Root />;
};

export default PlasmoOverlay;
