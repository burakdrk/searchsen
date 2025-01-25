import { MdError } from "react-icons/md";

type ErrorProps = {
  message: string;
};

function Error({ message }: ErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center h-[90%] gap-5">
      <MdError className="h-24 w-24 text-accent" />

      <p className="text-text-default text-2xl font-bold">{message}</p>
    </div>
  );
}

export default Error;
