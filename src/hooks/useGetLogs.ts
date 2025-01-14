import { useCallback, useEffect, useState } from "react";
import {
  getAPILinks,
  getLogsFromJustlog,
  getTwitchTokens,
  getVODInfo,
  useStore
} from "~utils";

function useGetLogs() {
  const logsState = useStore((state) => state.logs);

  const [isLoading, setIsLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState("Loading");

  const [error, setError] = useState<null | string>(null);

  const getLogs = useCallback(async () => {
    const { client_id, oauth, unique_id, video_id } = getTwitchTokens();

    if (!client_id || !oauth || !unique_id || !video_id) {
      setIsLoading(false);
      setError("Go to a VOD page to start");
      return;
    }

    if (logsState.fetchedFor === video_id) {
      setIsLoading(false);
      setError(null);
      return;
    }

    const vodInfo = await getVODInfo({
      video_id,
      oauth,
      client_id
    });

    if (!vodInfo.data) {
      setIsLoading(false);
      setError("Error fetching VOD info");
      return;
    }

    const apiLinks = await getAPILinks(vodInfo.data.channelname);

    if (!apiLinks.data) {
      // TO IMPLEMENT: Fall back to Twitch API if this happens.
      setIsLoading(false);
      setError("Error fetching API links");
      return;
    }

    const start = new Date(vodInfo.data.created_at).getTime();
    const end = start + vodInfo.data.length * 1000;

    for (const link of apiLinks.data) {
      const logs = await getLogsFromJustlog({
        baseURL: link,
        channelName: vodInfo.data.channelname,
        from: start,
        to: end
      });

      if (logs.data) {
        setIsLoading(false);
        setError(null);

        logsState.setData(logs.data, video_id);
        return;
      }
    }

    setIsLoading(false);
    setError("Error fetching logs");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getLogs();
  }, [getLogs]);

  return { isLoading, loadingMessage, error, data: logsState.data };
}

export default useGetLogs;
