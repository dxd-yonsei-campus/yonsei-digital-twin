import { BorderBeam } from "@/components/magicui/border-beam";
import { Card, CardContent } from "@/components/ui/card";

const HeroVideo = () => {
  return (
    <Card className="relative overflow-hidden max-w-3xl py-1.5">
      <CardContent className="px-1.5">
        <video
          className="rounded-lg"
          src="/hero-video.mp4"
          autoPlay
          muted
          loop
        ></video>
      </CardContent>
      <BorderBeam
        duration={8}
        size={400}
        className="from-transparent via-primary to-transparent"
      />
      <BorderBeam
        duration={8}
        size={400}
        delay={4}
        className="from-transparent via-primary to-transparent"
      />
    </Card>
  );
};

export default HeroVideo;
