import { FiSettings } from "react-icons/fi";
import IconButton from "../inputs/IconButton";
import { IoSearchSharp, IoStatsChartOutline } from "react-icons/io5";
import Tooltip from "../ui/Tooltip";
import { LuDownload } from "react-icons/lu";
import type { Logs } from "~types";
import { useAppDispatch, useAppSelector } from "~hooks/redux";
import { setCurrentPage } from "~store/appSlice";

const handleDownload = (data: Logs[], vodID: string) => {
  const a = document.createElement("a");
  const file = new Blob([JSON.stringify(data)], {
    type: "text/plain;charset=utf-8"
  });
  a.href = URL.createObjectURL(file);
  a.download = `searchsen_${vodID}.json`;
  a.click();
};

function Sidebar() {
  const logs = useAppSelector((state) => state.log.logs);
  const fetchedFor = useAppSelector((state) => state.log.fetchedFor);
  const isLoading = useAppSelector((state) => state.log.isLoading);

  const dispatch = useAppDispatch();

  return (
    <aside
      className="flex h-full w-[4.45rem] flex-col items-center border-r border-default-border
        bg-dark justify-between py-5"
    >
      <div className="flex flex-col items-center gap-5">
        <Tooltip content="Search" position="right">
          <IconButton
            onClick={() => dispatch(setCurrentPage("search"))}
            disabled={isLoading}
          >
            <IoSearchSharp className="h-10 w-10 p-1" />
          </IconButton>
        </Tooltip>

        <Tooltip content="Stats" position="right">
          <IconButton
            onClick={() => dispatch(setCurrentPage("stats"))}
            disabled={isLoading}
          >
            <IoStatsChartOutline className="h-10 w-10 p-1" />
          </IconButton>
        </Tooltip>

        {logs.length > 0 && fetchedFor && !isLoading && (
          <Tooltip content="Download logs" position="right">
            <IconButton onClick={() => handleDownload(logs, fetchedFor)}>
              <LuDownload className="h-10 w-10 p-1" />
            </IconButton>
          </Tooltip>
        )}
      </div>

      <div className="flex flex-col items-center gap-5">
        <Tooltip content="Settings" position="right">
          <IconButton
            onClick={() => dispatch(setCurrentPage("settings"))}
            disabled={isLoading}
          >
            <FiSettings className="h-10 w-10 p-1" />
          </IconButton>
        </Tooltip>
      </div>
    </aside>
  );
}

export default Sidebar;
