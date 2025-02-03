import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import Clock from "./components/Clock";
import InputField from "./components/InputField";
import { useEffect, useState } from "react";

function App() {
  const [urls, setURLs] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  useEffect(() => {
    const storedURLs = localStorage.getItem("background");
    const parsedURLs = storedURLs ? JSON.parse(storedURLs) : [];
    setURLs(parsedURLs);
    const index = localStorage.getItem("backgroundIndex");
    if (!index) {
      localStorage.setItem("backgroundIndex", "0");
    } else {
      setCurrentIndex(parseInt(index));
    }
    if (parsedURLs.length > 0) {
      document.body.style.background = `url(${parsedURLs[currentIndex]}) center/cover no-repeat`;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (urls.length > 0) {
      document.body.style.background = `url(${urls[currentIndex]}) center/cover no-repeat`;
      localStorage.setItem("backgroundIndex", currentIndex.toString());
    }
  }, [urls, currentIndex]);

  const handleLeft = () => {
    setCurrentIndex((prevIndex) => {
      const newIndex = prevIndex - 1;
      if (newIndex >= 0) {
        return newIndex;
      }
      return prevIndex;
    });
  };

  const handleRight = () => {
    setCurrentIndex((prevIndex) => {
      const newIndex = prevIndex + 1;
      if (newIndex < urls.length) {
        return newIndex;
      }
      return prevIndex;
    });
  };

  const addNewBackground = (newURL: string) => {
    setURLs((prevURLs) => {
      const updatedURLs = [...prevURLs, newURL];
      localStorage.setItem("background", JSON.stringify(updatedURLs));
      return updatedURLs;
    });
    setCurrentIndex((prevIndex) => prevIndex + 1);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen w-full">
      <div className="flex items-center justify-center h-screen w-full">
        <button className="cursor-pointer">
          <FaAngleLeft className="text-4xl ml-5" onClick={handleLeft} />
        </button>
        <Clock />
        <button className="cursor-pointer">
          <FaAngleRight className="text-4xl mr-5" onClick={handleRight} />
        </button>
      </div>
      <div className="w-full flex justify-center">
        <InputField addNewBackground={addNewBackground} />
      </div>
    </div>
  );
}

export default App;
