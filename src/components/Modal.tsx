import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { IoCloseOutline } from "react-icons/io5";
import { Rnd } from "react-rnd";
import { Toaster } from "react-hot-toast";
import Logo from "./ui/Logo";
import IconButton from "./inputs/IconButton";
import Content from "./Content";
import { useEffect, useState } from "react";
import Sidebar from "./ui/Sidebar";
import { useAppDispatch } from "~hooks/redux";
import { setSize } from "~store/appSlice";

type ModalProps = {
  onClose: () => void;
};

function Modal({ onClose }: ModalProps) {
  const [isTransparent, setIsTransparent] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const shadowHost = document.querySelector("#plasmo-searchsen");
    if (!shadowHost) return;

    const shadowRoot = shadowHost.shadowRoot;
    if (!shadowRoot) return;

    const element = shadowRoot.querySelector(".react-draggable");
    if (!element) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const newWidth = entry.contentRect.width;
        const newHeight = entry.contentRect.height;
        dispatch(setSize({ width: newWidth, height: newHeight }));
      }
    });

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [dispatch]);

  return (
    <div className="fixed left-0 top-0 z-[10000]">
      <Rnd
        default={{
          x: (window.innerWidth - 700) / 2,
          y: (window.innerHeight - 550) / 2,
          width: 700,
          height: 550
        }}
        minWidth={400}
        minHeight={220}
        dragHandleClassName="searchsen-drag-handle"
        bounds="window"
      >
        <div
          id="searchsen-root"
          className={`flex h-full w-full flex-col rounded-md border border-default-border shadow-lg
            ${isTransparent ? "opacity-50" : ""}`}
        >
          <header
            className={`searchsen-drag-handle flex cursor-move items-center justify-between border-b
              rounded-t-md border-default-border bg-dark px-4 py-2 bg-opacity-90`}
          >
            <Logo />

            <div className="flex gap-3">
              <IconButton onClick={() => setIsTransparent(!isTransparent)}>
                {isTransparent ? (
                  <FaRegEyeSlash className="h-10 w-10 p-1" />
                ) : (
                  <FaRegEye className="h-10 w-10 p-1" />
                )}
              </IconButton>

              <IconButton onClick={onClose}>
                <IoCloseOutline className="h-10 w-10" />
              </IconButton>
            </div>
          </header>

          <Toaster />

          <div className={"flex flex-1 overflow-y-auto rounded-b-md bg-black"}>
            <Sidebar />
            <Content />
          </div>
        </div>
      </Rnd>
    </div>
  );
}

export default Modal;
