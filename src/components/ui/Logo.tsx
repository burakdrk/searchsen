import logo from "data-base64:assets/icon.png";

function Logo() {
  return (
    <div className="h-11 w-11">
      <img
        src={logo}
        alt="searchsen logo"
        className="transform cursor-pointer rounded-lg shadow-lg transition-transform duration-300
          hover:scale-105 hover:brightness-125 active:scale-95 active:duration-100"
      />
    </div>
  );
}

export default Logo;
