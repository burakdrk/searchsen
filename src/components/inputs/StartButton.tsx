import { useEffect, useState } from "react";
import { IoSearchSharp } from "react-icons/io5";

function StartButton() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    const element = document.getElementById("live-page-chat");
    if (!element) return;

    const handleChange = () => {
      const isHidden = element.getAttribute("aria-hidden") === "true";
      if (isHidden) {
        setIsChatOpen(false);
      } else {
        setIsChatOpen(true);
      }
    };

    const checkVideoChatHeader = () => {
      const header = document.querySelector(".video-chat__header");
      const isHidden = element.getAttribute("aria-hidden") === "true";

      if (header && !isHidden) {
        setIsChatOpen(true);
      } else {
        setIsChatOpen(false);
      }
    };

    handleChange();
    checkVideoChatHeader();

    const observer = new MutationObserver(() => {
      handleChange();
    });

    const observer2 = new MutationObserver(() => {
      checkVideoChatHeader();
    });

    observer.observe(element, {
      attributes: true,
      attributeFilter: ["aria-hidden"]
    });

    observer2.observe(element, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      observer2.disconnect();
    };
  }, []);

  return (
    <>
      {isChatOpen && (
        <div className="w-12 h-12 flex items-center justify-center hover:bg-hover-bg rounded-md z-10">
          <button
            onClick={() => {
              window.postMessage("toggle-searchsen", "*");
            }}
            data-tooltip-id="searchsen-tooltip"
            data-tooltip="Searchsen"
          >
            <IoSearchSharp className="w-8 h-8" />
          </button>
        </div>
      )}
    </>
  );
}

export default StartButton;
