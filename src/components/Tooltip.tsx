import { type ReactNode, useState, useEffect } from "react";

type TooltipProps = {
  content: string;
  children: ReactNode;
  position?: "top" | "bottom" | "left" | "right";
  delay?: number; // Delay in milliseconds
  className?: string;
};

const Tooltip = ({
  content,
  children,
  position = "top",
  delay = 400,
  className
}: TooltipProps) => {
  const [visible, setVisible] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false); // Controls animation

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (visible) {
      timeout = setTimeout(() => setShowTooltip(true), delay);
    } else {
      setShowTooltip(false);
    }
    return () => clearTimeout(timeout);
  }, [visible, delay]);

  const positionClasses: Record<string, string> = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2"
  };

  return (
    <div className="relative inline-block">
      {/* Tooltip trigger */}
      <div
        className="cursor-pointer"
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
      >
        {children}
      </div>

      {/* Tooltip box with transition effects */}
      {showTooltip && (
        <div
          className={`absolute whitespace-nowrap bg-white text-black px-2 py-1 text-xl rounded z-10
          font-bold shadow-lg opacity-0 scale-95 transition-all duration-200 ease-in-out
          ${positionClasses[position]}
          ${visible ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}
          ${className}`}
        >
          {content}
        </div>
      )}
    </div>
  );
};

export default Tooltip;
