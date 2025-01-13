import { FiSettings } from "react-icons/fi";
import IconButton from "./inputs/IconButton";
import { IoSearchSharp, IoStatsChartOutline } from "react-icons/io5";
import Tooltip from "./Tooltip";
import { useStore } from "~utils";

function Sidebar() {
  const setCurrentPage = useStore((state) => state.setCurrentPage);

  return (
    <aside
      className="flex h-full w-[4.45rem] flex-col items-center border-r border-[#434343]
        bg-[#1f1f23] justify-between py-5"
    >
      <div className="flex flex-col items-center gap-5">
        <Tooltip content="Search" position="right">
          <IconButton onClick={() => setCurrentPage("search")}>
            <IoSearchSharp className="h-10 w-10 p-1" />
          </IconButton>
        </Tooltip>

        <Tooltip content="Stats" position="right">
          <IconButton onClick={() => setCurrentPage("stats")}>
            <IoStatsChartOutline className="h-10 w-10 p-1" />
          </IconButton>
        </Tooltip>
      </div>

      <div className="flex flex-col items-center gap-5">
        <Tooltip content="Settings" position="right">
          <IconButton onClick={() => setCurrentPage("settings")}>
            <FiSettings className="h-10 w-10 p-1" />
          </IconButton>
        </Tooltip>
      </div>
    </aside>
  );
}

export default Sidebar;
