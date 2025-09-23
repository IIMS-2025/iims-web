import { Link } from "react-router-dom";

import appConfig from "../config/appConfig";
import { useGetCookbookQuery } from "../services/cookbookApi";
import { useState } from "react";

export default function ChefSpace() {
  const [showAddMenuItemModal, setShowAddMenuItemModal] = useState(false);
  // Chef Space configuration (can be loaded from backend)
  const chefSpaceConfig = {
    branding: appConfig.branding,
    text: appConfig.text.chefSpace,
    user: appConfig.defaultUser,
    navigation: appConfig.navigation.primary,
    ui: {
      pageTitle: "Menu Book",
      searchPlaceholder: "Search menu items...",
      addButton: "Add Menu Item",
      viewDetails: "View Details",
      filterLabel: "Filter by Category:",
      categories: [
        "All Items",
        "Appetizers",
        "Main Course",
        "Desserts",
        "Beverages",
      ],
    },
    categoryStyles: {
      "Main Course": { backgroundColor: "#DCFCE7", color: "#166534" },
      Appetizer: { backgroundColor: "#DBEAFE", color: "#1E40AF" },
      Dessert: { backgroundColor: "#FCE7F3", color: "#9D174D" },
      Beverage: { backgroundColor: "#F3E8FF", color: "#6B21A8" },
    },
  };

  const { data: cookbookItems } = useGetCookbookQuery();
  // Fallback menu items data (can be removed once API always available)

  const openAddMenuItemModal = () => {
    setShowAddMenuItemModal(true);
  };

  return (
    <div className="h-screen flex flex-col overflow-y-hidden">
      {/* Static Filter Section */}
      <div className="flex-shrink-0 pb-[24px]">
        <div className="flex justify-between items-center">
          <div className="flex flex-wrap gap-1 items-center">
            <label className="text-sm font-medium text-gray-700">
              {chefSpaceConfig.ui.filterLabel}
            </label>
            {chefSpaceConfig.ui.categories.map((category, index) => (
              <button
                key={category}
                className={`px-2 py-1 text-sm font-medium transition-colors border-b-2 ${
                  index === 0
                    ? "text-indigo-600 border-indigo-600 border-b-2"
                    : "text-gray-700 border-b-transparent"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          <button onClick={openAddMenuItemModal} className="px-[10px] py-[6px] bg-indigo-600 text-white text-[12px] font-normal rounded-lg border border-indigo-600 transition-colors">
            Add Menu Item
          </button>
        </div>
      </div>

      {/* Scrollable Menu Items Grid */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <div>
          {cookbookItems && cookbookItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 scrollbar-hide">
              {cookbookItems?.map((item: any) => {
                const category =
                  item.category || item.category_name || "Main Course";
                const categoryStyle = chefSpaceConfig.categoryStyles[
                  category as keyof typeof chefSpaceConfig.categoryStyles
                ] || { backgroundColor: "#F3F4F6", color: "#6B7280" };

                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="relative">
                      <img
                        src={
                          item.image_url ||
                          (item.image_path
                            ? `${appConfig.api.assetPrefix}${item.image_path}`
                            : item.image)
                        }
                        alt={item.name}
                        className="w-full h-[152px] object-cover"
                      />
                      <div
                        className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-medium"
                        style={{
                          backgroundColor: categoryStyle.backgroundColor,
                          color: categoryStyle.color,
                        }}
                      >
                        {category}
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-gray-700 text-lg mb-2 line-clamp-1">
                        {item.name}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {item.description || item.instructions}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="font-normal text-lg text-gray-900">
                            {typeof item.price === "string"
                              ? `$${item.price}`
                              : item.price}
                          </span>
                          <div className="flex items-center gap-1">
                            <svg
                              width="16"
                              height="15"
                              viewBox="0 0 16 15"
                              fill="none"
                              className="text-yellow-400"
                            >
                              <path
                                d="M8 0L10.163 5.26L16 5.26L11.919 8.984L14.082 14.244L8 10.52L1.918 14.244L4.081 8.984L0 5.26L5.837 5.26L8 0Z"
                                fill="currentColor"
                              />
                            </svg>
                            <span className="text-sm font-normal text-gray-700">
                              {item.rating || "4.8"}
                            </span>
                          </div>
                        </div>
                        <Link
                          to={`/chefspace/${item.id}`}
                          className="px-[10px] py-[6px] text-indigo-600 text-[12px] font-normal rounded-lg border border-indigo-600 transition-colors"
                        >
                          {chefSpaceConfig.ui.viewDetails}
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="text-gray-400 mb-4">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                  <path
                    d="M9 14H39L36 38H12L9 14ZM9 14L7 2H2"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No items found
              </h3>
              <p className="text-gray-600">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
