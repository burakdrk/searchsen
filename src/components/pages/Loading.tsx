type LoadingProps = {
  message: string;
};

function Loading({ message }: LoadingProps) {
  return (
    <div className="flex flex-col items-center justify-center h-[90%] gap-5">
      <svg
        width="38"
        height="38"
        viewBox="0 0 38 38"
        xmlns="http://www.w3.org/2000/svg"
        stroke="#fff"
        className="h-24 w-24"
      >
        <g fill="none" fillRule="evenodd">
          <g transform="translate(1 1)" strokeWidth="2">
            <circle strokeOpacity=".5" cx="18" cy="18" r="18" />
            <path d="M36 18c0-9.94-8.06-18-18-18">
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 18 18"
                to="360 18 18"
                dur="1s"
                repeatCount="indefinite"
              />
            </path>
          </g>
        </g>
      </svg>

      <p className="mt-2 text-text-default text-2xl font-bold">{message}</p>
    </div>
  );
}

export default Loading;
