import { useParams } from "react-router-dom";

import { useGetCookbookItemQuery } from "../services/cookbookApi";
import { getIngredientIcon } from "../utils/chefSpaceHelpers";
import {
  ClockIcon,
  ShieldIcon,
  StarIcon,
  EyeIcon,
  CheckIcon,
  LightBulbIcon,
} from "../components/icons/ChefSpaceIcons";
import "../styles/chefSpaceDetail.css";
import { colors } from "../styles/colors";

export default function ChefSpaceDetail() {
  const { id } = useParams();
  const productId = String(id);
  const { data: cookbookItem } = useGetCookbookItemQuery(productId);

  const getStockStatus = (stockStatus: string | number) => {
    switch (stockStatus) {
      case "low_stock":
        return <span style={{ color: colors.warning }}>Low Stock</span>;
      case "in_stock":
        return <span style={{ color: colors.success }}>Available</span>;
      case "dead_stock":
        return <span style={{ color: "darkgreen" }}>Dead Stock</span>;
      case "out_of_stock":
        return <span style={{ color: colors.danger }}>Out of Stock</span>;
      default:
        return <span style={{ color: colors.textMuted }}>Unknown</span>;
    }
  };

  const chefTipsArray = [
    "Use fresh ingredients",
    "Check Expiry Dates",
    "Check the temperature of the oven",
    "Check everything is properly preheated",
  ];

  return (
    <div className="w-full h-full">
      <div className="content-grid">
        {/* Left Column - Recipe Card */}
        <div>
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden h-fit mb-6">
            <div className="relative w-full h-64">
              <img
                src={cookbookItem?.image_url}
                alt={cookbookItem?.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                {cookbookItem?.name}
              </h2>
              <p className="text-gray-600 text-base leading-6 mb-6">
                {cookbookItem?.description}
              </p>

              <div className="flex gap-4 mb-4">
                <div className="flex flex-col items-center gap-1 bg-blue-50 rounded-lg px-1 py-3 flex-1">
                  <div className="flex flex-row gap-2 items-center align-middle">
                    <ClockIcon size={20} />
                    <div className="text-gray-600 text-[16px]">Prep Time</div>
                  </div>
                  <div className="text-gray-900 text-[18px] font-normal">
                    {cookbookItem?.prep_time} mins
                  </div>
                </div>
                <div className="flex flex-col items-center gap-1 bg-blue-50 rounded-lg px-1 py-3 flex-1">
                  <div className="flex flex-row gap-2 items-center align-middle">
                    <ShieldIcon size={20} />
                    <div className="text-gray-600 text-[16px]">Cook Time</div>
                  </div>
                  <div className="text-gray-900 text-[18px] font-normal">
                    {cookbookItem?.cook_time} mins
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="text-2xl font-bold text-indigo-600">
                  ${cookbookItem?.price}
                </div>
                {cookbookItem?.created_by && (
                  <div>By {cookbookItem?.created_by}</div>
                )}
                {cookbookItem?.rating && (
                  <div className="flex items-center gap-2">
                    <StarIcon size={18} />
                    <span className="text-gray-900 font-semibold">
                      {cookbookItem?.rating}
                    </span>
                    <span className="text-gray-600 text-sm">
                      ({cookbookItem?.reviews})
                    </span>
                  </div>
                )}
              </div>

              {/* <div className="flex items-center gap-2 text-gray-600 text-sm">
              <EyeIcon size={18} />
              <span>{cookbookItem?.servings}</span>
            </div> */}
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-6 mt-6 mb-6">
            <div className="flex flex-row gap-2 items-center">
              <LightBulbIcon size={14} />
              <h4 className="text-gray-900 font-semibold text-[18px]">
                Chef's Tips
              </h4>
            </div>
            <div className="flex flex-col p-[16px] pb-0">
              {chefTipsArray.map((tip, index) => (
                <li key={index} className="text-gray-600 text-[16px] mb-2">
                  {tip}
                </li>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Ingredients & Instructions */}
        <div className="flex flex-col gap-8">
          {/* Ingredients Section */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                Required Ingredients
              </h3>
              <button className="flex items-center gap-2 px-3 py-1 text-indigo-600 border border-indigo-600 hover:bg-gray-50 rounded-md transition-colors">
                <CheckIcon size={14} />
                Check Availability
              </button>
            </div>

            <div className="ingredients-table">
              <table>
                <thead>
                  <tr>
                    <th className="min-w-[250px]">Ingredient</th>
                    <th className="min-w-[150px]">Quantity</th>
                    <th className="min-w-[150px]">Stock Status</th>
                  </tr>
                </thead>
                <tbody>
                  {cookbookItem?.ingredients?.map((ingredient, index) => (
                    <tr key={index}>
                      <td className="min-w-[250px]">
                        <div className="flex items-center gap-3">
                          <div
                            className="ingredient-dot"
                            style={{
                              backgroundColor: getIngredientIcon(ingredient),
                            }}
                          />
                          <span className="text-gray-900 font-medium">
                            {ingredient.name}
                          </span>
                        </div>
                      </td>
                      <td className="text-black font-medium min-w-[150px]">
                        {`${ingredient.required_quantity} ${ingredient.unit}`}
                      </td>
                      <td className="min-w-[150px]">{getStockStatus(ingredient.stock_status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Cooking Instructions */}
          <div className="bg-white rounded-2xl shadow-sm p-6 pb-0 mb-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 text-[18px]">
              Cooking Instructions
            </h3>
            <div className="mb-8 flex flex-col px-[2px]">
              {cookbookItem?.instructions?.map((instruction, index) => (
                <div key={index} className="flex flex-row gap-2 items-center mb-2">
                    <div className="text-white text-[18px] font-normal bg-blue-400 rounded-full w-[28px] h-[28px] flex items-center justify-center">{index + 1}</div>
                  <div className="text-gray-600 text-[16px]">
                    {instruction}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
