import { useEffect, useState } from "react";

import Modal from "./Modal";
import { Provider } from "react-redux";
import { store } from "~store";

function Root() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const listener = (event: MessageEvent) => {
      if (event.data === "toggle-searchsen") {
        setIsOpen(!isOpen);
      }
    };

    const escListener = (event: KeyboardEvent) => {
      if (event.key.toUpperCase() === "ESCAPE") {
        setIsOpen(false);
      }
    };

    const tabChangeListener = (message: { message: string }) => {
      if (message.message === "searchsen_tabUpdated") {
        document.getElementById("searchsen-heatmap")?.remove();
        window.searchsen_resize_observer?.disconnect();
      }
    };

    window.addEventListener("message", listener);
    window.addEventListener("keydown", escListener);
    chrome.runtime.onMessage.addListener(tabChangeListener);

    return () => {
      window.removeEventListener("message", listener);
      window.removeEventListener("keydown", escListener);
      chrome.runtime.onMessage.removeListener(tabChangeListener);
    };
  }, [isOpen]);

  return (
    <Provider store={store}>
      {isOpen && <Modal onClose={() => setIsOpen(false)} />}
    </Provider>
  );
}

export default Root;
