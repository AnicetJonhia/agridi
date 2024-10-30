import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";

// @ts-ignore
const VideoPreview = ({ fileURL }) => (
  <Dialog>
    <DialogTrigger asChild>
      <video
        src={fileURL}
        poster // Utilise le premier frame de la vidéo comme miniature
        className="w-28 h-28 cursor-pointer rounded"
        onClick={(e) => e.stopPropagation()} // Pour empêcher le clic sur la vidéo
        muted // Assurez-vous que la vidéo ne se lance avec le son
      />
    </DialogTrigger>
    <DialogContent className="p-10 max-w-screen-lg">
      <video src={fileURL} controls autoPlay className="w-full h-auto" />
    </DialogContent>
  </Dialog>
);

export default VideoPreview;
