import { useState, useEffect } from "react";

export default function Clock() {
  const [time, setTime] = useState(new Date());
  const [visitData, setVisitData] = useState<WebsiteVisitData>({});
  interface VisitData {
    timeSpent: number;
    visitCount: number;
    url: string;
  }

  interface WebsiteVisitData {
    [url: string]: VisitData;
  }
const getDomainName = (url: string): string => {
  try {
    const domain = new URL(url).hostname.replace("www.", "");
    return domain;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return url;
  }
};

const getFirstLetter = (url: string): string => {
  const domain = getDomainName(url);
  return domain.charAt(0).toUpperCase();
  };
  
useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    chrome.storage.local.get("visitData", (result: WebsiteVisitData) => {
      const storedData = result.visitData || {};
      const filteredData = Object.entries(storedData).reduce(
        (acc, [url, data]) => {
          if (url.startsWith("http://") || url.startsWith("https://")) {
            acc[url] = data;
          }
          return acc;
        },
        {} as WebsiteVisitData
      );
      setVisitData(filteredData);
    });

    chrome.runtime.sendMessage(
      { type: "getVisitData" },
      (response: WebsiteVisitData) => {
        const filteredData = Object.entries(response || {}).reduce(
          (acc, [url, data]) => {
            if (url.startsWith("http://") || url.startsWith("https://")) {
              acc[url] = data;
            }
            return acc;
          },
          {} as WebsiteVisitData
        );
        const mergedData = {
          ...visitData,
          ...filteredData,
        };

        setVisitData(mergedData);
        chrome.storage.local.set({ visitData: mergedData });
      }
    );
    console.log(visitData);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  return (
    <div className="flex flex-col items-center text-center space-y-3 flex-1">
      <div>
        <p className="text-[5rem] !font-bold time">
          {time
            .toLocaleTimeString("en-IN", {
              timeZone: "Asia/Kolkata",
            })
            .toUpperCase()}
        </p>
        <p className="text-2xl font-bold date">
          {time.toLocaleDateString("en-IN", {
            timeZone: "Asia/Kolkata",
          })}
        </p>
      </div>
      
      <div className="flex items-center justify-around w-[50%]">
        {Object.keys(visitData).length === 0 ? (
          <p>No websites visited yet.</p>
        ) : (
          Object.entries(visitData).map(([url, data]) => {
            const timeSpentMinutes = (data.timeSpent / 1000 / 60).toFixed(2);
            const domain = getDomainName(url);

            return (
              <a
                key={url}
                href={url}
                className="!bg-white/30 !backdrop-blur-none"
              >
                <div className="flex items-center flex-col space-y-3 border p-2 rounded-md">
                  <div className="bg-gray-700 text-white rounded-[100%] flex items-center justify-center py-1 px-4 h-10 w-10">
                    <h2 className="font-semi-bold p-2 text-xl">
                      {getFirstLetter(url)}
                    </h2>
                  </div>
                  <div>
                    <p className="font-bold">{domain}</p>
                    <p>Time Spent: {timeSpentMinutes} mins</p>
                  </div>
                </div>
              </a>
            );
          })
        )}
      </div>
    </div>
  );
}
