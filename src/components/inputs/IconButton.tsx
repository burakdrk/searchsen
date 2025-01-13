interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  children: React.ReactNode;
}

function IconButton({ className, children, ...props }: IconButtonProps) {
  const baseStyles =
    "flex items-center justify-center rounded-md text-[#fff] transition-colors hover:bg-[#434343] hover:text-[#fff] p-1";

  return (
    <button className={`${baseStyles} ${className}`} {...props}>
      {children}
    </button>
  );
}

export default IconButton;
