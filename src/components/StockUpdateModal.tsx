import type { RootState } from "../store";
import { useSelector } from "react-redux";
import { useMemo, useState } from "react";
import { CloseIcon, SearchIcon } from "./icons/InventoryIcons";


interface StockUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateStock: () => void;
}

export default function StockUpdateModal({
  isOpen,
  onClose,
  onUpdateStock,
}: StockUpdateModalProps) {
  const inventoryItems = useSelector((s: RootState) => s.inventory.items || []);

  // Local UI state for bulk update
  const [query, setQuery] = useState("");
  const [staged, setStaged] = useState<Record<string, number>>({});

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return inventoryItems;
    return inventoryItems.filter((it: any) =>
      `${it.name} ${it.category || ""}`.toLowerCase().includes(q)
    );
  }, [inventoryItems, query]);

  const stagedEntries = useMemo(
    () => Object.entries(staged).filter(([, qty]) => qty > 0),
    [staged]
  );

  const handleStageQty = (id: string, qty: number) => {
    const next = Number.isFinite(qty) && !Number.isNaN(qty) ? qty : 0;
    setStaged((prev) => ({ ...prev, [id]: Math.max(0, next) }));
  };

  const adjustStageQty = (id: string, delta: number) => {
    setStaged((prev) => {
      const current = Number(prev[id] || 0);
      const next = Math.max(0, current + delta);
      return { ...prev, [id]: next };
    });
  };

  const handleDiscardAll = () => setStaged({});

  const handleApplyUpdates = () => {
    // Pass control to parent; parent can use current redux list
    onUpdateStock();
    setStaged({});
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay stock-update-overlay" onClick={onClose}>
      <div className="modal-content stock-update-modal flex flex-col" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="header-info">
            <h3>Bulk Stock Update</h3>
            <p className="header-subtitle">
              Update stock quantities for multiple products
            </p>
          </div>
          <button className="modal-close" onClick={onClose}>
            <CloseIcon size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body flex gap-4 flex-1 overflow-hidden">


          {/* Right: Search + Full Inventory List */}
          <div className="flex-1 md:basis-2/3 flex flex-col gap-3 min-h-0">
            <div className="relative w-full md:w-64">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <SearchIcon size={16} />
              </div>
              <input
                type="text"
                placeholder="Search inventory..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full h-10 rounded-md border border-gray-300 bg-white pl-9 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400"
              />
            </div>

            <div className="border border-gray-200 rounded-lg bg-white flex-1 overflow-y-auto min-h-0">
              <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-3 py-2">Item</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-3 py-2">Price Per Item</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-3 py-2">Available</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-3 py-2">Add Qty</th>
                  <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wide px-3 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item: any) => {
                  const qty = staged[String(item.id)] || 0;
                  return (
                    <tr key={item.id} className="border-t border-gray-100 hover:bg-gray-50">
                      <td className="px-3 py-2">
                        <div className="font-medium text-gray-900">{item.name}</div>
                        <div className="text-xs text-gray-500">{item.category || 'General'}</div>
                      </td>
                      <td className="px-3 py-2 text-gray-700">
                        {`$${Number(item.price_per_unit ?? 2.5).toFixed(2)}`} <span className="text-gray-400">/ {item.unit || ''}</span>
                      </td>
                      <td className="px-3 py-2 text-gray-700">{item.available_qty} {item.unit || ''}</td>
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            aria-label="Decrease"
                            onClick={() => adjustStageQty(String(item.id), -1)}
                            className="inline-flex items-center justify-center w-6 h-6 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
                          >
                            −
                          </button>
                          <input
                            type="text"
                            min={0}
                            value={qty}
                            onChange={(e) => handleStageQty(String(item.id), parseFloat(e.target.value))}
                            className="w-[40px] h-9 rounded-md border border-gray-300 bg-white px-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 text-center"
                          />
                          <button
                            type="button"
                            aria-label="Increase"
                            onClick={() => adjustStageQty(String(item.id), 1)}
                            className="inline-flex items-center justify-center w-6 h-6 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="px-3 py-2 text-right">
                        <button
                          className="text-xs text-indigo-600 hover:underline"
                          onClick={() => handleStageQty(String(item.id), 0)}
                        >
                          Clear
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              </table>
            </div>
          </div>

          {/* Left: Staged Items */}
          <div className="flex-1 border border-gray-200 min-w-[400px] overflow-y-scroll rounded-lg bg-white p-3 min-h-0">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-semibold text-gray-800">Current Updates</h4>
              <span className="text-xs text-gray-500">{stagedEntries.length} item(s)</span>
            </div>
            {stagedEntries.length === 0 ? (
              <div className="text-sm text-gray-500">No items staged yet. Use the list to add quantities.</div>
            ) : (
              <div className="space-y-2 overflow-y-auto">
                {stagedEntries.map(([id, qty]) => {
                  const item: any = inventoryItems.find((it: any) => String(it.id) === String(id));
                  if (!item) return null;
                  return (
                    <div key={id} className="flex items-center justify-between gap-3 border border-gray-100 rounded-md px-3 py-2">
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium text-gray-900 truncate">{item.name}</div>
                        <div className="text-xs text-gray-500">Current: {item.available_qty} {item.unit || ""}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          aria-label="Decrease"
                          onClick={() => adjustStageQty(String(item.id), -1)}
                          className="inline-flex items-center justify-center w-8 h-8 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
                        >
                          −
                        </button>
                        <input
                          type="text"
                          value={qty}
                          min={0}
                          onChange={(e) => handleStageQty(String(item.id), parseFloat(e.target.value))}
                          className="w-10 text-center h-9 rounded-md border border-gray-300 bg-white px-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400"
                        />
                        <button
                          type="button"
                          aria-label="Increase"
                          onClick={() => adjustStageQty(String(item.id), 1)}
                          className="inline-flex items-center justify-center w-8 h-8 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
                        >
                          +
                        </button>
                        <span className="text-xs text-gray-500">{item.unit || ""}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button className="btn-cancel" onClick={handleDiscardAll}>Discard updates</button>
          <button className="btn-confirm" disabled={stagedEntries.length === 0} onClick={handleApplyUpdates}>Update stock</button>
        </div>
      </div>
    </div>
  );
}
