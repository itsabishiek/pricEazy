"use client";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { formatToCompactNumber } from "@/lib/formatters";
import React from "react";
import { Bar, BarChart, XAxis, YAxis } from "recharts";

type ViewsByPPPChartProps = {
  chartData: {
    pppName: string;
    views: number;
  }[];
};

const ViewsByPPPChart: React.FC<ViewsByPPPChartProps> = ({ chartData }) => {
  const chartConfig = {
    views: {
      label: "Visitors",
      color: "hsl(var(--primary))",
    },
  };

  if (chartData.length === 0) {
    return (
      <p className="flex items-center justify-center text-muted-foreground min-h-[150px] max-h-[250px]">
        No data available
      </p>
    );
  }

  const data = chartData.map((d) => ({
    ...d,
    pppName: d.pppName.replace("Parity Group: ", ""),
  }));

  return (
    <ChartContainer
      config={chartConfig}
      className="min-h-[150px] max-h-[250px] w-full"
    >
      <BarChart accessibilityLayer data={data}>
        <XAxis dataKey="pppName" tickLine={false} tickMargin={10} />
        <YAxis
          tickLine={false}
          tickMargin={10}
          allowDecimals={false}
          tickFormatter={formatToCompactNumber}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="views" fill="var(--color-views)" />
      </BarChart>
    </ChartContainer>
  );
};
export default ViewsByPPPChart;
