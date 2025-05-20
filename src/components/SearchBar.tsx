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

const SearchBar = () => {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");

  const toggleOpen = () => {
    setSearch("");
    setOpen((open) => !open);
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

  return (
    <>
      <Button
        onClick={toggleOpen}
        variant="outline"
        className="text-muted-foreground font-normal"
      >
        <SearchIcon />
        <span>Search buildings</span>
        <kbd>
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
          onValueChange={setSearch}
        />
        <CommandList>
          <CommandGroup
            heading={`Sinchon Campus [${filteredBuildings.length}]`}
          >
            <CommandEmpty>No results for Sinchon campus.</CommandEmpty>
            {filteredBuildings.map((building) => {
              return (
                <CommandItem key={building.id} value={String(building.id)}>
                  <span>{building.name_en}</span>
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
