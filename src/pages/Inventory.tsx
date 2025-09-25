import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setInventory } from "../store/slices/inventorySlice";
// Layout provides Sidebar and Header
import Tabs from "../components/Tabs";
import {
  TotalItemsIcon,
  ExpiringSoonIcon,
  LowStockIcon,
  DeadStockIcon,
  ListIcon,
  BoxIcon,
  DiamondIcon,
  SearchIcon,
  FilterIcon,
  UpdateStockIcon,
  CartOutlineIcon,
  CloseIcon,
} from "../components/icons/InventoryIcons";

import { productIcon } from "../assets";
import StockUpdateModal from "../components/StockUpdateModal";
import type { RootState } from "../store";
import type { Inventory } from "../types";
import type { Tab } from "../components/Tabs";
import {
  useGetInventoryQuery,
} from "../services/inventoryApi";

export default function InventoryPage() {
  const dispatch = useDispatch();
  const inventoryItems = useSelector((s: RootState) => s.inventory.items || []);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [activeProductType, setActiveProductType] = useState("all");
  const [quickFilter, setQuickFilter] = useState<string | null>(null);
  const [showRestockModal, setShowRestockModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Inventory | null>(null);
  const [restockQuantity, setRestockQuantity] = useState("");
  const [showStockUpdateModal, setShowStockUpdateModal] = useState(false);
  const [filteredItems, setFilteredItems] = useState<Inventory[]>([]);

  const { data: inventory } = useGetInventoryQuery();

  const { inventoryList, summary } = inventory || {};

  useEffect(() => {
    if (inventoryList) {
      dispatch(setInventory(inventoryList));
    }
  }, [dispatch, inventoryList]);

  useEffect(() => {
    if (activeProductType !== "all") {
      setFilteredItems(
        inventoryItems?.filter((item) => item.type === activeProductType)
      );
    } else {
      setFilteredItems(inventoryItems);
    }
  }, [activeProductType, inventoryItems]);


  const handleQuickFilterClick = (filterType: string) => {
    if (filterType === "total") {
      // Clear all filters
      setQuickFilter(null);
      setFilterStatus("all");
    } else if (quickFilter === filterType) {
      // If same filter is clicked, clear it
      setQuickFilter(null);
      setFilterStatus("all");
    } else {
      // Set new filter
      setQuickFilter(filterType);
      if (filterType === "low") {
        setFilterStatus(filterType);
      } else {
        setFilterStatus("all");
      }
    }
  };

  const handleAddToRestock = (item: Inventory) => {
    setSelectedItem(item);
    setRestockQuantity("");
    setShowRestockModal(true);
  };

  const handleConfirmRestock = () => {
    if (selectedItem && restockQuantity && parseFloat(restockQuantity) > 0) {
      // Here you would typically call an API to add to restock list
      setShowRestockModal(false);
      setSelectedItem(null);
      setRestockQuantity("");
    }
  };

  const handleCancelRestock = () => {
    setShowRestockModal(false);
    setSelectedItem(null);
    setRestockQuantity("");
  };

const handleStockUpdateSuccess = () => {
  setShowStockUpdateModal(false);
  // TODO: Add success notification
};

const handleStockUpdateError = (error: any) => {
  console.error('Failed to update stock:', error);
  // TODO: Add error notification
};

  // Define product type tabs
  const productTypeTabs: Tab[] = [
    {
      id: "all",
      label: "All Inventory",
      icon: <ListIcon size={16} />,
      count: inventoryItems?.length,
    },
    {
      id: "raw_material",
      label: "Raw Materials",
      icon: <BoxIcon size={16} />,
      count: filteredItems?.filter((item) => item.type === "raw_material")
        .length,
    },
    {
      id: "sub_product",
      label: "Sub Products",
      icon: <DiamondIcon size={16} />,
      count: filteredItems?.filter((item) => item.type === "sub_product")
        .length,
    },
  ];

  return (
    <div className="inventory-page w-full h-full p-4">
        {/* Quick Filter Stats Cards */}
        <div className="inventory-stats">
          <div
            className={`stat-card clickable ${
              quickFilter === null ? "active" : ""
            }`}
            onClick={() => handleQuickFilterClick("total")}
          >
            <div className="stat-icon total">
              <TotalItemsIcon />
            </div>
            <div className="stat-content">
              <div className="stat-number">{summary?.total_in_stock || 0}</div>
              <div className="stat-label">Total Items</div>
            </div>
          </div>

          <div
            className={`stat-card clickable ${
              quickFilter === "expiring" ? "active" : ""
            }`}
            onClick={() => handleQuickFilterClick("expiring")}
          >
            <div className="stat-icon expiring">
              <ExpiringSoonIcon />
            </div>
            <div className="stat-content">
              <div className="stat-number">{summary?.total_expiring_soon || 0}</div>
              <div className="stat-label">Expiring Soon</div>
            </div>
          </div>

          <div
            className={`stat-card clickable ${
              quickFilter === "low" ? "active" : ""
            }`}
            onClick={() => handleQuickFilterClick("low")}
          >
            <div className="stat-icon low">
              <LowStockIcon />
            </div>
            <div className="stat-content">
              <div className="stat-number">{summary?.total_low_stock || 0}</div>
              <div className="stat-label">Low Stock</div>
            </div>
          </div>

          <div
            className={`stat-card clickable ${
              quickFilter === "dead" ? "active" : ""
            }`}
            onClick={() => handleQuickFilterClick("dead")}
          >
            <div className="stat-icon dead">
              <DeadStockIcon />
            </div>
            <div className="stat-content">
              <div className="stat-number">{summary?.total_dead_stock || 0}</div>
              <div className="stat-label">Dead Stock</div>
            </div>
          </div>
        </div>

        {/* Product Type Tabs */}
        <Tabs
          tabs={productTypeTabs}
          activeTab={activeProductType}
          onTabChange={setActiveProductType}
        />

        {/* Modern Inventory Table */}
        <div className="modern-inventory-table w-full">
          <div className="table-header">
            <div className="table-title">Inventory</div>
            <div className="table-actions items-center">
              <div className="inventory-controls">
                <div className="search-container w-64">
                  <SearchIcon className="search-icon" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                  />
                </div>

                <div className="filter-controls flex items-center gap-3">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="filter-select"
                  >
                    <option value="all">All Status</option>
                    <option value="good">In Stock</option>
                    <option value="low">Low Stock</option>
                    <option value="critical">Critical</option>
                  </select>

                  <button className="btn-outline">
                    <FilterIcon />
                    Filter
                  </button>

                  <button
                    className="btn-primary user-guilde-stock-update"
                    onClick={() => setShowStockUpdateModal(true)}
                  >
                    <UpdateStockIcon />
                    Update Stock
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="table-container overflow-x-auto">
            <table className="modern-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Price Per Item</th>
                  <th>Category</th>
                  <th>Available Stock</th>
                  <th>Forecasted Out of Stock in Days</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item: any, index: number) => {
                  const stockPercentage = Math.min(
                    (item.available_qty / (item.reorder_point * 2)) * 100,
                    100
                  );
                  const isLowStock = item.available_qty <= item.reorder_point;
                  const isCritical = item.available_qty <= item.critical_point;

                  return (
                    <tr key={item.id} className={`table-row ${index === 0 ? `user-guide-inventory-list-first-row` : ''}`}>
                      <td className="name-cell">
                        <div className="item-name">{item.name}</div>
                      </td>

                      <td className="price-cell">
                        <div className="price-info">
                          <span className="price">
                            ${item.price_per_unit || "2.50"}
                          </span>
                          <span className="unit">/ {item.unit || "kg"}</span>
                        </div>
                      </td>

                      <td className="category-cell">
                        <span
                          className={`category-badge category-${
                            item.category
                              ?.toLowerCase()
                              .replace(/[^a-z]/g, "") || "default"
                          }`}
                        >
                          {item.category || "General"}
                        </span>
                      </td>

                      <td className="stock-cell">
                        <div className="stock-info">
                          <div className="stock-bar-container">
                            <div
                              className={`stock-bar ${
                                isCritical
                                  ? "critical"
                                  : isLowStock
                                  ? "low"
                                  : "good"
                              }`}
                              style={{
                                width: `${Math.max(stockPercentage, 5)}%`,
                              }}
                            ></div>
                          </div>
                          <div className="stock-text">
                            <span className="quantity">
                              {item.available_qty}
                            </span>
                            <span className="unit">{item.unit || "kg"}</span>
                          </div>
                        </div>
                      </td>

                      <td className="forecast-cell">
                        <div className="forecast-info">
                          <span className="forecast-days">
                            {item.forecast_days || 12} days
                          </span>
                          <div
                            className={`forecast-indicator ${
                              item.forecast_days <= 5
                                ? "critical"
                                : item.forecast_days <= 10
                                ? "warning"
                                : "good"
                            }`}
                          ></div>
                        </div>
                      </td>

                      <td className="action-cell">
                        <div className="action-buttons-modern">
                          <button
                            className="action-btn-modern restock"
                            onClick={() => handleAddToRestock(item)}
                          >
                            Add to Restock List
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* {filteredItems.length > 0 && (
            <div className="table-footer">
              <div className="entries-info">
                Showing {Math.min(filteredItems.length, 5)} to{" "}
                {filteredItems.length} of {filteredItems.length} entries
              </div>
              <div className="pagination">
                <button className="page-btn">‹</button>
                <button className="page-btn active">1</button>
                <button className="page-btn">2</button>
                <button className="page-btn">3</button>
                <button className="page-btn">›</button>
              </div>
            </div>
          )} */}

          {filteredItems.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">
                <CartOutlineIcon size={48} />
              </div>
              <h3>No items found</h3>
              <p>Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
        {/* Restock Modal */}
        {showRestockModal && selectedItem && (
          <div className="modal-overlay" onClick={handleCancelRestock}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Add to Restock List</h3>
                <button className="modal-close" onClick={handleCancelRestock}>
                  <CloseIcon size={24} />
                </button>
              </div>

              <div className="modal-body">
                <div className="item-details">
                  <div className="item-header">
                    <img
                      src={productIcon}
                      alt="Product"
                      className="product-icon"
                    />
                    <div className="item-info">
                      <h4>{selectedItem.name}</h4>
                      <p className="item-category">Raw Material</p>
                    </div>
                  </div>

                  <div className="current-stock">
                    <div className="stock-info highlighted">
                      <span className="label">Current Stock:</span>
                      <span className="value">
                        {selectedItem.available_qty} kg
                      </span>
                    </div>
                    <div className="stock-info">
                      <span className="label">Unit Price:</span>
                      <span className="value">$2.50</span>
                    </div>
                  </div>
                </div>

                <div className="quantity-input">
                  <label htmlFor="restockQuantity">Quantity to Restock:</label>
                  <div className="input-group">
                    <input
                      id="restockQuantity"
                      type="number"
                      min="1"
                      placeholder="Enter quantity"
                      value={restockQuantity}
                      onChange={(e) => setRestockQuantity(e.target.value)}
                      className="quantity-field"
                    />
                    <span className="input-unit">kg</span>
                  </div>
                </div>

                {restockQuantity && parseFloat(restockQuantity) > 0 && (
                  <div className="estimated-cost">
                    <span className="label">Estimated Cost:</span>
                    <span className="cost-value">
                      ${(2.5 * parseFloat(restockQuantity)).toFixed(2)}
                    </span>
                  </div>
                )}
              </div>

              <div className="modal-footer">
                <button className="btn-cancel" onClick={handleCancelRestock}>
                  Cancel
                </button>
                <button
                  className="btn-confirm"
                  onClick={handleConfirmRestock}
                  disabled={
                    !restockQuantity || parseFloat(restockQuantity) <= 0
                  }
                >
                  Add to Restock List
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Stock Update Modal */}
        <StockUpdateModal
          isOpen={showStockUpdateModal}
          onClose={() => setShowStockUpdateModal(false)}
          onSuccess={handleStockUpdateSuccess}
          onError={handleStockUpdateError}
        />
    </div>
  );
}
