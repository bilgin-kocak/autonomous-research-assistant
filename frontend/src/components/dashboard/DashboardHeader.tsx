import React from 'react';
import { ChevronDown, MoreHorizontal } from 'lucide-react';

interface DashboardHeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'hypotheses', label: 'Hypotheses' },
    { id: 'papers', label: 'Papers' },
    { id: 'agents', label: 'Agents' },
  ];

  const profileImages = [
    'A', 'N', 'M', 'C'
  ];

  return (
    <div className="flex flex-col gap-10 py-10 bg-[#02060d]">
      {/* Title and Actions */}
      <div className="flex items-start justify-between">
        {/* Title and Status */}
        <div className="flex gap-4 items-center">
          <div className="flex gap-1 items-center">
            <h1 className="text-[34px] font-bold leading-10 tracking-tight text-[#d7dce4] font-display">
              ScienceDAO Command Center
            </h1>
            <ChevronDown className="w-6 h-6 text-text-secondary" />
          </div>
          <div className="flex gap-3 items-center justify-center px-3 py-1.5 bg-[rgba(184,199,224,0.12)] rounded-[22px]">
            <div className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
            <span className="text-[15px] font-medium leading-5 text-[#d7dce4]">Active</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 items-start">
          <button className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-[#000205] text-[15px] font-medium leading-5 rounded-[22px] transition-colors">
            Share
          </button>
          <button className="p-3 bg-[#02060d] border-[1.5px] border-[rgba(145,159,182,0.2)] rounded-[22px] hover:border-[rgba(145,159,182,0.4)] transition-colors">
            <MoreHorizontal className="w-5 h-5 text-text-secondary" />
          </button>
        </div>
      </div>

      {/* Profile Avatars */}
      <div className="flex gap-3 items-center">
        <div className="flex isolate pr-1.5">
          {profileImages.map((letter, i) => (
            <div
              key={i}
              className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 border-2 border-[#000205] -mr-1.5 flex items-center justify-center text-white text-xs font-semibold"
              style={{ zIndex: 4 - i }}
            >
              {letter}
            </div>
          ))}
        </div>
        <div className="flex gap-1 items-center text-[15px] leading-5 text-[rgba(209,219,235,0.62)]">
          <span>Ada, Nikola, Marie</span>
          <span>+12 others</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-start border-b border-[rgba(145,159,182,0.2)]">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex gap-2 items-center justify-center px-10 py-4 text-[15px] font-medium leading-5 transition-colors border-b-[1.5px] ${
              activeTab === tab.id
                ? 'text-primary-500 border-primary-500'
                : 'text-[rgba(209,219,235,0.62)] border-transparent hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DashboardHeader;
