import audio from "data-base64:assets/easteregg.mp3";
import logo from "data-base64:assets/icon.png";
import { useMemo, useState } from "react";

function Logo() {
  const [clickTimestamps, setClickTimestamps] = useState<number[]>([]);

  const easterEgg = useMemo(() => {
    return new Audio(audio);
  }, []);

  const handleClick = () => {
    const now = Date.now();
    const threshold = 1000;

    const recentClicks = clickTimestamps.filter(
      (timestamp) => now - timestamp < threshold
    );

    recentClicks.push(now);

    setClickTimestamps(recentClicks);

    if (recentClicks.length >= 5) {
      easterEgg.play();
      setClickTimestamps([]);
    }
  };

  return (
    <div className="h-11 w-11">
      <img
        src={logo}
        alt="searchsen logo"
        className="transform cursor-pointer rounded-lg shadow-lg transition-transform duration-300
          hover:scale-105 hover:brightness-125 active:scale-95 active:duration-100"
        onClick={handleClick}
      />
    </div>
  );
}

export default Logo;
