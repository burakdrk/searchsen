import { useEffect } from "react";
import {
  getAPILinks,
  getLogsFromJustlog,
  getTwitchTokens,
  getVODInfo,
  useStore
} from "~utils";
import Search from "./pages/Search";
import Stats from "./pages/Stats";
import Settings from "./pages/Settings";

function Content() {
  const currentPage = useStore((state) => state.currentPage);

  const test = async () => {
    const tokens = getTwitchTokens();

    const res = await getVODInfo({
      video_id: tokens.video_id ?? "",
      oauth: tokens?.oauth ?? "",
      client_id: tokens?.client_id ?? ""
    });

    if (!res.data) return;

    const res2 = await getAPILinks(res.data.channelname);

    if (!res2.data) {
      return;
    }

    const start = new Date(res.data.created_at).getTime();
    const end = start + res.data.length * 1000;

    for (const link of res2.data) {
      const res3 = await getLogsFromJustlog({
        baseURL: link,
        channelName: res.data.channelname,
        from: start,
        to: end
      });

      if (res3.data) {
        break;
      }
    }
  };

  useEffect(() => {
    test();
  }, []);

  return (
    <main className="h-full flex-1 text-text-default p-6 bg-[#18181b] text-xl">
      {currentPage === "search" && <Search />}
      {currentPage === "stats" && <Stats />}
      {currentPage === "settings" && <Settings />}
    </main>
  );
}

export default Content;
