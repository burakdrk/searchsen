import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { IoCloseOutline } from "react-icons/io5";
import { Rnd } from "react-rnd";

import Logo from "./Logo";
import IconButton from "./inputs/IconButton";
import Sidebar from "./Sidebar";
import Content from "./Content";
import { useState } from "react";
import { useStore } from "~utils";

type ModalProps = {
  onClose: () => void;
};

function Modal({ onClose }: ModalProps) {
  const [isTransparent, setIsTransparent] = useState(false);

  const _window = useStore((state) => state.window);

  return (
    <div className="fixed left-0 top-0 z-[10000]">
      <Rnd
        size={{
          height: _window.height,
          width: _window.width
        }}
        position={{ x: _window.x, y: _window.y }}
        onDragStop={(e, d) => _window.setPosition(d.x, d.y)}
        onResizeStop={(e, direction, ref, delta, position) => {
          _window.setSize(ref.offsetWidth, ref.offsetHeight);
          _window.setPosition(position.x, position.y);
        }}
        minWidth={400}
        minHeight={220}
        dragHandleClassName="searchsen-drag-handle"
        bounds="window"
      >
        <div
          className={
            "flex h-full w-full flex-col rounded-md border border-[#434343] shadow-lg"
          }
        >
          <header
            className={`searchsen-drag-handle flex cursor-move items-center justify-between border-b
              border-[#434343] bg-[#1f1f23] px-4 py-2 bg-opacity-90`}
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

          <div className={`flex flex-1 ${isTransparent ? "opacity-60" : ""}`}>
            <Sidebar />
            <Content />
          </div>
        </div>
      </Rnd>
    </div>
  );
}

export default Modal;
