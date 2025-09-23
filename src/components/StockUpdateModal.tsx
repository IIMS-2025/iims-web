import { useEffect, useState } from "react";
import type { Inventory } from "../types";
import { productIcon } from "../assets";;

interface StockUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  inventoryItems: Inventory[];
  onUpdateStock: (updates: {
    id: string;
    qty: number;
    unit: string;
    tx_type: "purchase" | "adjustment";
    reason?: string;
    expiry_date?: string;
  }[]) => void;
}

interface StockUpdate {
  name?: string;
  id: string;
  current_stock: number;
  new_quantity?: string;
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
  useEffect(() => {

      const newStockUpdates = inventoryItems.map(item => ({
        id: item.id,
        name: item?.name || "",
        current_stock: item.available_qty,
        new_quantity: "",
        unit: item?.unit || "",
        price: 2.50,
        reason: "",
        expiry_date: ""
      }));
  
      setStockUpdates(newStockUpdates);
  }, [inventoryItems]);

  const [searchTerm, setSearchTerm] = useState("");
  const [actionType, setActionType] = useState("order_update");
  const [currentStep, setCurrentStep] = useState<"update" | "review">("update");

  const handleQuantityChange = (productId: string, quantity: string) => {
    setStockUpdates(prev => 
      prev.map(item => 
        item.id === productId 
          ? { ...item, new_quantity: quantity }
          : item
      )
    );
  };

  const handleReasonChange = (productId: string, reason: string) => {
    setStockUpdates(prev => 
      prev.map(item => 
        item.id === productId 
          ? { ...item, reason: reason }
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

    const updates = validUpdates.map(item => {
      if (actionType === "order_update") {
        return {
          id: item.id,
          qty: parseFloat(item.new_quantity || ''),
          unit: item.unit,
          tx_type: "purchase" as const,
          reason: item.reason || undefined,
        };
      }
      // closing/opening stock: send adjustment by delta (target - current)
      const targetQty = parseFloat(item.new_quantity || '');
      const delta = targetQty - item.current_stock;
      return {
        id: item.id,
        qty: delta,
        unit: item.unit,
        tx_type: "adjustment" as const,
        reason: item.reason || undefined,
      };
    });
    
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


  const totalUpdates = stockUpdates.filter(item => {
    item.new_quantity?.length && item.new_quantity.length > 0;
  }).length;

  const totalCost = stockUpdates.reduce((sum, item) => {
    const quantity = parseFloat(item.new_quantity || '') || 0;
    return sum + (quantity * item.price);
  }, 0);

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
              />
            </div>
            
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

        {/* Main Content Area */}
        <div className="modal-body stock-update-body">
          {currentStep === "update" ? (
            // Update Page
            stockUpdates.length === 0 ? (
              <div className="no-products-message">
                <p>No inventory items available to update.</p>
              </div>
            ) : stockUpdates.length === 0 ? (
              <div className="no-products-message">
                <p>No products match your current filters.</p>
              </div>
            ) : (
              <div className="products-grid">
                {stockUpdates.map((item) => (
              <div key={item.id} className="product-update-card">
                <div className="product-header">
                  <img src={productIcon} alt="Product" className="product-icon-sm" />
                  <div className="product-info">
                    <h4 className="product-name">{item.name}</h4>
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
                      onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                      className="quantity-input-sm"
                    />
                    <span className="input-unit">{item.unit}</span>
                  </div>

                  {/* Reason field for closing/opening stock */}
                  {(actionType === "closing_stock" || actionType === "opening_stock") && (
                    <div className="reason-input">
                      <label className="reason-label">Reason (Optional):</label>
                      <input
                        type="text"
                        placeholder="Enter reason for stock adjustment..."
                        value={item.reason || ""}
                        onChange={(e) => handleReasonChange(item.id, e.target.value)}
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
                    <div key={item.id} className="review-item">
                      <div className="review-product">
                        <div className="review-icon">
                          {item.id.charAt(0).toUpperCase()}{item.id.charAt(1).toUpperCase()}
                        </div>
                        <div className="review-info">
                          <span className="review-name">{item.id}</span>
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
                                ? item.current_stock + parseFloat(item.new_quantity || '')
                                : parseFloat(item.new_quantity || '')
                              } {item.unit}
                            </span>
                          </div>
                        </div>

                        {(actionType === "closing_stock" || actionType === "opening_stock") && item.reason && (
                          <div className="review-reason">
                            <span className="reason-label">Reason:</span>
                            <span className="reason-text">{item.reason}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="review-cost">
                        ${(parseFloat(item.new_quantity || '') * item.price).toFixed(2)}
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
