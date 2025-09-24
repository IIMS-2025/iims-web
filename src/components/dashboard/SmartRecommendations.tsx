import React from "react";
import { SparkleIcon, AlertIcon, DollarIcon } from "../../assets/icons/index";
import {
  getRecommendationCardClasses,
  CSS_CLASSES,
} from "../../utils/dashboardHelpers";

interface RecommendationCardProps {
  type: "alert" | "opportunity" | "prevention";
  title: string;
  description: string;
  buttonText: string;
  icon: React.ReactNode;
  onButtonClick?: () => void;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({
  type,
  title,
  description,
  buttonText,
  icon,
  onButtonClick,
}) => {
  const getButtonClasses = () => {
    switch (type) {
      case "alert":
        return "mt-3 px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-lg hover:bg-blue-200 transition-colors";
      case "opportunity":
        return "mt-3 px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-lg hover:bg-green-200 transition-colors";
      case "prevention":
        return "mt-3 px-3 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-lg hover:bg-orange-200 transition-colors";
      default:
        return "mt-3 px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-lg hover:bg-gray-200 transition-colors";
    }
  };

  const getIconContainerClasses = () => {
    switch (type) {
      case "alert":
        return "w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0";
      case "opportunity":
        return "w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0";
      case "prevention":
        return "w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0";
      default:
        return "w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0";
    }
  };

  return (
    <div className={getRecommendationCardClasses(type)}>
      <div className="flex items-start gap-3 mb-3">
        <div className={getIconContainerClasses()}>{icon}</div>
        <div>
          <h4 className="font-semibold text-gray-900 mb-2">{title}</h4>
          <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
          <button className={getButtonClasses()} onClick={onButtonClick}>
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export const SmartRecommendations: React.FC = () => {
  return (
    <div className={`${CSS_CLASSES.WHITE_CARD} ${CSS_CLASSES.SECTION_SPACING}`}>
      <div className={CSS_CLASSES.CARD_HEADER}>
        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
          <SparkleIcon className="text-white w-5 h-5" />
        </div>
        <div className="flex items-center gap-3">
          <h2 className={CSS_CLASSES.TITLE_SECONDARY}>Smart Recommendations</h2>
          <div className={CSS_CLASSES.BADGE_PRIMARY}>AI-Powered</div>
        </div>
      </div>
      <div className={CSS_CLASSES.GRID_3_COLS}>
        <div className="user-guilde-recommendation-card">
          <RecommendationCard
            type="alert"
            title="Inventory Alert"
            description="Increase pasta inventory by 30% for tomorrow's lunch rush based on current demand trends."
            buttonText="Make order for past"
            icon={<AlertIcon className="text-blue-600 w-4 h-4" />}
          />
        </div>
        <RecommendationCard
          type="opportunity"
          title="Revenue Opportunity"
          description="Pizza sales peak at 7PM. Consider promoting premium toppings during this window."
          buttonText="Create Promo for more opportunity"
          icon={<DollarIcon className="text-green-600 w-4 h-4" />}
        />
        <RecommendationCard
          type="prevention"
          title="Waste Prevention"
          description="Lettuce usage down 15%. Promote salads today to reduce potential waste by Thursday."
          buttonText="Push Salads"
          icon={<SparkleIcon className="text-orange-600 w-4 h-4" />}
        />
      </div>
    </div>
  );
};
