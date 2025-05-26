import React from 'react';
import {
  CommandDialog,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SearchIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { selectedCampus, selectedId } from '@/store';
import { useStore } from '@nanostores/react';
import { cn } from '@/lib/utils';
import type { BuildingProps } from '@/content.config';
import {
  flyToLocation,
  getBuildingsForCampus,
  getBuildingWithId,
} from '@/lib/mapApi';
import type { ui } from '@/i18n/ui';
import { useTranslations } from '@/i18n/utils';
import type { CampusName } from '@/types/map';

type SearchBarProps = {
  lang: keyof typeof ui;
};

const SearchBar = ({ lang }: SearchBarProps) => {
  const $selectedCampus = useStore(selectedCampus);
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const t = useTranslations(lang);

  const listRef = React.useRef<HTMLDivElement>(null);

  // https://github.com/pacocoursey/cmdk/issues/234#issuecomment-2105098199
  const scrollUpWhenCleared = React.useCallback(() => {
    requestAnimationFrame(() => {
      listRef.current?.scrollTo({ top: 0 });
    });
  }, []);

  const toggleOpen = () => {
    if (!open) {
      setSearch('');
    }
    setOpen((open) => !open);
  };

  const handleSearch = (query: string) => {
    scrollUpWhenCleared();
    setSearch(query);
  };

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        toggleOpen();
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const filteredSinchonBuildings = getBuildingsForCampus('sinchon')
    .filter((building) =>
      (lang === 'ko' ? building.name : building.name_en)
        .toLowerCase()
        .includes(search.toLowerCase()),
    )
    .sort((a, b) =>
      (lang === 'ko' ? a.name : a.name_en)
        .toLowerCase()
        .localeCompare((lang === 'ko' ? b.name : b.name_en).toLowerCase()),
    );

  const filteredSongdoBuildings = getBuildingsForCampus('songdo')
    .filter((building) =>
      (lang === 'ko' ? building.name : building.name_en)
        .toLowerCase()
        .includes(search.toLowerCase()),
    )
    .sort((a, b) =>
      (lang === 'ko' ? a.name : a.name_en)
        .toLowerCase()
        .localeCompare((lang === 'ko' ? b.name : b.name_en).toLowerCase()),
    );

  const handleSelect = (building: BuildingProps) => {
    selectedId.set(building.id);
    toggleOpen();
    flyToLocation(building.longitude, building.latitude);
  };

  const $selectedId = useStore(selectedId);
  const building = getBuildingWithId($selectedId);

  return (
    <>
      <Button
        onClick={toggleOpen}
        variant="outline"
        className="flex w-auto justify-between font-normal text-muted-foreground sm:w-52 md:w-60"
      >
        <div className="flex items-center gap-2 overflow-hidden">
          <SearchIcon />
          <span
            className={cn('hidden overflow-hidden text-ellipsis sm:block', {
              'text-foreground': building,
            })}
          >
            {building
              ? lang === 'en'
                ? building.name_en
                : building.name
              : t('search.placeholder')}
          </span>
        </div>
        <kbd className="hidden shrink-0 md:inline-flex">
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
          placeholder={t('search.placeholder')}
          value={search}
          onValueChange={handleSearch}
        />
        <Tabs
          defaultValue={$selectedCampus}
          className="gap-0"
          onValueChange={() => scrollUpWhenCleared()}
        >
          <div className="px-2 pt-2 pb-1">
            <TabsList className="flex-wrap bg-transparent px-0">
              <TabsTrigger className="text-xs" value="sinchon">
                {t('sinchon')} [{filteredSinchonBuildings.length}]
              </TabsTrigger>
              <TabsTrigger className="text-xs" value="songdo">
                {t('songdo')} [{filteredSongdoBuildings.length}]
              </TabsTrigger>
            </TabsList>
          </div>
          <CommandList ref={listRef}>
            <TabsContent value="sinchon">
              <SearchGroup
                name="sinchon"
                buildings={filteredSinchonBuildings as BuildingProps[]}
                handleSelect={handleSelect}
                lang={lang}
              />
            </TabsContent>
            <TabsContent value="songdo">
              <SearchGroup
                name="songdo"
                buildings={filteredSongdoBuildings as BuildingProps[]}
                handleSelect={handleSelect}
                lang={lang}
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
  name: CampusName;
  buildings: BuildingProps[];
  handleSelect: (building: BuildingProps) => void;
  lang: keyof typeof ui;
};

const SearchGroup = ({
  name,
  buildings,
  handleSelect,
  lang,
}: SearchGroupProps) => {
  const t = useTranslations(lang);

  return (
    <CommandGroup className="pt-0">
      {buildings.length === 0 && (
        <div className="py-4 text-center text-sm">
          {lang === 'en' ? 'No results for' : '검색 결과가 없습니다'}&nbsp;
          {t(`${name}_long`)}
          {lang === 'en' ? '.' : ''}
        </div>
      )}
      {buildings.map((building) => {
        return (
          <SearchItem
            key={building.id}
            lang={lang}
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
  lang: keyof typeof ui;
};

const SearchItem = ({ building, handleSelect, lang }: SearchItemProps) => {
  return (
    <CommandItem
      key={building.id}
      value={String(building.id)}
      onSelect={() => handleSelect(building)}
    >
      <div className="flex flex-col">
        <span>{lang === 'en' ? building.name_en : building.name}</span>
        <span className="text-xs text-muted-foreground">
          {lang === 'en' ? building.name : building.name_en}
        </span>
      </div>
    </CommandItem>
  );
};
