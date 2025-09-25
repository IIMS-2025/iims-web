import React from 'react';

interface ChartData {
    day: string;
    sales: number;
    cogs: number;
}

interface SalesCogsChartProps {
    data?: ChartData[];
    title?: string;
}

const SalesCogsChart: React.FC<SalesCogsChartProps> = ({
    data = [
        { day: 'Yesterday', sales: 4947, cogs: 2150 }
    ],
    title = 'Sales Trend & COGS'
}) => {
    const maxValue = Math.max(...data.map(d => Math.max(d.sales, d.cogs)));
    const yAxisMax = 5000; // Fixed max value to match the image
    const yAxisSteps = [5000, 4000, 3000, 2000, 1500, 0]; // Top to bottom order

    const getBarHeight = (value: number) => {
        return (value / yAxisMax) * 200; // 200px is our chart height
    };

    const formatCurrency = (value: number) => {
        if (value >= 1000) {
            return `₹${(value / 1000).toFixed(1)}k`;
        }
        return `₹${value}`;
    };

    return (
        <div className="sales-cogs-chart">
            <div className="chart-header">
                <h3 className="chart-title">{title}</h3>
            </div>

            <div className="chart-container">
                {/* Y-axis labels */}
                <div className="y-axis">
                    {yAxisSteps.map((step, index) => (
                        <div key={index} className="y-axis-label">
                            {formatCurrency(step)}
                        </div>
                    ))}
                </div>

                {/* Chart area */}
                <div className="chart-area">
                    <div className="chart-grid">
                        {yAxisSteps.map((_, index) => (
                            <div key={index} className="grid-line" />
                        ))}
                    </div>

                    <div className="bars-container">
                        {data.map((item, index) => (
                            <div key={index} className="bar-group">
                                <div className="bars">
                                    {/* Sales bar (green) */}
                                    <div
                                        className="bar sales-bar"
                                        style={{ height: `${getBarHeight(item.sales)}px` }}
                                    />
                                    {/* COGS bar (orange) */}
                                    <div
                                        className="bar cogs-bar"
                                        style={{ height: `${getBarHeight(item.cogs)}px` }}
                                    />
                                </div>
                                <div className="day-label">{item.day}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Legend */}
            <div className="chart-legend">
                <div className="legend-item">
                    <div className="legend-color sales-legend"></div>
                    <span>Sales</span>
                </div>
                <div className="legend-item">
                    <div className="legend-color cogs-legend"></div>
                    <span>COGS</span>
                </div>
            </div>
        </div>
    );
};

export default SalesCogsChart;
