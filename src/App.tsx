import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import Clock from "./components/Clock";
import InputField from "./components/InputField";
import { useEffect, useState } from "react";

function App() {
  const [urls, setURLs] = useState<string[]>([]);

  useEffect(() => {
    const currentURL = getComputedStyle(document.body).backgroundImage.slice(5,-2);
    if (urls.length > 0 && !currentURL) {
      document.body.style.background = `url(${urls[0]}) center/cover no-repeat`;
    }
  }, [urls]);

  const handleLeft = () => {
    const currentURL = getComputedStyle(document.body).backgroundImage.slice(5,-2);
    const currentIndex = urls.indexOf(currentURL);

    if (currentIndex === -1) {
      return;
    }

    const nextIndex = currentIndex - 1;
    if (nextIndex >= 0) {
      document.body.style.background = `url(${urls[nextIndex]}) center/cover no-repeat`;
      setURLs((prev) => [...prev]);
    }
  };

  const handleRight = () => {
    const currentURL = getComputedStyle(document.body).backgroundImage.slice(5,-2);
    const currentIndex = urls.indexOf(currentURL);

    if (currentIndex === -1) {
      return;
    }

    const nextIndex = currentIndex + 1;
    if (nextIndex < urls.length) {
      document.body.style.background = `url(${urls[nextIndex]}) center/cover no-repeat`;
      setURLs((prev) => [...prev]);
    }
  };

  useEffect(() => {
    const storedURLs = localStorage.getItem("background");
    setURLs(storedURLs ? JSON.parse(storedURLs) : []);
  }, []);

  const addNewBackground = (newURL: string) => {
    setURLs((prevURLs) => {
      const updatedURLs = [...prevURLs, newURL];
      localStorage.setItem("background", JSON.stringify(updatedURLs));
      return updatedURLs;
    });
    document.body.style.background = `url(${newURL}) center/cover no-repeat`;
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
