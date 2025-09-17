import React from "react";
import { AlertTriangle, Info, ShieldCheck } from "lucide-react";

const AlertFeed = ({ alerts }) => {
  const getAlertDetails = (type) => {
    switch (type) {
      case "critical":
        return {
          icon: <AlertTriangle size={20} className="text-red-400" />,
          borderColor: "border-red-400",
        };
      case "warning":
        return {
          icon: <Info size={20} className="text-amber-400" />,
          borderColor: "border-amber-400",
        };
      case "info":
      default:
        return {
          icon: <ShieldCheck size={20} className="text-cyan-400" />,
          borderColor: "border-cyan-400",
        };
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 shadow-lg">
      <h2 className="text-lg font-semibold text-white mb-4">Recent Alerts</h2>
      <ul className="space-y-4">
        {alerts.map((alert, index) => {
          const { icon, borderColor } = getAlertDetails(alert.type);
          return (
            <li
              key={index}
              className={`flex items-start gap-4 p-3 bg-white/5 rounded-lg border-l-4 ${borderColor}`}
            >
              <div className="flex-shrink-0 mt-1">{icon}</div>
              <p className="text-sm text-gray-300">{alert.message}</p>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default AlertFeed;
