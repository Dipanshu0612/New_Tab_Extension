import { useState } from "react";
import { toast } from "react-toastify";

interface InputFieldProps {
  addNewBackground: (newURL: string) => void;
}

export default function InputField({ addNewBackground }: InputFieldProps) {
  const [url, setUrl] = useState("");

  const handleSearch = () => {
    try {
      const newURL = new URL(url);
      const fileExtension = (
        newURL.pathname.split(".").pop() || ""
      ).toLowerCase();
      const allowedExtensions = ["jpg", "jpeg", "png", "gif", "webp"];

      if (!allowedExtensions.includes(fileExtension)) {
        throw new Error("URL does not point to a valid image or GIF");
      }

      addNewBackground(newURL.href);

      setUrl("");
      toast.success("Background applied successfully");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message || "Invalid URL");
      } else {
        toast.error("An unknown error occurred");
      }
      console.error(error);
    }
  };

  return (
    <div className="flex items-center space-x-2 h-[6rem] w-full justify-center">
      <input
        type="text"
        placeholder="Enter the image address to apply at the background..."
        className="border bg-transparent px-4 py-1 rounded-md w-[25%]"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <button
        className="px-3 py-1 rounded-md bg-red-400 hover:bg-red-600"
        onClick={handleSearch}
      >
        Apply
      </button>
    </div>
  );
}
