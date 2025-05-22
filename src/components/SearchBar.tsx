import React from "react";
import {
  CommandDialog,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import sinchonBuildings from "@/data/buildings/sinchon.json";
import songdoBuildings from "@/data/buildings/songdo.json";
import { selectedId } from "@/store";
import { useStore } from "@nanostores/react";
import { cn } from "@/lib/utils";
import type { BuildingProps } from "@/content.config";
import { flyToLocation } from "@/lib/mapUtils";

const SearchBar = () => {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");

  const listRef = React.useRef<HTMLDivElement>(null);

  // https://github.com/pacocoursey/cmdk/issues/234#issuecomment-2105098199
  const scrollUpWhenCleared = React.useCallback(() => {
    requestAnimationFrame(() => {
      listRef.current?.scrollTo({ top: 0 });
    });
  }, []);

  const toggleOpen = () => {
    if (!open) {
      setSearch("");
    }
    setOpen((open) => !open);
  };

  const handleSearch = (query: string) => {
    scrollUpWhenCleared();
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
    flyToLocation(building.longitude, building.latitude);
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
        <Tabs
          defaultValue="sinchon"
          className="gap-0"
          onValueChange={() => scrollUpWhenCleared()}
        >
          <div className="px-3 pt-2 pb-0.5">
            <TabsList className="bg-transparent px-0">
              <TabsTrigger className="text-xs" value="sinchon">
                Sinchon Campus [{filteredSinchonBuildings.length}]
              </TabsTrigger>
              <TabsTrigger className="text-xs" value="songdo">
                Songdo Campus [{filteredSongdoBuildings.length}]
              </TabsTrigger>
            </TabsList>
          </div>
          <CommandList ref={listRef}>
            <TabsContent value="sinchon">
              <SearchGroup
                name="Sinchon"
                buildings={filteredSinchonBuildings as BuildingProps[]}
                handleSelect={handleSelect}
              />
            </TabsContent>
            <TabsContent value="songdo">
              <SearchGroup
                name="Songdo"
                buildings={filteredSongdoBuildings as BuildingProps[]}
                handleSelect={handleSelect}
              />
            </TabsContent>
          </CommandList>
        </Tabs>
      </CommandDialog>
    </>
  );
};

export default SearchBar;

type SearchGroupProps = {
  name: string;
  buildings: BuildingProps[];
  handleSelect: (building: BuildingProps) => void;
};

const SearchGroup = ({ name, buildings, handleSelect }: SearchGroupProps) => {
  return (
    <CommandGroup className="pt-0">
      {buildings.length === 0 && (
        <div className="text-sm text-center py-4">
          No results for {name} campus.
        </div>
      )}
      {buildings.map((building) => {
        return (
          <SearchItem
            key={building.id}
            building={building as BuildingProps}
            handleSelect={handleSelect}
          />
        );
      })}
    </CommandGroup>
  );
};

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
