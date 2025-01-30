import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import Clock from "./components/Clock";
import InputField from "./components/InputField";
import { useEffect, useState } from "react";

function App() {
  const [urls, setURLs] = useState<string[]>([]);

  const handleLeft = () => {
    const currentURL = document.body.style.backgroundImage.slice(5, -2);
    const currentIndex = urls.indexOf(currentURL);
    if (currentIndex === -1) {
      return;
    }
    const nextIndex = currentIndex - 1;
    if (nextIndex < 0) {
      return;
    }
    document.body.style.background = `url(${urls[nextIndex]}) center/cover no-repeat`;
    localStorage.setItem("background", JSON.stringify(urls));
  }
  const handleRight = () => {
    const currentURL = document.body.style.backgroundImage.slice(5, -2);
    const currentIndex = urls.indexOf(currentURL);
    if (currentIndex === -1) {
      return;
    }
    const nextIndex = currentIndex + 1;
    if (nextIndex >= urls.length) {
      return;
    }
    document.body.style.background = `url(${urls[nextIndex]}) center/cover no-repeat`;
    localStorage.setItem("background", JSON.stringify(urls));
  }

  useEffect(() => {
    const background = localStorage.getItem("background");
    setURLs(background ? JSON.parse(background) : []);
  }, []);

  return (
    <>
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
          <InputField />
        </div>
      </div>
    </>
  );
}

export default App;
