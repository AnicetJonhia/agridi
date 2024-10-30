
import { Dialog, DialogTrigger, DialogContent} from "@/components/ui/dialog";

// @ts-ignore
const ImagePreview = ({ fileURL }) => (
  <Dialog>
    <DialogTrigger asChild>
      <img src={fileURL} alt="uploaded" className="w-20 h-20 rounded-lg cursor-pointer" />
    </DialogTrigger>
    <DialogContent className="p-10 max-w-screen-md">
    <img src={fileURL} alt="enlarged" className="w-full h-auto" />
    </DialogContent>
  </Dialog>
);

export default ImagePreview;
