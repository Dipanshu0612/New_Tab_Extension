import { useState, useEffect } from "react";

export default function Clock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center text-center space-y-4 flex-1">
      <p className="text-[5rem] !font-bold time">
        {time.toLocaleTimeString("en-IN", {
          timeZone: "Asia/Kolkata",
        }).toUpperCase()}
      </p>
      <p className="text-2xl font-bold date">
        {time.toLocaleDateString("en-IN", {
          timeZone: "Asia/Kolkata",
        })}
      </p>
    </div>
  );
}
