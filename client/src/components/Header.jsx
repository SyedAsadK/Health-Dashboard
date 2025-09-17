import React, { useState, useEffect } from "react";
import { Sun } from "lucide-react"; // Using lucide-react for icons

const Header = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    // Set up an interval to update the time every second
    const timerId = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);

    // Clean up the interval when the component unmounts
    return () => {
      clearInterval(timerId);
    };
  }, []);

  // Format the date and time
  const formattedTime = currentDate.toLocaleString("en-US", {
    weekday: "long",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });

  return (
    <header className="flex justify-between items-center">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-cyan-400 font-['Orbitron'] tracking-wide">
          Outbreak Analytics
        </h1>
        <p className="text-sm text-gray-400">
          Bhubaneswar, Odisha | {formattedTime}
        </p>
      </div>
      <div className="flex items-center gap-4">
        <button className="p-2 rounded-full hover:bg-white/10 transition-colors">
          <Sun size={20} className="text-gray-300" />
        </button>
        <div className="flex items-center gap-3">
          <img
            src="https://placehold.co/40x40/00F2E5/0D1B2A?text=AS"
            alt="User Avatar"
            className="w-10 h-10 rounded-full border-2 border-cyan-400"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
