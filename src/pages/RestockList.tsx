import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getRestockItems } from "../services/api";
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
  selectRestockStats,
} from "../store/slices/restockSlice";
import Tabs from "../components/Tabs";
import {
  RawMaterialIcon,
  SubProductIcon,
  ExportIcon,
  PreviousIcon,
  NextIcon,
} from "../components/icons/RestockIcons";
import type { RootState } from "../store";
import type { Tab } from "../components/Tabs";
import { useGetInventoryQuery } from "../services/inventoryApi";
import { setInventory } from "../store/slices/inventorySlice";

export default function RestockList() {
  const dispatch = useDispatch();
  const items = useSelector(selectRestockItems);
  const selectedItems = useSelector(selectSelectedItems);
  const filter = useSelector(selectRestockFilter);
  const inventoryItems= useSelector((s: RootState) => s.inventory.items || []);
  const bulkLoading = useSelector(
    (state: RootState) => state.restock.bulkOperationsLoading
  );

  const [activeTab, setActiveTab] = useState("raw");
  const [showExportModal, setShowExportModal] = useState(false);
  const [categoryFilter, setCategoryFilterLocal] = useState<string>("all");


  const { data: inventory } = useGetInventoryQuery();

  const { inventoryList, summary } = inventory || {};

  useEffect(() => {
    if (inventoryList) {
      dispatch(setInventory(inventoryList));
    }
  }, [dispatch, inventoryList]);

  const filteredItems = inventoryItems.filter((item) => (item.stock_status !== "in_stock" && item.stock_status !== "dead_stock"));


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
    if (selectedItems.length === sortedItems.length) {
      dispatch(clearSelection());
    } else {
      dispatch(selectAllItems(sortedItems.map((item) => item.id)));
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
      "Stock Status",
      "Estimated Cost",
    ];
    const csvContent = [
      headers.join(","),
      ...dataToExport.map((item) =>
        [
          `"${item.name}"`,
          `"${item.category}"`,
          item.available_qty,
          Math.max(0, parseFloat(item.reorder_point) - parseFloat(item.available_qty)),
          `"${item.unit}"`,
          `"${item.stock_status}"`,
          (Math.max(0, parseFloat(item.reorder_point) - parseFloat(item.available_qty)) * parseFloat(item.price)).toFixed(2),
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

  // Define category tabs
  const categoryTabs: Tab[] = [
    {
      id: "raw",
      label: "Raw Materials",
      icon: <RawMaterialIcon size={16} />,
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
      icon: <SubProductIcon size={16} />,
      count: items.filter(
        (item) =>
          item.category.toLowerCase().includes("bakery") ||
          item.category.toLowerCase().includes("sauce") ||
          item.category.toLowerCase().includes("base")
      ).length,
    },
  ];

  // Add sorting logic for inventory items
  const sortedItems = [...filteredItems].sort((a, b) => {
    // Sort by stock status priority: out_of_stock > low_stock > expiring_soon > in_stock
    const statusPriority = {
      'out_of_stock': 4,
      'low_stock': 3,
      'expiring_soon': 2,
      'critical_stock': 4,
      'dead_stock': 1,
      'in_stock': 1
    };
    
    const aPriority = statusPriority[a.stock_status] || 1;
    const bPriority = statusPriority[b.stock_status] || 1;
    
    if (aPriority !== bPriority) {
      return bPriority - aPriority; // Higher priority first
    }
    
    // Secondary sort by name
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="h-full flex flex-col">
      {/* Category Tabs with Controls */}
      <div className="flex-shrink-0">
        <Tabs
          tabs={categoryTabs}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          rightContent={
            <div className="flex items-center gap-3 mr-2">
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
                className="h-11 px-3 border border-gray-300 bg-white rounded-md text-sm text-gray-700 min-w-32 focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-400"
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
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 border-0 rounded-lg text-white text-sm font-semibold cursor-pointer transition-all duration-200 hover:bg-emerald-700 hover:-translate-y-px disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none"
                onClick={handleExportList}
                disabled={bulkLoading}
              >
                <ExportIcon size={14} />
                Export List
              </button>
            </div>
          }
        />
      </div>

      <div className="flex-1 min-h-0 flex flex-col">
        {/* Restock Table */}
        <div className="bg-white rounded-t-2xl border border-gray-200 border-b-0 shadow-sm overflow-hidden flex-1 min-h-0 flex flex-col">
          <div className="flex-1 overflow-auto">
            <table className="w-full border-collapse text-sm font-inter">
              <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
                <tr>
                  <th className="w-16 px-6 py-4">
                    <input
                      type="checkbox"
                      checked={
                        selectedItems.length === sortedItems.length &&
                        sortedItems.length > 0
                      }
                      onChange={handleSelectAll}
                      className="w-3 h-3 border border-black rounded-sm"
                    />
                  </th>
                  <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wide px-6 py-4 border-b border-gray-200">Item Name</th>
                  <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wide px-6 py-4 border-b border-gray-200">Category</th>
                  <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wide px-6 py-4 border-b border-gray-200">Current Stock</th>
                  <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wide px-6 py-4 border-b border-gray-200">
                    <div className="flex flex-col gap-0.5">
                      <span>Forecasted</span>
                      <span>Requirement</span>
                    </div>
                  </th>
                  <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wide px-6 py-4 border-b border-gray-200">
                    <div className="flex flex-col gap-0.5">
                      <span>Estimated</span>
                      <span>Cost</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedItems.map((item) => (
                  <tr key={item.id} className="border-b border-gray-200 transition-colors hover:bg-gray-50">
                    <td className="flex w-16 h-[100%] min-h-[84px] px-2 py-1.5 align-middle justify-center items-center">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.id)}
                        onChange={() => handleItemSelection(item.id)}
                        className="w-3 h-3 border border-black rounded-sm"
                      />
                    </td>

                    <td className="px-6 py-4 align-middle">
                      <div className="font-semibold text-base leading-5 text-gray-800">{item.name}</div>
                    </td>

                    <td className="px-6 py-4 align-middle">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        item.category.toLowerCase().includes('vegetables') ? 'bg-green-100 text-green-800' :
                        item.category.toLowerCase().includes('dairy') ? 'bg-orange-100 text-orange-700' :
                        item.category.toLowerCase().includes('meat') ? 'bg-red-100 text-red-800' :
                        item.category.toLowerCase().includes('herbs') ? 'bg-green-100 text-green-700' :
                        item.category.toLowerCase().includes('oils') ? 'bg-purple-100 text-purple-800' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {item.category}
                      </span>
                    </td>

                    <td className="px-6 py-4 align-middle">
                      <div className="flex flex-col gap-1">
                        <span className="font-medium text-sm leading-5 text-black">
                          {item.available_qty} {item.unit}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4 align-middle">
                      <div className="flex flex-col gap-1">
                        <span className="font-semibold text-sm leading-5 text-gray-800">
                          {Math.max(0, parseFloat(item.reorder_point) - parseFloat(item.available_qty))} {item.unit}
                        </span>
                        <span className="font-normal text-xs leading-4 text-gray-500">
                          To reach reorder point
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4 align-middle">
                      <div className="flex flex-col gap-1">
                        <span className="font-semibold text-sm leading-5 text-gray-800">
                          ${(Math.max(0, parseFloat(item.reorder_point) - parseFloat(item.available_qty)) * parseFloat(item.price)).toFixed(2)}
                        </span>
                        <span className="font-normal text-xs leading-4 text-gray-500">
                          @${parseFloat(item.price).toFixed(2)}/{item.unit}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Controls */}
        <div className="flex justify-between items-center px-4 py-4 bg-white border border-gray-200 border-t-0 rounded-b-2xl">
          <div className="flex items-center gap-6 flex-nowrap">
            <span className="font-medium text-sm leading-5 text-gray-500">
              {selectedItems.length} items selected
            </span>
            <div className="flex items-center gap-4 flex-nowrap">
              <button
                className="bg-transparent border-0 font-medium text-sm leading-4 cursor-pointer px-2 py-1 rounded transition-all duration-200 whitespace-nowrap flex-shrink-0 text-purple-600 hover:bg-purple-50"
                onClick={handleSelectAll}
              >
                Select All
              </button>
              <button
                className="bg-transparent border-0 font-medium text-sm leading-4 cursor-pointer px-2 py-1 rounded transition-all duration-200 whitespace-nowrap flex-shrink-0 text-gray-500 hover:bg-gray-50"
                onClick={() => dispatch(clearSelection())}
              >
                Clear Selection
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
