import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { colors } from '../styles/colors';
import { useGetSalesDataQuery } from '../services/inventoryInsightsApi';
import RevenueInsights from './components/RevenueInsights';
import InventoryInsights from './components/InventoryInsights';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const TABS = ['Inventory', 'Revenue',];

export default function OrdersInsights() {
    const [activeTab, setActiveTab] = useState('Inventory');
    const navigate = useNavigate();

    const { isLoading } = useGetSalesDataQuery({});

    if (isLoading) {
        return (
            <div className="orders-insights-page w-full h-full flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading sales data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="orders-insights-page w-full h-full">
            <section className="w-full flex flex-col min-h-fit">
                <div className="px-4 py-4 pb-16 bg-gray-50 w-full min-h-fit">
                    {/* Navigation Tabs */}
                    <div className="flex gap-2 mb-8 border-b border-gray-200 pb-2">
                        {TABS.map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`${tab === 'Revenue' ? 'user-guide-revenue-insights-tab' : 'user-guide-inventory-insights-tab'} px-4 py-2 border-none rounded-md text-sm font-semibold cursor-pointer transition-colors duration-200 ${activeTab === tab ? 'text-white' : 'bg-transparent text-gray-500 hover:text-gray-700'
                                    }`}
                                style={{
                                    background: activeTab === tab ? colors.primary : 'transparent',
                                    borderBottom: activeTab === tab ? `2px solid ${colors.primary}` : 'none'
                                }}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Content based on active tab */}
                    {activeTab === 'Revenue' && <RevenueInsights />}
                    {activeTab === 'Inventory' && <InventoryInsights />}
                </div>
            </section>
        </div>
    );
}
