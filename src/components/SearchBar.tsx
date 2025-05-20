import React from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import sinchonBuildings from "@/data/buildings/sinchon.json";

const SearchBar = () => {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        variant="outline"
        className="text-muted-foreground font-normal"
      >
        <SearchIcon />
        <span>Search buildings</span>
        <kbd>
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search for buildings..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading={`Sinchon Campus [${sinchonBuildings.length}]`}>
            {sinchonBuildings.map((building) => {
              return (
                <CommandItem>
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
