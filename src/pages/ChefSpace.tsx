import { Link } from "react-router-dom";

import appConfig from "../config/appConfig";
import { useGetCookbookQuery } from "../services/cookbookApi";

export default function ChefSpace() {
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

  return (
    <>
      {/* Content */}
      <>
        {/* Filter Section */}
        <section className="filter-section">
          <div className="filter-container">
            <label className="filter-label">
              {chefSpaceConfig.ui.filterLabel}
            </label>
            <div className="filter-buttons">
              {chefSpaceConfig.ui.categories.map((category, index) => (
                <button
                  key={category}
                  className={`filter-btn ${index === 0 ? "active" : ""}`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Menu Items Grid */}
        <section className="menu-items-section">
          <div className="menu-items-grid">
            {cookbookItems?.map((item: any) => {
              const category =
                item.category || item.category_name || "Main Course";
              const categoryStyle = chefSpaceConfig.categoryStyles[
                category as keyof typeof chefSpaceConfig.categoryStyles
              ] || { backgroundColor: "#F3F4F6", color: "#6B7280" };

              return (
                <div key={item.id} className="menu-item-card">
                  <div className="card-image-container">
                    <img
                      src={
                        item.image_url ||
                        (item.image_path
                          ? `${appConfig.api.assetPrefix}${item.image_path}`
                          : item.image)
                      }
                      alt={item.name}
                      className="card-image"
                    />
                    <div
                      className="category-tag"
                      style={{ backgroundColor: categoryStyle.backgroundColor }}
                    >
                      <span style={{ color: categoryStyle.color }}>
                        {category}
                      </span>
                    </div>
                  </div>
                  <div className="card-content">
                    <h3 className="card-title">{item.name}</h3>
                    <p className="card-description">
                      {item.description || item.instructions}
                    </p>
                    <div className="card-footer">
                      <div className="price-rating">
                        <span className="price">
                          {typeof item.price === "string"
                            ? `$${item.price}`
                            : item.price}
                        </span>
                        <div className="rating">
                          <svg
                            width="15.75"
                            height="14"
                            viewBox="0 0 16 15"
                            fill="none"
                          >
                            <path
                              d="M8 0L10.163 5.26L16 5.26L11.919 8.984L14.082 14.244L8 10.52L1.918 14.244L4.081 8.984L0 5.26L5.837 5.26L8 0Z"
                              fill="#FACC15"
                            />
                          </svg>
                          <span className="rating-value">
                            {item.rating || "4.8"}
                          </span>
                        </div>
                      </div>
                      <Link
                        to={`/chefspace/${item.id}`}
                        className="view-details-btn"
                      >
                        {chefSpaceConfig.ui.viewDetails}
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Pagination */}
        <section className="pagination-section">
          <div className="pagination-container">
            <button className="pagination-btn">
              <svg width="10" height="16" viewBox="0 0 10 16" fill="none">
                <path
                  d="M8 1L2 8L8 15"
                  stroke="#6B7280"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button className="pagination-btn active">1</button>
            <button className="pagination-btn">2</button>
            <button className="pagination-btn">3</button>
            <button className="pagination-btn">
              <svg width="10" height="16" viewBox="0 0 10 16" fill="none">
                <path
                  d="M2 1L8 8L2 15"
                  stroke="#6B7280"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </section>
      </>
    </>
  );
}
