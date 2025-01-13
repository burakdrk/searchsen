export {};

chrome.webNavigation.onHistoryStateUpdated.addListener(
  (details) => {
    console.log("dURL changed to:", details.url);

    // Handle the URL change
    if (details.url.includes("/new-chat")) {
      console.log("New chat page detected");
      // Perform specific actions for the new chat page
    }
  },
  {
    url: [{ hostContains: "www.twitch.tv" }] // Optional filter to target specific domains
  }
);
