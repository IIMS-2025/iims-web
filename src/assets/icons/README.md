# Icons Assets Migration

This directory contains all SVG icons used in the application, organized as separate files and exported through a clean index.ts interface.

## 📁 Structure

```
src/assets/icons/
├── index.ts              # Main export file with React components
├── README.md             # This documentation
├── sparkle.svg           # Sparkle/star icon
├── ai-badge.svg          # AI badge icon
├── trend-up.svg          # Trend up arrow icon
├── user.svg              # User profile icon
├── chevron-down.svg      # Chevron down icon
├── alert.svg             # Alert/warning icon
├── ai.svg                # AI/artificial intelligence icon
├── dollar.svg            # Dollar/currency icon
├── chart.svg             # Chart/analytics icon
├── clock.svg             # Clock/time icon
├── pizza.svg             # Pizza/food icon
└── chart-bars.svg        # Bar chart icon
```

## 🎯 Benefits of This Approach

### **1. Better Organization**
- Each icon is in its own file for easy maintenance
- Clear naming convention following kebab-case
- Separate concerns between icon data and component logic

### **2. Improved Performance**
- Tree-shaking friendly exports
- Smaller bundle sizes through selective imports
- Better caching at the file level

### **3. Enhanced Developer Experience**
- IntelliSense support for all icon properties
- Consistent API across all icons
- Easy to add new icons following the same pattern

### **4. Flexible Usage**
```typescript
// Basic usage
<SparkleIcon className="text-blue-500" />

// With custom size
<ChartIcon size={24} />

// With specific dimensions
<UserIcon width={32} height={40} />
```

## 🔧 Icon Component API

All icons support the following props:

```typescript
interface IconProps {
  className?: string;          // CSS classes for styling
  size?: number | string;      // Sets both width and height
  width?: number | string;     // Specific width override
  height?: number | string;    // Specific height override
}
```

## 📦 Available Icons

| Icon | Component | Description |
|------|-----------|-------------|
| ✨ | `SparkleIcon` | Sparkle/magic effect |
| 🤖 | `AIBadgeIcon` | AI badge with fixed color |
| 📈 | `TrendUpIcon` | Upward trend arrow |
| 👤 | `UserIcon` | User profile |
| ⬇️ | `ChevronDownIcon` | Dropdown chevron |
| ⚠️ | `AlertIcon` | Alert/warning |
| 🧠 | `AIIcon` | AI/artificial intelligence |
| 💰 | `DollarIcon` | Currency/money |
| 📊 | `ChartIcon` | Line chart |
| 🕐 | `ClockIcon` | Time/schedule |
| 🍕 | `PizzaIcon` | Food/pizza |
| 📊 | `ChartBarsIcon` | Bar chart |

## 🔄 Import Examples

```typescript
// Import specific icons
import { SparkleIcon, ChartIcon } from '../assets/icons';

// Import with aliases
import { 
  SparkleIcon as Star, 
  ChartIcon as Analytics 
} from '../assets/icons';

// Import all icons (not recommended for bundle size)
import Icons from '../assets/icons';
// Usage: <Icons.Sparkle />
```

## 🎨 Styling Guidelines

### **Color Handling**
- Most icons use `currentColor` for automatic color inheritance
- `AIBadgeIcon` has a fixed color (#5F63F2) for brand consistency
- Override colors using Tailwind classes: `text-blue-500`, `text-red-600`, etc.

### **Size Conventions**
- Small icons: 16px (default for most)
- Medium icons: 20px (chart and utility icons)
- Large icons: 24px+ (primary actions)

### **Usage Patterns**
```typescript
// Dashboard metrics
<DollarIcon className="text-amber-600 w-5 h-5" />

// Navigation elements
<ChevronDownIcon className="text-gray-400 w-4 h-4" />

// Status indicators
<AlertIcon className="text-red-500 w-6 h-6" />
```

## 🚀 Adding New Icons

1. **Create SVG file**: Add new icon as `icon-name.svg`
2. **Export component**: Add to `index.ts` following the existing pattern
3. **Update documentation**: Add entry to the table above
4. **Test usage**: Verify the icon works in target components

### **Template for New Icons**
```typescript
// In index.ts
export const NewIcon: React.FC<IconProps> = ({ 
  className = "", 
  size, 
  width = size || 20, 
  height = size || 20 
}) => (
  <svg width={width} height={height} viewBox="0 0 20 20" fill="none" className={className}>
    {/* SVG content */}
  </svg>
);
```

This migration ensures better maintainability, performance, and developer experience while keeping the same visual design and functionality.
