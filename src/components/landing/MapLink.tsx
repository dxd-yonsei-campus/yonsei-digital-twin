import { Button } from '@/components/ui/button';
import { selectedCampus } from '@/store';
import type { CampusName } from '@/types/map';
import { useTranslations } from '@/i18n/utils';
import type { ui } from '@/i18n/ui';

type MapLinkProps = {
  campus: CampusName;
  lang: keyof typeof ui;
};

const MapLink = ({ campus, lang }: MapLinkProps) => {
  const t = useTranslations(lang);

  return (
    <Button
      variant="default"
      className="w-full min-w-32 cursor-pointer sm:w-fit"
      asChild
    >
      <a onClick={() => selectedCampus.set(campus)} href={`/${lang}/map`}>
        {t(`${campus}_long`)}
      </a>
    </Button>
  );
};

export default MapLink;
