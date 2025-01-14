import { useStore } from "~utils";
import Search from "./pages/Search";
import Stats from "./pages/Stats";
import Settings from "./pages/Settings";
import Loading from "./pages/Loading";
import Error from "./pages/Error";
import useGetLogs from "~hooks/useGetLogs";

function Content() {
  const currentPage = useStore((state) => state.currentPage);

  const { error, isLoading, loadingMessage } = useGetLogs();

  return (
    <main className="h-full flex-1 text-text-default p-6 bg-[#18181b] text-xl">
      {isLoading ? (
        <Loading message={loadingMessage} />
      ) : error ? (
        <Error message={error} />
      ) : (
        (() => {
          switch (currentPage) {
            case "search":
              return <Search />;
            case "stats":
              return <Stats />;
            case "settings":
              return <Settings />;
            default:
              return null;
          }
        })()
      )}
    </main>
  );
}

export default Content;
