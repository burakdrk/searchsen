import { type ReactNode, useState, useEffect, memo, useRef } from "react";
import { createPortal } from "react-dom";

type TooltipProps = {
  content: string;
  children: ReactNode;
  position?: "top" | "bottom" | "left" | "right";
  delay?: number;
};

const Tooltip = memo(function Tooltip({
  content,
  children,
  position = "top",
  delay = 400
}: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    const updatePosition = () => {
      if (!triggerRef.current) return;

      const rect = triggerRef.current.getBoundingClientRect();
      let top = 0;
      let left = 0;

      const spacing = 5;

      switch (position) {
        case "top":
          top = rect.top - spacing;
          left = rect.left + rect.width / 2;
          break;
        case "bottom":
          top = rect.bottom + spacing;
          left = rect.left + rect.width / 2;
          break;
        case "left":
          top = rect.top + rect.height / 2;
          left = rect.left - spacing - triggerRef.current.offsetWidth - 70;
          break;
        case "right":
          top = rect.top + rect.height / 2;
          left = rect.right + spacing;
          break;
      }

      setTooltipPosition({ top, left });
    };

    let timeout: NodeJS.Timeout;
    if (visible) {
      timeout = setTimeout(() => {
        setShowTooltip(true);
        updatePosition();
      }, delay);
    } else {
      setShowTooltip(false);
    }
    return () => clearTimeout(timeout);
  }, [delay, position, visible]);

  return (
    <>
      <div
        className="flex"
        ref={triggerRef}
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
      >
        {children}
      </div>

      {showTooltip &&
        createPortal(
          <div
            style={{
              top: `${tooltipPosition.top}px`,
              left: `${tooltipPosition.left}px`,
              transform:
                position === "top" || position === "bottom"
                  ? "translateX(-50%)"
                  : "translateY(-50%)",
              zIndex: 10001,
              position: "fixed",
              whiteSpace: "nowrap",
              backgroundColor: "white",
              color: "black",
              padding: "0.5rem 1rem",
              borderRadius: "0.5rem",
              boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
              fontSize: "1.25rem",
              fontWeight: "bold",
              lineHeight: "1.55rem"
            }}
          >
            {content}
          </div>,
          document.body
        )}
    </>
  );
});

export default Tooltip;
