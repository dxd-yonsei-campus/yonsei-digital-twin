import React from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import sinchonBuildings from "@/data/buildings/sinchon.json";
import { selectedId } from "@/store";
import type mapboxgl from "mapbox-gl";

declare global {
  interface Window {
    map: mapboxgl.Map;
  }
}

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

  const filteredBuildings = sinchonBuildings
    .filter((building) =>
      building.name_en.toLowerCase().includes(search.toLowerCase()),
    )
    .sort((a, b) =>
      a.name_en.toLowerCase().localeCompare(b.name_en.toLowerCase()),
    );

  const handleSelect = (building: (typeof sinchonBuildings)[0]) => {
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

  return (
    <>
      <Button
        onClick={toggleOpen}
        variant="outline"
        className="text-muted-foreground font-normal"
      >
        <SearchIcon />
        <span className="hidden xs:block">Search buildings</span>
        <kbd className="hidden md:inline-flex">
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
            heading={`Sinchon Campus [${filteredBuildings.length}]`}
          >
            <CommandEmpty>No results for Sinchon campus.</CommandEmpty>
            {filteredBuildings.map((building) => {
              return (
                <CommandItem
                  key={building.id}
                  value={String(building.id)}
                  onSelect={() => handleSelect(building)}
                >
                  <div className="flex flex-col">
                    <span>{building.name_en}</span>
                    <span className="text-muted-foreground text-xs">
                      {building.name}
                    </span>
                  </div>
                </CommandItem>
              );
            })}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
};

export default SearchBar;
