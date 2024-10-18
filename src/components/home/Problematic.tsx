import HeroVideoDialog from "@/components/ui/hero-video-dialog";
import problematic from "@/assets/images/auth/problematic.png";

export default function Problematic() {
  return (
    <div className="relative md:w-[1000px]">
      <h2 className="text-3xl font-bold text-start mb-6 dark:text-white">Problematic</h2>
      <HeroVideoDialog
        animationStyle="top-in-bottom-out"
        videoSrc="https://www.youtube.com/embed/qh3NGpYRG3I?si=4rb-zSdDkVK9qxxb"
        thumbnailSrc={problematic}
        thumbnailAlt="Hero Video"
      />
    </div>
  );
}
