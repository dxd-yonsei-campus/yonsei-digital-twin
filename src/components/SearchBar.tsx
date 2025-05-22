import React from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import sinchonBuildings from "@/data/buildings/sinchon.json";
import songdoBuildings from "@/data/buildings/songdo.json";
import { selectedId } from "@/store";
import { useStore } from "@nanostores/react";
import { cn } from "@/lib/utils";
import type { BuildingProps } from "@/content.config";

const SearchBar = () => {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");

  const listRef = React.useRef<HTMLDivElement>(null);

  // https://github.com/pacocoursey/cmdk/issues/234#issuecomment-2105098199
  const scrollUpWhenCleared = React.useCallback((value: string) => {
    if (value === "") {
      requestAnimationFrame(() => {
        listRef.current?.scrollTo({ top: 0 });
      });
    }
  }, []);

  const toggleOpen = () => {
    if (!open) {
      setSearch("");
    }
    setOpen((open) => !open);
  };

  const handleSearch = (query: string) => {
    scrollUpWhenCleared(query);
    setSearch(query);
  };

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        toggleOpen();
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const filteredSinchonBuildings = sinchonBuildings
    .filter((building) =>
      building.name_en.toLowerCase().includes(search.toLowerCase()),
    )
    .sort((a, b) =>
      a.name_en.toLowerCase().localeCompare(b.name_en.toLowerCase()),
    );

  const filteredSongdoBuildings = songdoBuildings
    .filter((building) =>
      building.name_en.toLowerCase().includes(search.toLowerCase()),
    )
    .sort((a, b) =>
      a.name_en.toLowerCase().localeCompare(b.name_en.toLowerCase()),
    );

  const handleSelect = (building: BuildingProps) => {
    selectedId.set(building.id);
    toggleOpen();

    window.map.flyTo({
      center: [building.longitude, building.latitude],
      zoom: 17,
      pitch: 45,
      bearing: 0,
      duration: 2000,
    });
  };

  const $selectedId = useStore(selectedId);
  const buildingData = sinchonBuildings.filter(
    (building) => building.id === $selectedId,
  );
  const building = buildingData.length >= 1 ? buildingData[0] : null;

  return (
    <>
      <Button
        onClick={toggleOpen}
        variant="outline"
        className="text-muted-foreground font-normal w-auto sm:w-52 md:w-60 flex justify-between"
      >
        <div className="flex gap-2 items-center overflow-hidden">
          <SearchIcon />
          <span
            className={cn("hidden sm:block overflow-hidden text-ellipsis", {
              "text-foreground": building,
            })}
          >
            {building ? building.name_en : "Search buildings"}
          </span>
        </div>
        <kbd className="hidden md:inline-flex shrink-0">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      <CommandDialog
        commandProps={{
          shouldFilter: false,
        }}
        open={open}
        onOpenChange={setOpen}
      >
        <CommandInput
          placeholder="Search for buildings..."
          value={search}
          onValueChange={handleSearch}
        />
        <CommandList ref={listRef}>
          <CommandGroup
            heading={`Sinchon Campus [${filteredSinchonBuildings.length}]`}
          >
            {filteredSinchonBuildings.length === 0 && (
              <div className="text-sm text-center py-4">
                No results for Sinchon campus.
              </div>
            )}
            {filteredSinchonBuildings.map((building) => {
              return (
                <SearchItem
                  building={building as BuildingProps}
                  handleSelect={handleSelect}
                />
              );
            })}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup
            heading={`Songdo Campus [${filteredSongdoBuildings.length}]`}
          >
            {filteredSongdoBuildings.length === 0 && (
              <div className="text-sm text-center py-4">
                No results for Songdo campus.
              </div>
            )}
            {filteredSongdoBuildings.map((building) => {
              return (
                <SearchItem
                  building={building as BuildingProps}
                  handleSelect={handleSelect}
                />
              );
            })}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
};

export default SearchBar;

type SearchItemProps = {
  building: BuildingProps;
  handleSelect: (building: BuildingProps) => void;
};

const SearchItem = ({ building, handleSelect }: SearchItemProps) => {
  return (
    <CommandItem
      key={building.id}
      value={String(building.id)}
      onSelect={() => handleSelect(building)}
    >
      <div className="flex flex-col">
        <span>{building.name_en}</span>
        <span className="text-muted-foreground text-xs">{building.name}</span>
      </div>
    </CommandItem>
  );
};
