import cssText from "data-text:~styles/index.css";
import type { PlasmoCSConfig, PlasmoGetInlineAnchor } from "plasmo";

import "~styles/root.css";

import StartButton from "~components/inputs/StartButton";

export const config: PlasmoCSConfig = {
  matches: ["https://www.twitch.tv/*"]
};

export const getStyle = () => {
  const style = document.createElement("style");
  style.textContent = cssText.replaceAll(":root", ":host(plasmo-csui)");
  return style;
};

export const getInlineAnchor: PlasmoGetInlineAnchor = () =>
  document.querySelector(`.right-column__toggle-visibility`);

export const getShadowHostId = () => "plasmo-searchsen-btn";

const PlasmoInline = () => {
  return <StartButton />;
};

export default PlasmoInline;
