import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getRestockItems, bulkUpdateRestockItems } from "../services/api";
import {
  setLoading,
  setError,
  setRestockItems,
  toggleItemSelection,
  selectAllItems,
  clearSelection,
  setCategoryFilter,
  selectRestockItems,
  selectSelectedItems,
  selectRestockFilter,
  selectRestockLoading,
  selectFilteredRestockItems,
  selectRestockStats,
  setBulkOperationsLoading,
  updateMultipleRestockItems,
} from "../store/slices/restockSlice";
import Tabs from "../components/Tabs";
import type { RootState } from "../store";
import type { RestockItem, RestockPriority, RestockStatus } from "../types";
import type { Tab } from "../components/Tabs";

export default function RestockList() {
  const dispatch = useDispatch();
  const items = useSelector(selectRestockItems);
  const filteredItems = useSelector(selectFilteredRestockItems);
  const selectedItems = useSelector(selectSelectedItems);
  const filter = useSelector(selectRestockFilter);
  const loading = useSelector(selectRestockLoading);
  const stats = useSelector(selectRestockStats);
  const bulkLoading = useSelector(
    (state: RootState) => state.restock.bulkOperationsLoading
  );

  const [activeTab, setActiveTab] = useState("raw");
  const [sortBy, setSortBy] = useState<string>("priority");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [showExportModal, setShowExportModal] = useState(false);
  const [categoryFilter, setCategoryFilterLocal] = useState<string>("all");

  useEffect(() => {
    loadRestockItems();
  }, [dispatch, filter]);

  const loadRestockItems = async () => {
    try {
      dispatch(setLoading(true));
      const response = await getRestockItems(filter);
      dispatch(setRestockItems(response.data));
    } catch (error) {
      dispatch(
        setError(
          error instanceof Error
            ? error.message
            : "Failed to load restock items"
        )
      );
    }
  };

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    if (tabId === "raw") {
      dispatch(setCategoryFilter("raw"));
    } else if (tabId === "sub_product") {
      dispatch(setCategoryFilter("sub_product"));
    } else {
      dispatch(setCategoryFilter(undefined));
    }
  };

  const handleItemSelection = (itemId: string) => {
    dispatch(toggleItemSelection(itemId));
  };

  const handleSelectAll = () => {
    if (selectedItems.length === filteredItems.length) {
      dispatch(clearSelection());
    } else {
      dispatch(selectAllItems(filteredItems.map((item) => item.id)));
    }
  };

  const handleBulkPriorityUpdate = async (priority: RestockPriority) => {
    if (selectedItems.length === 0) return;

    try {
      dispatch(setBulkOperationsLoading(true));
      const updates = selectedItems.map((id) => ({
        id,
        updates: { priority },
      }));

      const response = await bulkUpdateRestockItems(updates);
      dispatch(updateMultipleRestockItems(response.data));
      dispatch(clearSelection());
    } catch (error) {
      dispatch(
        setError(
          error instanceof Error ? error.message : "Failed to update priorities"
        )
      );
    }
  };

  const handleBulkStatusUpdate = async (status: RestockStatus) => {
    if (selectedItems.length === 0) return;

    try {
      dispatch(setBulkOperationsLoading(true));
      const updates = selectedItems.map((id) => ({
        id,
        updates: { status },
      }));

      const response = await bulkUpdateRestockItems(updates);
      dispatch(updateMultipleRestockItems(response.data));
      dispatch(clearSelection());
    } catch (error) {
      dispatch(
        setError(
          error instanceof Error ? error.message : "Failed to update status"
        )
      );
    }
  };

  const handleExportList = () => {
    const selectedData = filteredItems.filter((item) =>
      selectedItems.includes(item.id)
    );
    const dataToExport = selectedData.length > 0 ? selectedData : filteredItems;

    // Create CSV content
    const headers = [
      "Item Name",
      "Category",
      "Current Stock",
      "Required Quantity",
      "Unit",
      "Priority",
      "Estimated Cost",
    ];
    const csvContent = [
      headers.join(","),
      ...dataToExport.map((item) =>
        [
          `"${item.product_name}"`,
          `"${item.category}"`,
          item.current_stock,
          item.required_quantity,
          `"${item.unit}"`,
          `"${item.priority}"`,
          item.estimated_cost.toFixed(2),
        ].join(",")
      ),
    ].join("\n");

    // Download CSV
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `restock-list-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setShowExportModal(false);
  };

  const getPriorityColor = (priority: RestockPriority) => {
    switch (priority) {
      case "critical":
        return "critical";
      case "high":
        return "high";
      case "medium":
        return "medium";
      case "low":
        return "low";
      default:
        return "medium";
    }
  };

  const getStatusColor = (status: RestockStatus) => {
    switch (status) {
      case "pending":
        return "pending";
      case "ordered":
        return "ordered";
      case "received":
        return "received";
      case "cancelled":
        return "cancelled";
      default:
        return "pending";
    }
  };

  // Define category tabs
  const categoryTabs: Tab[] = [
    {
      id: "raw",
      label: "Raw Materials",
      icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M8 2L14 6V14L8 10L2 14V6L8 2Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      count: items.filter(
        (item) =>
          item.category.toLowerCase().includes("vegetables") ||
          item.category.toLowerCase().includes("dairy") ||
          item.category.toLowerCase().includes("meat") ||
          item.category.toLowerCase().includes("herbs") ||
          item.category.toLowerCase().includes("oils")
      ).length,
    },
    {
      id: "sub_product",
      label: "Sub Products",
      icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M8 1L15 8L8 15L1 8L8 1Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      count: items.filter(
        (item) =>
          item.category.toLowerCase().includes("bakery") ||
          item.category.toLowerCase().includes("sauce") ||
          item.category.toLowerCase().includes("base")
      ).length,
    },
  ];

  const sortedItems = [...filteredItems].sort((a, b) => {
    let aVal: any = a[sortBy as keyof RestockItem];
    let bVal: any = b[sortBy as keyof RestockItem];

    if (sortBy === "priority") {
      const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      aVal = priorityOrder[a.priority];
      bVal = priorityOrder[b.priority];
    }

    if (typeof aVal === "string") {
      aVal = aVal.toLowerCase();
      bVal = bVal.toLowerCase();
    }

    if (sortOrder === "asc") {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });

  return (
    <div>
      <>
        {/* Category Tabs with Controls */}
        <Tabs
          tabs={categoryTabs}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          rightContent={
            <div className="tabs-right-content">
              <select
                value={categoryFilter}
                onChange={(e) => {
                  setCategoryFilterLocal(e.target.value);
                  if (e.target.value === "all") {
                    dispatch(setCategoryFilter(undefined));
                  } else {
                    dispatch(setCategoryFilter(e.target.value));
                  }
                }}
                className="filter-select"
              >
                <option value="all">All Categories</option>
                <option value="vegetables">Vegetables</option>
                <option value="dairy">Dairy</option>
                <option value="meat">Meat</option>
                <option value="herbs">Herbs</option>
                <option value="oils">Oils & Spices</option>
                <option value="bakery">Bakery</option>
              </select>

              <button
                className="export-btn-inline"
                onClick={handleExportList}
                disabled={bulkLoading}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M8 10L5 7M8 10L11 7M8 10V2"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M2 14H14"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
                Export List
              </button>
            </div>
          }
        />

        <div className="restock-container">
          {/* Restock Table */}
          <div className="restock-table-container">
            <table className="restock-table">
              <thead>
                <tr>
                  <th className="checkbox-col">
                    <input
                      type="checkbox"
                      checked={
                        selectedItems.length === filteredItems.length &&
                        filteredItems.length > 0
                      }
                      onChange={handleSelectAll}
                      className="table-checkbox"
                    />
                  </th>
                  <th>Item Name</th>
                  <th>Category</th>
                  <th>Current Stock</th>
                  <th>
                    <div className="header-content">
                      <span>Forecasted</span>
                      <span>Requirement</span>
                    </div>
                  </th>
                  <th>
                    <div className="header-content">
                      <span>Estimated</span>
                      <span>Cost</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedItems.map((item) => (
                  <tr key={item.id} className="table-row">
                    <td className="checkbox-col">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.id)}
                        onChange={() => handleItemSelection(item.id)}
                        className="table-checkbox"
                      />
                    </td>

                    <td className="name-cell">
                      <div className="item-name">{item.product_name}</div>
                    </td>

                    <td className="category-cell">
                      <span
                        className={`category-badge category-${item.category
                          .toLowerCase()
                          .replace(/[^a-z]/g, "")}`}
                      >
                        {item.category}
                      </span>
                    </td>

                    <td className="stock-cell">
                      <div className="stock-info">
                        <span className="quantity">
                          {item.current_stock} {item.unit}
                        </span>
                      </div>
                    </td>

                    <td className="requirement-cell">
                      <div className="requirement-info">
                        <span className="requirement-quantity">
                          {item.required_quantity} {item.unit}
                        </span>
                        <span className="requirement-period">
                          Next {item.forecast_period_days} days
                        </span>
                      </div>
                    </td>

                    <td className="cost-cell">
                      <div className="cost-info">
                        <span className="total-cost">
                          ${item.estimated_cost.toFixed(2)}
                        </span>
                        <span className="unit-price">
                          @${item.price_per_unit.toFixed(2)}/{item.unit}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer Controls */}
          <div className="restock-footer">
            <div className="selection-info">
              <span className="selection-count">
                {selectedItems.length} items selected
              </span>
              <div className="selection-actions">
                <button
                  className="select-all-btn select-all"
                  onClick={handleSelectAll}
                >
                  Select All
                </button>
                <button
                  className="clear-selection-btn clear-selection"
                  onClick={() => dispatch(clearSelection())}
                >
                  Clear Selection
                </button>
              </div>
            </div>
          </div>

          {/* Pagination */}
          {sortedItems.length > 0 && (
            <div className="restock-pagination">
              <div className="entries-info">
                Showing 1 to {Math.min(sortedItems.length, 6)} of {stats.total}{" "}
                entries
              </div>
              <div className="pagination-controls">
                <button className="page-btn">‹</button>
                <button className="page-btn active">1</button>
                <button className="page-btn">2</button>
                <button className="page-btn">3</button>
                <button className="page-btn">4</button>
                <button className="page-btn">›</button>
              </div>
            </div>
          )}
        </div>
      </>
    </div>
  );
}
