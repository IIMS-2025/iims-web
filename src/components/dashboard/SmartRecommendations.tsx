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
        return "mt-3 px-3 py-1 bg-blue-700 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors border border-blue-500 align-right";
      case "opportunity":
        return "mt-3 px-3 py-1 bg-green-700 text-white text-xs font-medium rounded-lg hover:bg-green-700 transition-colors border border-green-500 align-right";
      case "prevention":
        return "mt-3 px-3 py-1 bg-orange-700 text-white text-xs font-medium rounded-lg hover:bg-orange-700 transition-colors border border-orange-500 align-right";
      default:
        return "mt-3 px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-lg hover:bg-gray-200 transition-colors border border-gray-500 align-right";
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
      <div className="flex items-start gap-3 w-[100%]">
        <div className={getIconContainerClasses()}>{icon}</div>
        <div className="w-[100%]">
          <div className="min-h-[80px]">
          <h4 className="font-semibold text-gray-900 mb-2">{title}</h4>
          <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
          </div>
          <div className="flex justify-end items-end h-full">
          <button className={getButtonClasses()} onClick={onButtonClick}>
            {buttonText}
          </button>
          </div>
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
            title="Order 18 kg Chicken Breast today"
            description="To maintain ~10-day cover; forecast shows stockout risk by Thu"
            buttonText="Make order"
            icon={<AlertIcon className="text-blue-600 w-4 h-4" />}
          />
        </div>
        <RecommendationCard
          type="opportunity"
          title="Run beverage offers to accelerate milk usage"
          description="12 L milk expires in 3 days (FEFO)"
          buttonText="Create Promo"
          icon={<DollarIcon className="text-green-600 w-4 h-4" />}
        />
        <RecommendationCard
          type="prevention"
          title="Increase Tomatoes safety stock"
          description="Increase stock from 6 kg → 9 kg for the next two weekends. Expected festival demand uplift ~18%"
          buttonText="Push Salads"
          icon={<SparkleIcon className="text-orange-600 w-4 h-4" />}
        />
      </div>
    </div>
  );
};
