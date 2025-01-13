import SearchInput from "~components/inputs/SearchInput";
import { IoTrashOutline } from "react-icons/io5";
import IconButton from "~components/inputs/IconButton";
import { useStore } from "~utils";

function Search() {
  const setSearchValue = useStore((state) => state.setSearchValue);

  return (
    <div className="h-12 flex items-center justify-between gap-2">
      <SearchInput />
      <IconButton className="p-2" onClick={() => setSearchValue("")}>
        <IoTrashOutline className="h-8 w-8" />
      </IconButton>
    </div>
  );
}

export default Search;
