import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
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
            <Sidebar />

            {/* Main Content */}
            <main className="home-main">
                {/* Header */}
                <Header
                    titleSection={{
                        title: "Chef Space",
                        badge: {
                            text: "Menu Management"
                        }
                    }}
                    showSearch={true}
                    showNotification={true}
                >
                    <div className="header-actions">

                    </div>
                </Header>

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
                                                <Link to={`/chefspace/${item.id}`} className="view-details-btn">{chefSpaceConfig.ui.viewDetails}</Link>
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
