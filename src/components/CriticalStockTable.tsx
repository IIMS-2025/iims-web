import React from 'react';

interface StockItem {
    name: string;
    stockQty: number;
    unit: string;
    status: 'critical' | 'low';
}

interface CriticalStockTableProps {
    items?: StockItem[];
}

const CriticalStockTable: React.FC<CriticalStockTableProps> = ({
    items = [
        { name: 'Fresh Lettuce', stockQty: 2, unit: 'kg', status: 'critical' },
        { name: 'Chicken Breast', stockQty: 1, unit: 'kg', status: 'critical' },
        { name: 'Tomatoes', stockQty: 3, unit: 'kg', status: 'critical' },
        { name: 'Cheese Slices', stockQty: 15, unit: 'pcs', status: 'low' },
        { name: 'Burger Buns', stockQty: 8, unit: 'pcs', status: 'low' }
    ]
}) => {
    const getStatusIcon = (status: string) => {
        return status === 'critical' ? '🔴' : '⚠️';
    };

    const getStatusColor = (status: string) => {
        return status === 'critical' ? '#ef4444' : '#f59e0b';
    };

    return (
        <div className="critical-stock-table">
            <div className="table-header">
                <h4 className="table-title">Critical Stock Items</h4>
                <span className="table-subtitle">{items.length} items need attention</span>
            </div>

            <div className="table-container">
                <table className="stock-table">
                    <thead>
                        <tr>
                            <th>Status</th>
                            <th>Item Name</th>
                            <th>Stock Remaining</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item, index) => (
                            <tr key={index} className={`table-row ${item.status}`}>
                                <td className="status-cell">
                                    <span className="status-indicator">
                                        {getStatusIcon(item.status)}
                                    </span>
                                </td>
                                <td className="item-name">{item.name}</td>
                                <td className="stock-qty">
                                    <span className="qty-value" style={{ color: getStatusColor(item.status) }}>
                                        {item.stockQty} {item.unit}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="table-footer">
                <div className="legend">
                    <div className="legend-item">
                        <span className="legend-icon">🔴</span>
                        <span className="legend-text">Critical (Immediate action needed)</span>
                    </div>
                    <div className="legend-item">
                        <span className="legend-icon">⚠️</span>
                        <span className="legend-text">Low Stock (Reorder soon)</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CriticalStockTable;
