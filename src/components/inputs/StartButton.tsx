import { useEffect, useState } from "react";
import { IoSearchSharp } from "react-icons/io5";
import Tooltip from "~components/ui/Tooltip";

function StartButton() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    const element = document.getElementById("live-page-chat");
    if (!element) return;

    const handleChange = () => {
      const isHidden = element.getAttribute("aria-hidden") === "true";
      const header = document.querySelector(".video-chat__header");

      if (isHidden) {
        setIsChatOpen(false);
      } else if (header) {
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
        <div
          className="w-[32px] h-[32px] flex items-center justify-center hover:bg-hover-bg
            rounded-full z-10"
        >
          <Tooltip content="Searchsen" position="left">
            <button
              onClick={() => {
                window.postMessage("toggle-searchsen", "*");
              }}
              data-tooltip-id="searchsen-tooltip"
              data-tooltip="Searchsen"
            >
              <IoSearchSharp className="w-8 h-8" />
            </button>
          </Tooltip>
        </div>
      )}
    </>
  );
}

export default StartButton;
