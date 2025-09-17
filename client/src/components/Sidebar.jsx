import React, { useState } from "react";
import {
  LayoutDashboard,
  BarChart2,
  Bell,
  Map,
  Settings,
  LifeBuoy,
} from "lucide-react";

const NavItem = ({ icon, text, active, onClick }) => (
  <a
    href="#"
    onClick={onClick}
    className={`flex items-center p-3 my-1 rounded-lg transition-colors duration-200 ${active
        ? "bg-cyan-400/20 text-cyan-300"
        : "text-gray-400 hover:bg-white/10 hover:text-white"
      }`}
  >
    {icon}
    <span className="ml-4 font-medium">{text}</span>
  </a>
);

const Sidebar = () => {
  const [activeItem, setActiveItem] = useState("Dashboard");

  const navItems = [
    { icon: <LayoutDashboard size={20} />, text: "Dashboard" },
    { icon: <BarChart2 size={20} />, text: "Reports" },
    { icon: <Bell size={20} />, text: "Alerts" },
    { icon: <Map size={20} />, text: "Map View" },
  ];

  const helpItems = [
    { icon: <Settings size={20} />, text: "Settings" },
    { icon: <LifeBuoy size={20} />, text: "Support" },
  ];

  return (
    <aside className="w-64 bg-[#142334] p-6 flex-shrink-0 hidden md:flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-3 mb-10">
          <span className="font-['Orbitron'] text-2xl font-bold text-white tracking-wider">
            HealNet
          </span>
        </div>
        <nav>
          {navItems.map((item) => (
            <NavItem
              key={item.text}
              icon={item.icon}
              text={item.text}
              active={activeItem === item.text}
              onClick={() => setActiveItem(item.text)}
            />
          ))}
        </nav>
      </div>
      <nav>
        {helpItems.map((item) => (
          <NavItem
            key={item.text}
            icon={item.icon}
            text={item.text}
            active={activeItem === item.text}
            onClick={() => setActiveItem(item.text)}
          />
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
