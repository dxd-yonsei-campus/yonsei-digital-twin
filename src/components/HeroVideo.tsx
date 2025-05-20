import { BorderBeam } from "@/components/magicui/border-beam";
import { Card, CardContent } from "@/components/ui/card";

const HeroVideo = () => {
  return (
    <Card className="relative overflow-hidden max-w-3xl py-2">
      <CardContent className="px-2">
        <video
          className="w-full aspect-video object-fill rounded-lg"
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
