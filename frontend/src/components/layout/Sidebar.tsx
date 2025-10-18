import React from 'react';
import { Server, Wrench, FileText, Users, DollarSign } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'overview', label: 'Dashboard', icon: Server },
    { id: 'hypotheses', label: 'Hypotheses', icon: Wrench },
    { id: 'papers', label: 'Papers', icon: FileText },
    { id: 'agents', label: 'Agents', icon: Server },
    { id: 'proposals', label: 'Proposals', icon: DollarSign },
  ];

  return (
    <aside className="w-64 bg-[#0D1117] border-r border-[#1E2738] min-h-screen flex-shrink-0">
      <div className="py-8 px-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg mb-1 transition-all ${
                isActive
                  ? 'bg-[#1A1F2E] text-white'
                  : 'text-text-secondary hover:bg-[#1A1F2E]/50 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm">{item.label}</span>
            </button>
          );
        })}
      </div>
    </aside>
  );
};

export default Sidebar;
