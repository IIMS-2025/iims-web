import React, { useState } from "react";
import type { Inventory } from "../types";
import { productIcon } from "../assets";
import Tabs from "./Tabs";

interface StockUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  inventoryItems: Inventory[];
  onUpdateStock: (updates: { product_id: string; quantity: number }[]) => void;
}

interface StockUpdate {
  product_id: string;
  current_stock: number;
  new_quantity: string;
  unit: string;
  price: number;
  reason?: string;
  expiry_date?: string;
}

export default function StockUpdateModal({ 
  isOpen, 
  onClose, 
  inventoryItems, 
  onUpdateStock 
}: StockUpdateModalProps) {
  const [stockUpdates, setStockUpdates] = useState<StockUpdate[]>([]);
  
  // Update stockUpdates when inventoryItems changes
  React.useEffect(() => {
    console.log("StockUpdateModal - inventoryItems:", inventoryItems);
    if (inventoryItems && inventoryItems.length > 0) {
      const newStockUpdates = inventoryItems.map(item => ({
        product_id: item.product_id,
        current_stock: item.available_qty,
        new_quantity: "",
        unit: "kg",
        price: 2.50,
        reason: "",
        expiry_date: ""
      }));
      console.log("StockUpdateModal - newStockUpdates:", newStockUpdates);
      setStockUpdates(newStockUpdates);
    }
  }, [inventoryItems]);

  const [searchTerm, setSearchTerm] = useState("");
  const [activeProductType, setActiveProductType] = useState("all");
  const [actionType, setActionType] = useState("order_update");
  const [currentStep, setCurrentStep] = useState<"update" | "review">("update");

  const handleQuantityChange = (productId: string, quantity: string) => {
    setStockUpdates(prev => 
      prev.map(item => 
        item.product_id === productId 
          ? { ...item, new_quantity: quantity }
          : item
      )
    );
  };

  const handleReasonChange = (productId: string, reason: string) => {
    setStockUpdates(prev => 
      prev.map(item => 
        item.product_id === productId 
          ? { ...item, reason: reason }
          : item
      )
    );
  };

  const handleExpiryDateChange = (productId: string, expiryDate: string) => {
    setStockUpdates(prev => 
      prev.map(item => 
        item.product_id === productId 
          ? { ...item, expiry_date: expiryDate }
          : item
      )
    );
  };

  const handleSubmit = () => {
    const validUpdates = stockUpdates.filter(item => {
      const hasQuantity = item.new_quantity && parseFloat(item.new_quantity) > 0;
      const hasExpiryForOrder = actionType !== "order_update" || (item.expiry_date && item.expiry_date.trim());
      return hasQuantity && hasExpiryForOrder;
    });

    const updates = validUpdates.map(item => ({
      product_id: item.product_id,
      quantity: parseFloat(item.new_quantity),
      action: actionType,
      reason: item.reason || "",
      expiry_date: item.expiry_date || "",
      // For closing/opening stock, we're setting new stock level, not adding
      isStockUpdate: actionType === "closing_stock" || actionType === "opening_stock"
    }));
    
    if (updates.length > 0) {
      onUpdateStock(updates);
      onClose();
      // Reset states
      setCurrentStep("update");
      setActionType("order_update");
      // Reset stock updates
      setStockUpdates(prev => prev.map(item => ({ 
        ...item, 
        new_quantity: "", 
        reason: "", 
        expiry_date: "" 
      })));
    }
  };

  const handleProceedToReview = () => {
    setCurrentStep("review");
  };

  const handleBackToUpdate = () => {
    setCurrentStep("update");
  };

  const getProductType = (productId: string) => {
    // Determine product type based on product ID patterns
    const lowerProductId = productId.toLowerCase();
    
    if (lowerProductId.includes('flour') || 
        lowerProductId.includes('tomato') || 
        lowerProductId.includes('cheese') || 
        lowerProductId.includes('spice') || 
        lowerProductId.includes('olive') ||
        lowerProductId.includes('basil') ||
        lowerProductId.includes('oregano')) {
      return 'raw';
    } else if (lowerProductId.includes('dough') || 
               lowerProductId.includes('sauce') || 
               lowerProductId.includes('mix')) {
      return 'sub_product';
    }
    return 'raw'; // default to raw material
  };

  const filteredItems = stockUpdates.filter(item => {
    const matchesSearch = item.product_id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = activeProductType === "all" || getProductType(item.product_id) === activeProductType;
    return matchesSearch && matchesType;
  });

  const totalUpdates = stockUpdates.filter(item => {
    const hasQuantity = item.new_quantity && parseFloat(item.new_quantity) > 0;
    const hasExpiryForOrder = actionType !== "order_update" || (item.expiry_date && item.expiry_date.trim());
    return hasQuantity && hasExpiryForOrder;
  }).length;

  const totalCost = stockUpdates.reduce((sum, item) => {
    const quantity = parseFloat(item.new_quantity) || 0;
    return sum + (quantity * item.price);
  }, 0);

  // Calculate counts for each product type
  const allProductsCount = stockUpdates.length;
  const rawMaterialsCount = stockUpdates.filter(item => getProductType(item.product_id) === 'raw').length;
  const subProductsCount = stockUpdates.filter(item => getProductType(item.product_id) === 'sub_product').length;

  // Create tabs data
  const productTypeTabs = [
    {
      id: "all",
      label: "All Inventory",
      count: allProductsCount,
      icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M2 3H4L4.4 5M6 11H12L15 5H5.4M6 11L4.4 5M6 11L4.22 12.78C3.95 13.05 4.17 13.5 4.56 13.5H12M12 11V13M8 11V13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      id: "raw",
      label: "Raw Materials",
      count: rawMaterialsCount,
      icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M8 2L3 7L8 12L13 7L8 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M8 7V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      id: "sub_product",
      label: "Sub Products",
      count: subProductsCount,
      icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M8 1L15 5L8 9L1 5L8 1Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M1 10L8 14L15 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M1 5L8 9L15 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    }
  ];

  if (!isOpen) return null;

  return (
    <div className="modal-overlay stock-update-overlay" onClick={onClose}>
      <div className="modal-content stock-update-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="header-info">
            <h3>{currentStep === "update" ? "Bulk Stock Update" : "Review Changes"}</h3>
            <p className="header-subtitle">
              {currentStep === "update" 
                ? "Update stock quantities for multiple products" 
                : "Review and confirm your stock updates"
              }
            </p>
          </div>
          <button className="modal-close" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* Action Type Dropdown */}
        {currentStep === "update" && (
          <div className="action-selector">
            <label htmlFor="actionType" className="action-label">Action Type:</label>
            <select 
              id="actionType"
              value={actionType} 
              onChange={(e) => setActionType(e.target.value)}
              className="action-dropdown"
            >
              <option value="order_update">Order Update</option>
              <option value="closing_stock">Closing Stock</option>
              <option value="opening_stock">Opening Stock</option>
            </select>
          </div>
        )}

        {/* Search and Actions - Only show in update step */}
        {currentStep === "update" && (
          <div className="modal-controls">
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
            
            <Tabs
              tabs={productTypeTabs}
              activeTab={activeProductType}
              onTabChange={setActiveProductType}
              className="stock-update-tabs"
            />
          </div>
        )}

        {/* Main Content Area */}
        <div className="modal-body stock-update-body">
          {currentStep === "update" ? (
            // Update Page
            stockUpdates.length === 0 ? (
              <div className="no-products-message">
                <p>No inventory items available to update.</p>
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="no-products-message">
                <p>No products match your current filters.</p>
              </div>
            ) : (
              <div className="products-grid">
                {filteredItems.map((item) => (
              <div key={item.product_id} className="product-update-card">
                <div className="product-header">
                  <img src={productIcon} alt="Product" className="product-icon-sm" />
                  <div className="product-info">
                    <h4 className="product-name">{item.product_id}</h4>
                    <p className="product-category">
                      {getProductType(item.product_id) === 'raw' ? 'Raw Material' : 'Sub Product'}
                    </p>
                  </div>
                </div>

                <div className="stock-info-grid">
                  <div className="current-stock-info">
                    <span className="label">Current Stock</span>
                    <span className="current-value">{item.current_stock} {item.unit}</span>
                  </div>
                  
                  <div className="price-info">
                    <span className="label">Unit Price</span>
                    <span className="price-value">${item.price.toFixed(2)}</span>
                  </div>
                </div>

                <div className="update-input-section">
                  <label className="update-label">
                    {actionType === "order_update" ? "Add Stock Quantity" : 
                     actionType === "closing_stock" ? "Closing Stock Count" : 
                     "Opening Stock Count"}
                  </label>
                  <div className="input-group">
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      placeholder="0"
                      value={item.new_quantity}
                      onChange={(e) => handleQuantityChange(item.product_id, e.target.value)}
                      className="quantity-input-sm"
                    />
                    <span className="input-unit">{item.unit}</span>
                  </div>

                  {/* Expiry date field for order updates */}
                  {actionType === "order_update" && (
                    <div className="expiry-input">
                      <label className="expiry-label">
                        Expiry Date <span className="required">*</span>:
                      </label>
                      <input
                        type="date"
                        value={item.expiry_date || ""}
                        onChange={(e) => handleExpiryDateChange(item.product_id, e.target.value)}
                        className="expiry-field"
                        required
                        min={new Date().toISOString().split('T')[0]} // Today's date as minimum
                      />
                    </div>
                  )}

                  {/* Reason field for closing/opening stock */}
                  {(actionType === "closing_stock" || actionType === "opening_stock") && (
                    <div className="reason-input">
                      <label className="reason-label">Reason (Optional):</label>
                      <input
                        type="text"
                        placeholder="Enter reason for stock adjustment..."
                        value={item.reason || ""}
                        onChange={(e) => handleReasonChange(item.product_id, e.target.value)}
                        className="reason-field"
                      />
                    </div>
                  )}
                  
                  {item.new_quantity && parseFloat(item.new_quantity) > 0 && (
                    <div className="cost-preview">
                      <span className="cost-label">
                        {actionType === "order_update" ? "Cost: " : "Value: "}
                      </span>
                      <span className="cost-amount">
                        ${(parseFloat(item.new_quantity) * item.price).toFixed(2)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
                ))}
              </div>
            )
          ) : (
            // Review Page
            <div className="review-page">
              <div className="review-header">
                <h4>Action: {actionType.replace('_', ' ').toUpperCase()}</h4>
                <p>{stockUpdates.filter(item => item.new_quantity && parseFloat(item.new_quantity) > 0).length} products will be updated</p>
              </div>
              
              <div className="review-list">
                {stockUpdates
                  .filter(item => item.new_quantity && parseFloat(item.new_quantity) > 0)
                  .map((item) => (
                    <div key={item.product_id} className="review-item">
                      <div className="review-product">
                        <div className="review-icon">
                          {item.product_id.charAt(0).toUpperCase()}{item.product_id.charAt(1).toUpperCase()}
                        </div>
                        <div className="review-info">
                          <span className="review-name">{item.product_id}</span>
                          <span className="review-type">
                            {getProductType(item.product_id) === 'raw' ? 'Raw Material' : 'Sub Product'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="review-middle">
                        <div className="review-changes">
                          <div className="change-item">
                            <span className="change-label">Current:</span>
                            <span className="change-value">{item.current_stock} {item.unit}</span>
                          </div>
                          <div className="change-arrow">→</div>
                          <div className="change-item">
                            <span className="change-label">
                              {actionType === "order_update" ? "Add:" : "Set to:"}
                            </span>
                            <span className="change-value highlight">
                              {actionType === "order_update" ? "+" : ""}{item.new_quantity} {item.unit}
                            </span>
                          </div>
                          <div className="change-arrow">→</div>
                          <div className="change-item">
                            <span className="change-label">New Total:</span>
                            <span className="change-value total">
                              {actionType === "order_update" 
                                ? item.current_stock + parseFloat(item.new_quantity)
                                : parseFloat(item.new_quantity)
                              } {item.unit}
                            </span>
                          </div>
                        </div>
                        
                        {actionType === "order_update" && item.expiry_date && (
                          <div className="review-expiry">
                            <span className="expiry-label">Expiry Date:</span>
                            <span className="expiry-text">
                              {new Date(item.expiry_date).toLocaleDateString()}
                            </span>
                          </div>
                        )}

                        {(actionType === "closing_stock" || actionType === "opening_stock") && item.reason && (
                          <div className="review-reason">
                            <span className="reason-label">Reason:</span>
                            <span className="reason-text">{item.reason}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="review-cost">
                        ${(parseFloat(item.new_quantity) * item.price).toFixed(2)}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* Summary and Footer */}
        <div className="modal-footer stock-update-footer">
          <div className="update-summary">
            <div className="summary-item">
              <span className="summary-label">Products to Update:</span>
              <span className="summary-value">{totalUpdates}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Total Cost:</span>
              <span className="summary-value total-cost">${totalCost.toFixed(2)}</span>
            </div>
          </div>
          
          <div className="action-buttons">
            {currentStep === "update" ? (
              <>
                <button className="btn-cancel" onClick={onClose}>
                  Cancel
                </button>
                <button 
                  className="btn-confirm" 
                  onClick={handleProceedToReview}
                  disabled={totalUpdates === 0}
                >
                  Review {totalUpdates} Update{totalUpdates !== 1 ? 's' : ''}
                </button>
              </>
            ) : (
              <>
                <button className="btn-cancel" onClick={handleBackToUpdate}>
                  Back to Edit
                </button>
                <button 
                  className="btn-confirm" 
                  onClick={handleSubmit}
                >
                  Confirm Updates
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
