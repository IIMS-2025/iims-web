import { useParams } from "react-router-dom";

import { useGetCookbookItemQuery } from "../services/cookbookApi";
export default function ChefSpaceDetail() {
    const { id } = useParams();
    const productId = String(id);
    const { data: cookbookItem } = useGetCookbookItemQuery(productId);


    const getIngredientIcon = (ingredient: any) => {
        if (ingredient.name.toLowerCase().includes('cheese')) {
            return '#F59E0B'; // Orange for cheese
        }
        return '#10B981'; // Green for others
    };

    return (
        <div>
           

                {/* Content */}
                <div className="detail-content">
                    <div className="content-grid">
                        {/* Left Column - Recipe Card */}
                        <div className="recipe-card">
                            <div className="recipe-image">
                                <img src={cookbookItem?.image_url} alt={cookbookItem?.name} />
                                <div className="category-tag">
                                    <span>{cookbookItem?.category}</span>
                                </div>
                            </div>
                            <div className="recipe-info">
                                <h2 className="recipe-title">{cookbookItem?.name}</h2>
                                <p className="recipe-description">{cookbookItem?.description}</p>

                                <div className="recipe-meta">
                                    <div className="meta-cookbookItem?">
                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                            <path d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18Z" stroke="#5F63F2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M10 6V10L13 13" stroke="#5F63F2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        <div>
                                            <div className="meta-label">Prep Time</div>
                                            <div className="meta-value">{cookbookItem?.prepTime}</div>
                                        </div>
                                    </div>
                                    <div className="meta-cookbookItem?">
                                        <svg width="18" height="20" viewBox="0 0 18 20" fill="none">
                                            <path d="M9 18C12.866 18 16 14.866 16 11V5L9 1L2 5V11C2 14.866 5.134 18 9 18Z" stroke="#5F63F2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        <div>
                                            <div className="meta-label">Cook Time</div>
                                            <div className="meta-value">{cookbookItem?.cookTime}</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="recipe-footer">
                                    <div className="price">{cookbookItem?.price}</div>
                                    <div className="rating-info">
                                        <svg width="18" height="16" viewBox="0 0 18 16" fill="none">
                                            <path d="M9 0L11.163 5.26L17 5.26L12.919 8.984L15.082 14.244L9 10.52L2.918 14.244L5.081 8.984L1 5.26L6.837 5.26L9 0Z" fill="#FACC15" />
                                        </svg>
                                        <span className="rating">{cookbookItem?.rating}</span>
                                        <span className="reviews">({cookbookItem?.reviews})</span>
                                    </div>
                                </div>

                                <div className="serving-info">
                                    <svg width="18" height="14" viewBox="0 0 18 14" fill="none">
                                        <path d="M1 7C1 7 4 1 9 1C14 1 17 7 17 7C17 7 14 13 9 13C4 13 1 7 1 7Z" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M9 9C10.1046 9 11 8.10457 11 7C11 5.89543 10.1046 5 9 5C7.89543 5 7 5.89543 7 7C7 8.10457 7.89543 9 9 9Z" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    <span>{cookbookItem?.servings}</span>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Ingredients & Instructions */}
                        <div className="recipe-details">
                            {/* Ingredients Section */}
                            <div className="ingredients-section">
                                <div className="section-header">
                                    <h3>Required Ingredients</h3>
                                    <button className="check-availability-btn">
                                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                            <path d="M11 4L5 10L1 6" stroke="#5F63F2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        Check Availability
                                    </button>
                                </div>

                                <div className="ingredients-table">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Ingredient</th>
                                                <th>Quantity</th>
                                                <th>Unit</th>
                                                <th>Stock Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {cookbookItem?.ingredients?.map((ingredient, index) => (
                                                <tr key={index}>
                                                    <td>
                                                        <div className="ingredient-name">
                                                            <div
                                                                className="ingredient-dot"
                                                                style={{ backgroundColor: getIngredientIcon(ingredient) }}
                                                            ></div>
                                                            <span>{ingredient.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="quantity">{ingredient.available_qty}</td>
                                                    <td className="unit">{ingredient.unit}</td>
                                                    <td>
                                                        <span
                                                            className="status-badge"
                                                            style={{
                                                                backgroundColor: ingredient.statusColor,
                                                                color: ingredient.textColor
                                                            }}
                                                        >
                                                            {ingredient.stock_status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Cooking Instructions */}
                            <div className="instructions-section">
                                <h3>Cooking Instructions</h3>
                                <div className="instructions-list">
                                    {cookbookItem?.instructions}
                                </div>

                                {/* Chef's Tips */}
                                <div className="chef-tips">
                                    <div className="tips-icon">
                                        <svg width="14" height="18" viewBox="0 0 14 18" fill="none">
                                            <path d="M7 0C3.134 0 0 3.134 0 7C0 9.5 1 11.5 2.5 13L4.5 17H9.5L11.5 13C13 11.5 14 9.5 14 7C14 3.134 10.866 0 7 0Z" fill="#F59E0B" />
                                        </svg>
                                    </div>
                                    <div className="tips-content">
                                        <h4>Chef's Tips</h4>
                                        <ul>
                                            {cookbookItem?.chefTips?.map((tip, index) => (
                                                <li key={index}>{tip}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
        </div>
    );
}
