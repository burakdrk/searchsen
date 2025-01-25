export {};

import { Storage } from "@plasmohq/storage";

declare global {
  interface Window {
    chunks: {
      data: string[];
      index: number;
    };
  }
}

const storage = new Storage({
  area: "local"
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.url) {
    chrome.tabs.sendMessage(tabId, { message: "searchsen_tabUpdated" });
  }
});

chrome.webRequest.onBeforeSendHeaders.addListener(
  (details) => {
    (async () => {
      if (details.initiator?.toLowerCase().startsWith("chrome-extension")) {
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
  { urls: ["https://gql.twitch.tv/gql"] },
  ["requestHeaders"]
);

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === "update") {
    chrome.tabs.create({ url: chrome.runtime.getURL("tabs/updated.html") });
  }
});
