import type { ui } from '@/i18n/ui';
import { cn } from '@/lib/utils';
import yonseiLogoDark from '@/assets/public/yonsei-logo-dark.png';
import yonseiLogoDarkKo from '@/assets/public/yonsei-logo-dark-ko.png';
import yonseiLogoLight from '@/assets/public/yonsei-logo-light.png';
import yonseiLogoLightKo from '@/assets/public/yonsei-logo-light-ko.png';
import fundingSourceLogoLight from '@/assets/public/funding-source-logo-light.png';
import fundingSourceLogoDark from '@/assets/public/funding-source-logo-dark.png';

type NavbarCreditsProps = {
  className?: string;
  lang: keyof typeof ui;
};

const NavbarCredits = ({ className, lang }: NavbarCreditsProps) => {
  return (
    <div className={cn('flex gap-3', className)}>
      <div className="hidden @xl/navbar:block">
        <img
          className="hidden h-8 w-auto dark:block"
          src={lang === 'en' ? yonseiLogoDark.src : yonseiLogoDarkKo.src}
          alt="Yonsei University"
        />
        <img
          className="block h-8 w-auto dark:hidden"
          src={lang === 'en' ? yonseiLogoLight.src : yonseiLogoLightKo.src}
          alt="Yonsei University"
        />
      </div>
      <div>
        <img
          className="hidden h-8 w-auto dark:block"
          src={fundingSourceLogoDark.src}
          alt="Yonsei University"
        />
        <img
          className="block h-8 w-auto dark:hidden"
          src={fundingSourceLogoLight.src}
          alt="Yonsei University"
        />
      </div>
    </div>
  );
};

export default NavbarCredits;
