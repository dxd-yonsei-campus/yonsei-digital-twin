import { BorderBeam } from '@/components/magicui/border-beam';
import { Card, CardContent } from '@/components/ui/card';

const HeroVideo = () => {
  return (
    <Card className="relative max-w-3xl overflow-hidden py-1.5">
      <CardContent className="px-1.5">
        <video
          className="aspect-video h-auto w-3xl rounded-lg"
          src="/hero-video.mp4"
          autoPlay
          muted
          loop
          playsInline
        ></video>
      </CardContent>
      <BorderBeam
        duration={9}
        size={500}
        className="hidden from-transparent via-primary to-transparent xs:block"
      />
      <BorderBeam
        duration={9}
        size={500}
        delay={3}
        className="hidden from-transparent via-primary to-transparent xs:block"
      />
      <BorderBeam
        duration={9}
        size={500}
        delay={6}
        className="hidden from-transparent via-primary to-transparent xs:block"
      />
      <BorderBeam
        duration={9}
        size={300}
        className="block from-transparent via-primary to-transparent xs:hidden"
      />
      <BorderBeam
        duration={9}
        size={300}
        delay={4.5}
        className="block from-transparent via-primary to-transparent xs:hidden"
      />
    </Card>
  );
};

export default HeroVideo;
