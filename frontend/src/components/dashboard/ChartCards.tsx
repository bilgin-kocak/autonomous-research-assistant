import React from 'react';
import { MoreHorizontal } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import type { TimeSeriesDataPoint } from '../../utils/mockData';

interface ChartCardsProps {
  papersData: TimeSeriesDataPoint[];
  hypothesesData: TimeSeriesDataPoint[];
}

const ChartCards: React.FC<ChartCardsProps> = ({ papersData, hypothesesData }) => {
  return (
    <div className="py-4 px-0">
      <div className="grid grid-cols-2 gap-10">
        {/* Papers Analyzed Chart */}
        <div className="bg-[rgba(184,199,224,0.12)] border-[1.5px] border-transparent rounded-[22px]">
          <div className="flex flex-col gap-12 pt-10 pb-14 px-10">
            {/* Header */}
            <div className="flex flex-col gap-6 w-full">
              <div className="flex items-center justify-between w-full">
                <p className="font-semibold text-[17px] leading-6 text-[#d7dce4] flex-1">
                  Papers Analyzed
                </p>
                <button className="text-text-tertiary hover:text-text-secondary transition-colors">
                  <MoreHorizontal className="w-6 h-6" />
                </button>
              </div>
              <div className="flex gap-2 items-baseline w-full">
                <p className="font-display font-bold text-[34px] leading-10 tracking-[-0.68px] text-[#d7dce4]">
                  1,284
                </p>
                <p className="font-medium text-[13px] leading-4 text-primary-500 flex-1">
                  +5%
                </p>
              </div>
            </div>

            {/* Chart */}
            <div className="h-[168px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={papersData}>
                  <defs>
                    <linearGradient id="colorPapers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="0" stroke="rgba(145,159,182,0.1)" horizontal={true} vertical={false} />
                  <XAxis
                    dataKey="time"
                    stroke="none"
                    tick={{ fill: 'rgba(209,219,235,0.4)', fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                    interval="preserveStartEnd"
                    tickFormatter={(value) => value.split(' ')[0]}
                  />
                  <YAxis
                    stroke="none"
                    tick={{ fill: 'rgba(209,219,235,0.4)', fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                    width={45}
                    tickFormatter={(value) => value.toString()}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1c2333',
                      border: '1px solid rgba(145,159,182,0.2)',
                      borderRadius: '8px',
                      color: '#d7dce4',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#3b82f6"
                    strokeWidth={2.5}
                    fill="url(#colorPapers)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Hypotheses Generated Chart */}
        <div className="bg-[rgba(184,199,224,0.12)] border-[1.5px] border-transparent rounded-[22px]">
          <div className="flex flex-col gap-12 pt-10 pb-14 px-10">
            {/* Header */}
            <div className="flex flex-col gap-6 w-full">
              <div className="flex items-center justify-between w-full">
                <p className="font-semibold text-[17px] leading-6 text-[#d7dce4] flex-1">
                  Hypotheses Generated
                </p>
                <button className="text-text-tertiary hover:text-text-secondary transition-colors">
                  <MoreHorizontal className="w-6 h-6" />
                </button>
              </div>
              <div className="flex gap-2 items-baseline w-full">
                <p className="font-display font-bold text-[34px] leading-10 tracking-[-0.68px] text-[#d7dce4]">
                  567
                </p>
                <p className="font-medium text-[13px] leading-4 text-primary-500 flex-1">
                  +3%
                </p>
              </div>
            </div>

            {/* Chart */}
            <div className="h-[168px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={hypothesesData}>
                  <defs>
                    <linearGradient id="colorHypotheses" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="0" stroke="rgba(145,159,182,0.1)" horizontal={true} vertical={false} />
                  <XAxis
                    dataKey="time"
                    stroke="none"
                    tick={{ fill: 'rgba(209,219,235,0.4)', fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                    interval="preserveStartEnd"
                    tickFormatter={(value) => value.split(' ')[0]}
                  />
                  <YAxis
                    stroke="none"
                    tick={{ fill: 'rgba(209,219,235,0.4)', fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                    width={45}
                    tickFormatter={(value) => value.toString()}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1c2333',
                      border: '1px solid rgba(145,159,182,0.2)',
                      borderRadius: '8px',
                      color: '#d7dce4',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#3b82f6"
                    strokeWidth={2.5}
                    fill="url(#colorHypotheses)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartCards;
