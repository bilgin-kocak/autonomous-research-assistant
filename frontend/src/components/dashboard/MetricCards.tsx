import React from 'react';
import { MoreHorizontal } from 'lucide-react';
import type { AgentStatus } from '../../types';

interface MetricCardsProps {
  status: AgentStatus | null;
}

const MetricCards: React.FC<MetricCardsProps> = ({ status }) => {
  const metrics = [
    {
      label: 'Papers Analyzed',
      value: status?.papers_analyzed?.toLocaleString() || '1,284',
      trend: '+5%',
    },
    {
      label: 'Hypotheses Generated',
      value: status?.hypotheses_generated?.toLocaleString() || '567',
      trend: '+3%',
    },
    {
      label: 'Active Proposals',
      value: status?.proposals_created?.toLocaleString() || '45',
      trend: '+2%',
    },
    {
      label: 'Total Funding',
      value: '$1,000,000',
      trend: '+10%',
    },
  ];

  return (
    <div className="py-4 px-0">
      <div className="grid grid-cols-4 gap-[40px]">
        {metrics.map((metric, index) => (
          <div
            key={index}
            className="bg-[rgba(184,199,224,0.12)] border-[1.5px] border-transparent rounded-[22px] relative"
          >
            <div className="flex flex-col gap-6 p-10">
              {/* Header */}
              <div className="flex items-center justify-between w-full">
                <p className="font-semibold text-[17px] leading-6 text-[#d7dce4] truncate flex-1 whitespace-nowrap overflow-hidden">
                  {metric.label}
                </p>
                <button className="text-text-tertiary hover:text-text-secondary transition-colors">
                  <MoreHorizontal className="w-6 h-6" />
                </button>
              </div>

              {/* Number and Trend */}
              <div className="flex flex-col gap-1 w-full">
                <p className="font-display font-bold text-[34px] leading-10 tracking-[-0.68px] text-[#d7dce4] whitespace-nowrap overflow-hidden text-ellipsis">
                  {metric.value}
                </p>
                <p className="font-medium text-[13px] leading-4 text-primary-500">
                  {metric.trend}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MetricCards;
