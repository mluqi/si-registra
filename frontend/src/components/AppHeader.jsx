import React, { useState, useEffect } from "react";

const AppHeader = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Get current date in Indonesian format
  const getCurrentDate = () => {
    const days = [
      "Minggu",
      "Senin",
      "Selasa",
      "Rabu",
      "Kamis",
      "Jumat",
      "Sabtu",
    ];
    const months = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ];

    const now = new Date();
    const dayName = days[now.getDay()];
    const day = now.getDate();
    const month = months[now.getMonth()];
    const year = now.getFullYear();

    return `${dayName}, ${day} ${month} ${year}`;
  };

  const getCurrentTime = () => {
    const hours = String(currentTime.getHours()).padStart(2, "0");
    const minutes = String(currentTime.getMinutes()).padStart(2, "0");
    const seconds = String(currentTime.getSeconds()).padStart(2, "0");

    return `${hours}:${minutes}:${seconds}`;
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 shadow-lg z-50">
      <div className="px-6 py-1">
        <div className="flex justify-between items-start">
          {/* Left Section - Title */}
          <div className="text-white py-2">
            <img src="/logo.png" alt="SI-REGISTRA Logo" className="h-16" />
          </div>

          {/* Right Section - Location & Date */}
          <div className="text-right text-white py-4">
            <h2 className="text-md font-semibold mb-1">
              Pengadilan Negeri Singaraja
            </h2>
            <div className="flex items-center justify-end gap-3 text-blue-100 text-xs font-light">
              <span>{getCurrentDate()}</span>
              <span>{getCurrentTime()}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
