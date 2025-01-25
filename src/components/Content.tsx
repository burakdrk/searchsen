import Search from "./pages/Search";
import Stats from "./pages/Stats";
import Settings from "./pages/Settings";
import Loading from "./pages/Loading";
import Error from "./pages/Error";
import useGetLogs from "~hooks/useGetLogs";
import { useAppSelector } from "~hooks/redux";

function Content() {
  const currentPage = useAppSelector((state) => state.app.currentPage);

  const { error, isLoading, loadingMessage } = useGetLogs();

  return (
    <main className="h-full flex-1 text-text-default p-6 bg-darker text-xl overflow-y-auto">
      {isLoading ? (
        <Loading message={loadingMessage} />
      ) : (
        (() => {
          switch (currentPage) {
            case "search":
              return error ? <Error message={error} /> : <Search />;
            case "stats":
              return error ? <Error message={error} /> : <Stats />;
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
