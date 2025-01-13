import { useEffect, useState } from "react";

import Modal from "./Modal";

function Root() {
  const [isOpen, setIsOpen] = useState(true);

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

    window.addEventListener("message", listener);
    window.addEventListener("keydown", escListener);

    return () => {
      window.removeEventListener("message", listener);
      window.removeEventListener("keydown", escListener);
    };
  }, [isOpen]);

  return <>{isOpen && <Modal onClose={() => setIsOpen(false)} />}</>;
}

export default Root;
