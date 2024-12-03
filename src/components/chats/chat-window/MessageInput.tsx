import React, { useState, useRef, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Paperclip, Send, SmilePlus } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Picker from "emoji-picker-react";

interface MessageInputProps {
  onSendMessage: (message: string, files: File[]) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage }) => {
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [filePreviews, setFilePreviews] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const emojiPickerRef = useRef<HTMLDivElement | null>(null);

  const handleEmojiSelect = (emojiData: { emoji: string }) => {
    setMessage((prevMessage) => prevMessage + emojiData.emoji);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
      setFilePreviews((prevPreviews) => [
        ...prevPreviews,
        ...selectedFiles.map((file) => URL.createObjectURL(file)),
      ]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    setFilePreviews((prevPreviews) => prevPreviews.filter((_, i) => i !== index));
  };

  const handleSendMessage = () => {
    if (message.trim() || files.length > 0) {
      onSendMessage(message, files);
      setMessage("");
      setFiles([]);
      setFilePreviews([]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <footer className="flex items-center space-x-2 p-2 border-b border-t slide-in-right">
      <div className="flex relative items-center space-x-2 flex-1">
        <Label htmlFor="file" className="absolute left-4 items-center cursor-pointer text-muted-foreground hover:text-foreground space-x-2">
          <Paperclip className="w-6 h-6 text-[#149911] cursor-pointer" />
        </Label>
        <Input id={"file"} multiple onChange={handleFileChange} className={"w-48"} type={"file"} style={{ display: 'none' }} />
        <Textarea
          ref={textareaRef}
          className="flex-1 resize-none pl-10 pr-8 focus:ring-2 focus:ring-blue-500"
          placeholder="Type a message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{ maxHeight: "120px" }}
        />
        <button onClick={() => setShowEmojiPicker(!showEmojiPicker)} className="cursor-pointer text-[#149911]  absolute right-2">
          <SmilePlus />
        </button>
      </div>
      <button
        onClick={handleSendMessage}
        disabled={!message.trim() && !filePreviews.length}
        className={`w-6 h-6 cursor-pointer transition-colors ${!message.trim() && !filePreviews.length ? 'hidden' : 'text-[#149911] swing hover:text-primary'}`}
      >
        <Send />
      </button>
      {showEmojiPicker && (
        <div ref={emojiPickerRef} className="absolute bottom-20 right-6">
          <Picker onEmojiClick={handleEmojiSelect} />
        </div>
      )}
      {filePreviews.length > 0 && (
        <div className="absolute bg-muted bottom-20 p-2 rounded-lg flex flex-wrap gap-2">
          <div className="relative inset-0 bg-gray-500 opacity-50 z-10" />
          {files.map((file, index) => {
            const filePreview = filePreviews[index];
            const fileExtension = file.name.split('.').pop()?.toLowerCase();

            if (fileExtension && ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'jfif'].includes(fileExtension)) {
              return (
                <div key={index} className="relative flex flex-col items-center text-center">
                  <img src={filePreview} alt="uploaded" className="w-20 h-auto rounded-lg" />
                  <button onClick={() => handleRemoveFile(index)} className="absolute top-0 right-0 text-red-500">
                    ❌
                  </button>
                </div>
              );
            } else if (fileExtension && ['mp4', 'webm', 'ogg'].includes(fileExtension)) {
              return (
                <div key={index} className="relative flex flex-col items-center text-center">
                  <video
                    src={filePreview}
                    className="w-28 h-28 cursor-pointer rounded"
                    onClick={(e) => e.stopPropagation()}
                    muted
                  />
                  <button onClick={() => handleRemoveFile(index)} className="absolute top-0 right-0 text-red-500">
                    ❌
                  </button>
                </div>
              );
            } else if (fileExtension && ['mp3', 'wav'].includes(fileExtension)) {
              return (
                <div key={index} className="relative flex flex-col items-center text-center">
                  <audio
                    src={filePreview}
                    controls
                    className="w-full max-w-xs h-auto z-20 relative"
                  />
                  <button onClick={() => handleRemoveFile(index)} className="absolute top-0 right-0 text-red-500">
                    ❌
                  </button>
                </div>
              );
            } else {
              return (
                <div key={index} className="relative flex flex-col items-center text-center mt-2 z-20">
                  <span className="text-sm">{file.name}</span>
                  <button onClick={() => handleRemoveFile(index)} className="absolute top-0 right-0 text-red-500">
                    ❌
                  </button>
                </div>
              );
            }
          })}
        </div>
      )}

    </footer>
  );
};

export default MessageInput;