import { Link } from "react-router-dom";
import {
    margheritaPizza,
    caesarSalad,
    chocolateLavaCake,
    grilledSalmon,
    berrySmootchieBowl,
    buffaloWings,
    classicBeefBurger,
    classicTiramisu
} from "../assets";
import appConfig from "../config/appConfig";

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
            categories: ["All Items", "Appetizers", "Main Course", "Desserts", "Beverages"]
        },
        categoryStyles: {
            "Main Course": { backgroundColor: "#DCFCE7", color: "#166534" },
            "Appetizer": { backgroundColor: "#DBEAFE", color: "#1E40AF" },
            "Dessert": { backgroundColor: "#FCE7F3", color: "#9D174D" },
            "Beverage": { backgroundColor: "#F3E8FF", color: "#6B21A8" }
        }
    };

    // Menu items data (can be loaded from backend)
    const menuItems = [
        {
            id: 1,
            name: "Margherita Pizza",
            description: "Classic Italian pizza with fresh tomatoes, mozzarella cheese, and aromatic basil leaves on a crispy thin crust.",
            price: "$18.99",
            rating: "4.8",
            category: "Main Course",
            image: margheritaPizza
        },
        {
            id: 2,
            name: "Caesar Salad",
            description: "Fresh romaine lettuce tossed with grilled chicken, parmesan cheese, croutons and our signature caesar dressing.",
            price: "$14.50",
            rating: "4.6",
            category: "Appetizer",
            image: caesarSalad
        },
        {
            id: 3,
            name: "Chocolate Lava Cake",
            description: "Warm chocolate cake with a molten center, served with vanilla ice cream and fresh berries.",
            price: "$9.99",
            rating: "4.9",
            category: "Dessert",
            image: chocolateLavaCake
        },
        {
            id: 4,
            name: "Grilled Salmon",
            description: "Fresh Atlantic salmon grilled to perfection, served with seasonal roasted vegetables and lemon butter sauce.",
            price: "$26.99",
            rating: "4.7",
            category: "Main Course",
            image: grilledSalmon
        },
        {
            id: 5,
            name: "Berry Smoothie Bowl",
            description: "Refreshing blend of mixed berries, banana, and yogurt topped with granola, coconut flakes, and fresh fruits.",
            price: "$12.50",
            rating: "4.5",
            category: "Beverage",
            image: berrySmootchieBowl
        },
        {
            id: 6,
            name: "Buffalo Wings",
            description: "Crispy chicken wings tossed in spicy buffalo sauce, served with celery sticks and blue cheese dip.",
            price: "$16.99",
            rating: "4.4",
            category: "Appetizer",
            image: buffaloWings
        },
        {
            id: 7,
            name: "Classic Beef Burger",
            description: "Juicy beef patty with lettuce, tomato, onion, pickles and our special sauce, served with crispy fries.",
            price: "$19.99",
            rating: "4.6",
            category: "Main Course",
            image: classicBeefBurger
        },
        {
            id: 8,
            name: "Classic Tiramisu",
            description: "Traditional Italian dessert with layers of coffee-soaked ladyfingers, mascarpone cream, and cocoa powder.",
            price: "$8.99",
            rating: "4.8",
            category: "Dessert",
            image: classicTiramisu
        }
    ];

    return (
        <div className="home-page">
            {/* Sidebar */}
            <aside className="home-sidebar">
                {/* Brand Section */}
                <div className="sidebar-brand">
                    <div className="brand-icon">
                        <svg width="16" height="18" viewBox="0 0 16 18" fill="none">
                            <path d="M8 0L8 18M0 9L16 9M2 4L14 4M2 14L14 14" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    </div>
                    <div className="brand-text">{chefSpaceConfig.branding.brandName}</div>
                </div>

                {/* Navigation */}
                <nav className="sidebar-nav">
                    <Link to="/home" className="nav-item">
                        <div className="nav-icon">
                            <svg width="20" height="18" viewBox="0 0 20 18" fill="none">
                                <path d="M2 16H18M2 16V8L10 2L18 8V16M2 16H6M18 16H14M6 16V12H14V16M6 16H14" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <div className="nav-text">Home</div>
                    </Link>

                    <Link to="/inventory" className="nav-item">
                        <div className="nav-icon">
                            <svg width="20" height="18" viewBox="0 0 20 18" fill="none">
                                <path d="M3 3H17L15 13H5L3 3ZM3 3L2 1H1M7 17C7.55228 17 8 16.5523 8 16C8 15.4477 7.55228 15 7 15C6.44772 15 6 15.4477 6 16C6 16.5523 6.44772 17 7 17ZM15 17C15.5523 17 16 16.5523 16 16C16 15.4477 15.5523 15 15 15C14.4477 15 14 15.4477 14 16C14 16.5523 14.4477 17 15 17Z" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <div className="nav-text">Inventory Dashboard</div>
                    </Link>

                    <Link to="/orders-insights" className="nav-item">
                        <div className="nav-icon">
                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                                <path d="M9 1V17M1 9H17M13 5L5 13M5 5L13 13" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                        </div>
                        <div className="nav-text">Orders & Insights</div>
                    </Link>

                    <div className="nav-item">
                        <div className="nav-icon">
                            <svg width="20" height="18" viewBox="0 0 20 18" fill="none">
                                <path d="M3 7H17L15 17H5L3 7ZM3 7L2 1H1M12 7V5C12 3.89543 11.1046 3 10 3C8.89543 3 8 3.89543 8 5V7" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <div className="nav-text">Inventory Usage</div>
                    </div>

                    <div className="nav-item active">
                        <div className="nav-icon">
                            <svg width="20" height="18" viewBox="0 0 20 18" fill="none">
                                <path d="M10 1L3 5V11C3 14.866 6.134 18 10 18C13.866 18 17 14.866 17 11V5L10 1Z" stroke="#5F63F2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <div className="nav-text">Chef Space</div>
                    </div>
                </nav>

                {/* User Profile Section */}
                <div className="sidebar-bottom">
                    <div className="user-profile">
                        <img
                            src="https://dummyimage.com/40x40/6366F1/ffffff&text=AM"
                            alt="Anna Miller"
                            className="user-avatar"
                        />
                        <div className="user-info">
                            <div className="user-name">Anna Miller</div>
                            <div className="user-role">Store Manager</div>
                        </div>
                        <button className="user-menu-btn">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M8 9C8.55228 9 9 8.55228 9 8C9 7.44772 8.55228 7 8 7C7.44772 7 7 7.44772 7 8C7 8.55228 7.44772 9 8 9ZM8 4C8.55228 4 9 3.55228 9 3C9 2.44772 8.55228 2 8 2C7.44772 2 7 2.44772 7 3C7 3.55228 7.44772 4 8 4ZM8 14C8.55228 14 9 13.5523 9 13C9 12.4477 8.55228 12 8 12C7.44772 12 7 12.4477 7 13C7 13.5523 7.44772 14 8 14Z" fill="#6B7280" />
                            </svg>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="home-main">
                {/* Header */}
                <header className="home-header">
                    <h1 className="page-title">{chefSpaceConfig.ui.pageTitle}</h1>
                    <div className="header-actions">
                        <div className="search-container">
                            <input
                                type="text"
                                placeholder={chefSpaceConfig.ui.searchPlaceholder}
                                className="search-input"
                            />
                            <div className="search-icon">
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <path d="M7.33333 12.6667C10.2789 12.6667 12.6667 10.2789 12.6667 7.33333C12.6667 4.38781 10.2789 2 7.33333 2C4.38781 2 2 4.38781 2 7.33333C2 10.2789 4.38781 12.6667 7.33333 12.6667Z" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M14 14L11.1 11.1" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                        </div>
                        <button className="header-btn">
                            <svg width="17.5" height="20" viewBox="0 0 18 20" fill="none">
                                <path d="M7 17H17L15 7H5L7 17ZM7 17C7 18.1046 6.10457 19 5 19C3.89543 19 3 18.1046 3 17M7 17C7 15.8954 6.10457 15 5 15C3.89543 15 3 15.8954 3 17M15 7V5C15 2.23858 12.7614 0 10 0C7.23858 0 5 2.23858 5 5V7" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                        <button className="header-profile-btn">
                            <div className="header-profile-avatar">{chefSpaceConfig.user.initials}</div>
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                <path d="M3 4.5L6 7.5L9 4.5" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                        <button className="add-menu-item-btn">
                            <svg width="12.25" height="14" viewBox="0 0 12 14" fill="none">
                                <path d="M6 1V13M1 7H11" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            {chefSpaceConfig.ui.addButton}
                        </button>
                    </div>
                </header>

                {/* Content */}
                <div className="home-content">
                    {/* Filter Section */}
                    <section className="filter-section">
                        <div className="filter-container">
                            <label className="filter-label">{chefSpaceConfig.ui.filterLabel}</label>
                            <div className="filter-buttons">
                                {chefSpaceConfig.ui.categories.map((category, index) => (
                                    <button
                                        key={category}
                                        className={`filter-btn ${index === 0 ? 'active' : ''}`}
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
                            {menuItems.map((item) => {
                                const categoryStyle = chefSpaceConfig.categoryStyles[item.category as keyof typeof chefSpaceConfig.categoryStyles] ||
                                    { backgroundColor: "#F3F4F6", color: "#6B7280" };

                                return (
                                    <div key={item.id} className="menu-item-card">
                                        <div className="card-image-container">
                                            <img src={item.image} alt={item.name} className="card-image" />
                                            <div className="category-tag" style={{ backgroundColor: categoryStyle.backgroundColor }}>
                                                <span style={{ color: categoryStyle.color }}>{item.category}</span>
                                            </div>
                                        </div>
                                        <div className="card-content">
                                            <h3 className="card-title">{item.name}</h3>
                                            <p className="card-description">{item.description}</p>
                                            <div className="card-footer">
                                                <div className="price-rating">
                                                    <span className="price">{item.price}</span>
                                                    <div className="rating">
                                                        <svg width="15.75" height="14" viewBox="0 0 16 15" fill="none">
                                                            <path d="M8 0L10.163 5.26L16 5.26L11.919 8.984L14.082 14.244L8 10.52L1.918 14.244L4.081 8.984L0 5.26L5.837 5.26L8 0Z" fill="#FACC15" />
                                                        </svg>
                                                        <span className="rating-value">{item.rating}</span>
                                                    </div>
                                                </div>
                                                <button className="view-details-btn">{chefSpaceConfig.ui.viewDetails}</button>
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
                                    <path d="M8 1L2 8L8 15" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                            <button className="pagination-btn active">1</button>
                            <button className="pagination-btn">2</button>
                            <button className="pagination-btn">3</button>
                            <button className="pagination-btn">
                                <svg width="10" height="16" viewBox="0 0 10 16" fill="none">
                                    <path d="M2 1L8 8L2 15" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}
