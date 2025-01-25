import toast from "react-hot-toast";

type ToastProps = {
  visible: boolean;
  id: string;
  message: string;
};
function Toast({ visible, id, message }: ToastProps) {
  return (
    <button
      className={`${visible ? "animate-enter" : "animate-leave"} max-w-xs w-full bg-dark border
        border-default-border shadow-xl rounded-full pointer-events-auto flex`}
      onClick={() => toast.dismiss(id)}
    >
      <div className="flex-1 w-0 p-4">
        <div className="flex items-start justify-center">
          <p className="text-xl font-semibold text-text-default">{message}</p>
        </div>
      </div>
    </button>
  );
}

export default Toast;
