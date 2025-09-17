import React from "react";

const StatCard = ({ title, value, change, isWarning }) => {
  const changeColor = isWarning ? "text-amber-400" : "text-green-400";

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 shadow-lg">
      <h3 className="text-sm font-medium text-gray-400">{title}</h3>
      <p className="text-3xl font-semibold text-white mt-2">{value}</p>
      <p className={`text-xs mt-1 ${changeColor}`}>{change}</p>
    </div>
  );
};

export default StatCard;
