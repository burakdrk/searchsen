export {};

import { Storage } from "@plasmohq/storage";

type Chunks = {
  data: string[];
  index: number;
};

declare global {
  interface Window {
    chunksMap: Record<string, Chunks>;
  }
}

interface IDetails extends chrome.webRequest.WebRequestHeadersDetails {
  originUrl?: string;
}

self.chunksMap = {};

const storage = new Storage({
  area: "local"
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.url) {
    chrome.tabs.sendMessage(tabId, { message: "searchsen_tabUpdated" });
  }
});

chrome.webRequest.onBeforeSendHeaders.addListener(
  (details: IDetails) => {
    (async () => {
      if (
        details.initiator?.toLowerCase().startsWith("chrome-extension") ||
        details.originUrl?.toLowerCase().startsWith("moz-extension")
      ) {
        return;
      }

      const headers = details.requestHeaders;
      if (!headers) {
        return;
      }

      const token = headers.find(
        (obj) => obj.name === "Client-Integrity"
      )?.value;
      if (!token) {
        return;
      }

      const savedToken = await storage.get("integrity");
      if (savedToken === token) {
        return;
      }

      await storage.set("integrity", token);
      console.log("Token is set");
    })();
  },
  { urls: ["https://gql.twitch.tv/gql*"] },
  ["requestHeaders"]
);

// chrome.runtime.onInstalled.addListener((details) => {
//   if (details.reason === "update") {
//     chrome.tabs.create({ url: chrome.runtime.getURL("tabs/updated.html") });
//   }
// });
