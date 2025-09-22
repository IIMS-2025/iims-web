import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setInventory } from "../store/slices/inventorySlice";
// Layout provides Sidebar and Header
import Tabs from "../components/Tabs";
import { 
  TotalItemsIcon, 
  ExpiringSoonIcon, 
  LowStockIcon, 
  DeadStockIcon 
} from "../components/icons/InventoryIcons";
import { productIcon } from "../assets";
import StockUpdateModal from "../components/StockUpdateModal";
import type { RootState } from "../store";
import type { Inventory } from "../types";
import type { Tab } from "../components/Tabs";
import { 
  useGetInventoryQuery,
  useUpdateStockBatchMutation,
  useUpdateStockSingleMutation,
} from "../services/inventoryApi";

export default function InventoryPage() {
  const dispatch = useDispatch();
  const items = useSelector((s: RootState) => s.inventory.items || []);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [activeProductType, setActiveProductType] = useState("all");
  const [quickFilter, setQuickFilter] = useState<string | null>(null);
  const [showRestockModal, setShowRestockModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Inventory | null>(null);
  const [restockQuantity, setRestockQuantity] = useState("");
  const [showStockUpdateModal, setShowStockUpdateModal] = useState(false);

  const { data: inventoryData } = useGetInventoryQuery();

  useEffect(() => {
    if (inventoryData) {
      dispatch(setInventory(inventoryData));
    }
  }, [dispatch, inventoryData]);

  const getStockStatus = (item: Inventory) => {
    if (item.available_qty <= item.critical_point) return "critical";
    if (item.available_qty <= item.reorder_point) return "low";
    return "good";
  };

  const isExpiringSoon = (item: Inventory) => {
    // Simulate expiring logic - items updated more than 7 days ago
    const lastUpdated = new Date(item.last_updated);
    const daysSinceUpdate = Math.floor((Date.now() - lastUpdated.getTime()) / (1000 * 60 * 60 * 24));
    return daysSinceUpdate > 7;
  };

  const isDeadStock = (item: Inventory) => {
    // Simulate dead stock - items updated more than 14 days ago with low quantity
    const lastUpdated = new Date(item.last_updated);
    const daysSinceUpdate = Math.floor((Date.now() - lastUpdated.getTime()) / (1000 * 60 * 60 * 24));
    return daysSinceUpdate > 14 && item.available_qty < 5;
  };

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
      console.log(`Adding ${selectedItem.id} - Quantity: ${restockQuantity} to restock list`);
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

  const [updateStockBatch] = useUpdateStockBatchMutation();
  const [updateStockSingle] = useUpdateStockSingleMutation();

  const handleStockUpdate = async (updates: {
    id: string;
    qty: number;
    unit: string;
    tx_type: "purchase" | "adjustment";
    reason?: string;
    expiry_date?: string;
  }[]) => {
    try {
      // Split by tx_type
      const purchaseItems = updates.filter(u => u.tx_type === "purchase");
      const adjustmentItems = updates.filter(u => u.tx_type === "adjustment");

      // For purchases: group by expiry_date (API expects top-level expiry_date)
      const groupsByExpiry: Record<string, typeof purchaseItems> = {};
      for (const item of purchaseItems) {
        const key = item.expiry_date || "__no_expiry__";
        if (!groupsByExpiry[key]) groupsByExpiry[key] = [];
        groupsByExpiry[key].push(item);
      }

      // Execute batches for purchases
      for (const [expiry, items] of Object.entries(groupsByExpiry)) {
        if (items.length === 0) continue;
        if (items.length === 1 && expiry !== "__no_expiry__") {
          // Single item with expiry -> use single endpoint
          const i = items[0];
          await updateStockSingle({
            id: i.id,
            qty: i.qty,
            unit: i.unit,
            tx_type: "purchase",
            expiry_date: i.expiry_date,
            reason: i.reason,
          }).unwrap();
        } else if (items.length === 1 && expiry === "__no_expiry__") {
          const i = items[0];
          await updateStockSingle({
            id: i.id,
            qty: i.qty,
            unit: i.unit,
            tx_type: "purchase",
            reason: i.reason,
          }).unwrap();
        } else {
          // Batch
          await updateStockBatch({
            batch_id: `BATCH_${Date.now()}`,
            tx_type: "purchase",
            expiry_date: expiry === "__no_expiry__" ? undefined : expiry,
            items: items.map(i => ({ id: i.id, qty: i.qty, unit: i.unit, reason: i.reason })),
          }).unwrap();
        }
      }

      // Adjustments can be batched together
      if (adjustmentItems.length > 0) {
        await updateStockBatch({
          batch_id: `ADJ_${Date.now()}`,
          tx_type: "adjustment",
          items: adjustmentItems.map(i => ({ id: i.id, qty: i.qty, unit: i.unit, reason: i.reason })),
        }).unwrap();
      }

      console.log("Stock update successful");
    } catch (err) {
      console.error("Stock update failed", err);
    }
  };

  // Debug: Check if items are being loaded
  console.log("Inventory items:", items);


  // Define product type tabs
  const productTypeTabs: Tab[] = [
    {
      id: "all",
      label: "All Inventory",
      icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M2 4H14M2 8H14M2 12H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
      count: items.filter(item => !item.id.toLowerCase().includes('pizza') && !item.id.toLowerCase().includes('salad')).length
    },
    {
      id: "raw",
      label: "Raw Materials",
      icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M8 2L14 6V14L8 10L2 14V6L8 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      count: items.filter(item => item.id.toLowerCase().includes('raw') || item.id.toLowerCase().includes('tomato') || item.id.toLowerCase().includes('cheese') || item.id.toLowerCase().includes('lettuce') || item.id.toLowerCase().includes('chicken') || item.id.toLowerCase().includes('flour')).length
    },
    {
      id: "sub_product",
      label: "Sub Products",
      icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M8 1L15 8L8 15L1 8L8 1Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      count: items.filter(item => item.id.toLowerCase().includes('sub') || item.id.toLowerCase().includes('sauce') || item.id.toLowerCase().includes('dough') || item.id.toLowerCase().includes('spice')).length
    }
  ];

  const filteredItems = items
    .filter(item => {
      const matchesSearch = item.id.toLowerCase().includes(searchTerm.toLowerCase());
      const status = getStockStatus(item);
      const matchesFilter = filterStatus === "all" || status === filterStatus;
      
      // Quick filter logic
      let matchesQuickFilter = true;
      if (quickFilter) {
        switch (quickFilter) {
          case "expiring":
            matchesQuickFilter = isExpiringSoon(item);
            break;
          case "low":
            matchesQuickFilter = status === "low";
            break;
          case "dead":
            matchesQuickFilter = isDeadStock(item);
            break;
          default:
            matchesQuickFilter = true;
        }
      }
      
      // Product type filtering
      let matchesProductType = true;
      if (activeProductType !== "all") {
        if (activeProductType === "raw") {
          matchesProductType = item.id.toLowerCase().includes('raw') || 
                              item.id.toLowerCase().includes('tomato') || 
                              item.id.toLowerCase().includes('cheese') ||
                              item.id.toLowerCase().includes('lettuce') ||
                              item.id.toLowerCase().includes('chicken') ||
                              item.id.toLowerCase().includes('flour');
        } else if (activeProductType === "sub_product") {
          matchesProductType = item.id.toLowerCase().includes('sub') || 
                              item.id.toLowerCase().includes('sauce') ||
                              item.id.toLowerCase().includes('dough') ||
                              item.id.toLowerCase().includes('spice');
        }
      }
      
      // Exclude menu items from inventory completely
      const isMenuItemExcluded = !item.id.toLowerCase().includes('pizza') && 
                                 !item.id.toLowerCase().includes('salad');
      
      return matchesSearch && matchesFilter && matchesQuickFilter && matchesProductType && isMenuItemExcluded;
    });


  // Calculate stock counts based on filtered items
  const getFilteredItems = () => {
    return items.filter(item => {
      // Always exclude menu items from inventory
      const isNotMenuItem = !item.id.toLowerCase().includes('pizza') && 
                           !item.id.toLowerCase().includes('salad');
      
      if (!isNotMenuItem) return false;
      
      if (activeProductType === "all") return true;
      
      if (activeProductType === "raw") {
        return item.id.toLowerCase().includes('raw') || 
               item.id.toLowerCase().includes('tomato') || 
               item.id.toLowerCase().includes('cheese') ||
               item.id.toLowerCase().includes('lettuce') ||
               item.id.toLowerCase().includes('chicken') ||
               item.id.toLowerCase().includes('flour');
      } else if (activeProductType === "sub_product") {
        return item.id.toLowerCase().includes('sub') || 
               item.id.toLowerCase().includes('sauce') ||
               item.id.toLowerCase().includes('dough') ||
               item.id.toLowerCase().includes('spice');
      }
      return true;
    });
  };

  const filteredForStats = getFilteredItems();
  const stockCounts = {
    total: filteredForStats.length,
    expiring: filteredForStats.filter(item => isExpiringSoon(item)).length,
    low: filteredForStats.filter(item => getStockStatus(item) === "low").length,
    dead: filteredForStats.filter(item => isDeadStock(item)).length,
  };

  return (
        <>
        {/* Content */}
        <>
          {/* Quick Filter Stats Cards */}
      <div className="inventory-stats">
        <div 
          className={`stat-card clickable ${quickFilter === null ? "active" : ""}`}
          onClick={() => handleQuickFilterClick("total")}
        >
          <div className="stat-icon total">
            <TotalItemsIcon />
          </div>
          <div className="stat-content">
            <div className="stat-number">{stockCounts.total}</div>
            <div className="stat-label">Total Items</div>
          </div>
        </div>

        <div 
          className={`stat-card clickable ${quickFilter === "expiring" ? "active" : ""}`}
          onClick={() => handleQuickFilterClick("expiring")}
        >
          <div className="stat-icon expiring">
            <ExpiringSoonIcon />
          </div>
          <div className="stat-content">
            <div className="stat-number">{stockCounts.expiring}</div>
            <div className="stat-label">Expiring Soon</div>
          </div>
        </div>

        <div 
          className={`stat-card clickable ${quickFilter === "low" ? "active" : ""}`}
          onClick={() => handleQuickFilterClick("low")}
        >
          <div className="stat-icon low">
            <LowStockIcon />
          </div>
          <div className="stat-content">
            <div className="stat-number">{stockCounts.low}</div>
            <div className="stat-label">Low Stock</div>
          </div>
        </div>

        <div 
          className={`stat-card clickable ${quickFilter === "dead" ? "active" : ""}`}
          onClick={() => handleQuickFilterClick("dead")}
        >
          <div className="stat-icon dead">
            <DeadStockIcon />
          </div>
          <div className="stat-content">
            <div className="stat-number">{stockCounts.dead}</div>
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

      {/* Filters and Search */}
      <div className="inventory-controls">
        <div className="search-container">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="search-icon">
            <path d="M7 13C10.3137 13 13 10.3137 13 7C13 3.68629 10.3137 1 7 1C3.68629 1 1 3.68629 1 7C1 10.3137 3.68629 13 7 13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M13 13L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-controls">
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
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 4H14M4 8H12M6 12H10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Filter
          </button>

          <button className="btn-primary" onClick={() => setShowStockUpdateModal(true)}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 3H14L13 11H3L2 3ZM2 3L1.5 1H0.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M6 6V9M10 6V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <circle cx="5" cy="13.5" r="1" fill="currentColor"/>
              <circle cx="11" cy="13.5" r="1" fill="currentColor"/>
              <path d="M8 4L8 2M6 4L8 2L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Update Stock
          </button>
        </div>
      </div>

      {/* Modern Inventory Table */}
      <div className="modern-inventory-table">
        <div className="table-header">
          <div className="table-title">Inventory</div>
          <div className="table-actions">
            <button className="table-action-btn">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M2 4H14M4 8H12M6 12H10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Filter
            </button>
            <button className="table-action-btn">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 6L7 10L13 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Sort
            </button>
          </div>
        </div>

        <div className="table-container">
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
              {filteredItems.map((item: any) => {
                const stockPercentage = Math.min((item.available_qty / (item.reorder_point * 2)) * 100, 100);
                const isLowStock = item.available_qty <= item.reorder_point;
                const isCritical = item.available_qty <= item.critical_point;
                
                return (
                  <tr key={item.id} className="table-row">
                    <td className="name-cell">
                      <div className="item-name">{item.name}</div>
                    </td>
                    
                    <td className="price-cell">
                      <div className="price-info">
                        <span className="price">${item.price_per_unit || "2.50"}</span>
                        <span className="unit">/ {item.unit || "kg"}</span>
                      </div>
                    </td>
                    
                    <td className="category-cell">
                      <span className={`category-badge category-${item.category?.toLowerCase().replace(/[^a-z]/g, '') || 'default'}`}>
                        {item.category || "General"}
                      </span>
                    </td>
                    
                    <td className="stock-cell">
                      <div className="stock-info">
                        <div className="stock-bar-container">
                          <div 
                            className={`stock-bar ${isCritical ? 'critical' : isLowStock ? 'low' : 'good'}`}
                            style={{ width: `${Math.max(stockPercentage, 5)}%` }}
                          ></div>
                        </div>
                        <div className="stock-text">
                          <span className="quantity">{item.available_qty}</span>
                          <span className="unit">{item.unit || "kg"}</span>
                        </div>
                      </div>
                    </td>
                    
                    <td className="forecast-cell">
                      <div className="forecast-info">
                        <span className="forecast-days">{item.forecast_days || 12} days</span>
                        <div className={`forecast-indicator ${item.forecast_days <= 5 ? 'critical' : item.forecast_days <= 10 ? 'warning' : 'good'}`}></div>
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

        <div className="table-footer">
          <div className="entries-info">
            Showing {Math.min(filteredItems.length, 5)} to {filteredItems.length} of {filteredItems.length} entries
          </div>
          <div className="pagination">
            <button className="page-btn">‹</button>
            <button className="page-btn active">1</button>
            <button className="page-btn">2</button>
            <button className="page-btn">3</button>
            <button className="page-btn">›</button>
          </div>
        </div>
        
        {filteredItems.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <path d="M9 14H39L36 38H12L9 14ZM9 14L7 2H2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
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
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
              
              <div className="modal-body">
                <div className="item-details">
                  <div className="item-header">
                    <img src={productIcon} alt="Product" className="product-icon" />
                    <div className="item-info">
                      <h4>{selectedItem.id}</h4>
                      <p className="item-category">Raw Material</p>
                    </div>
                  </div>
                  
                  <div className="current-stock">
                    <div className="stock-info highlighted">
                      <span className="label">Current Stock:</span>
                      <span className="value">{selectedItem.available_qty} kg</span>
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
                      ${(2.50 * parseFloat(restockQuantity)).toFixed(2)}
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
                  disabled={!restockQuantity || parseFloat(restockQuantity) <= 0}
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
          inventoryItems={items}
          onUpdateStock={handleStockUpdate}
        />
        </>
        </>
  );
}