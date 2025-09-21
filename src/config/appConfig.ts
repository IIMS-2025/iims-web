// Global application configuration for easy backend integration

// Application metadata
export const appConfig = {
    name: "Reztro",
    version: "v0.1",
    description: "Multi-tenant SaaS",
    icon: "🍽️",

    // Branding
    branding: {
        primaryColor: "#5F63F2",
        logoIcon: "🍽️",
        brandName: "Reztro"
    },

    // Default routes
    routes: {
        default: "/home",
        login: "/login",
        fallback: "/login"
    },

    // API configuration
    api: {
        baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001',
        timeout: 10000,
        retryAttempts: 3
    },

    // Authentication settings
    auth: {
        tokenKey: 'authToken',
        refreshTokenKey: 'refreshToken',
        tokenExpireKey: 'tokenExpiry'
    },

    // UI settings
    ui: {
        sidebarWidth: "260px",
        topbarHeight: "64px",
        searchInputWidth: "320px",
        defaultAvatar: "AM"
    },

    // Default user profile (can be overridden by backend)
    defaultUser: {
        name: "Anna Miller",
        role: "Store Manager",
        avatar: "AM",
        initials: "AM"
    },

    // Tenant configuration (can be overridden by backend)
    tenant: {
        name: "Demo Ristorante",
        currency: "USD",
        locale: "en-US"
    },

    // Feature flags
    features: {
        realTimeUpdates: true,
        autoRefresh: true,
        webSocketSupport: true,
        darkMode: false,
        multiTenant: true,
        analytics: true,
        notifications: true
    },

    // Navigation configuration
    navigation: {
        primary: [
            { id: 'home', label: 'Home', path: '/home', icon: 'home' },
            { id: 'orders-insights', label: 'Orders & Insights', path: '/orders-insights', icon: 'insights' },
            { id: 'chefspace', label: 'Chef Space', path: '/chefspace', icon: 'chef' },
            { id: 'inventory', label: 'Inventory Dashboard', path: '/inventory', icon: 'inventory' },
            { id: 'inventory-usage', label: 'Inventory Usage', path: '/inventory-usage', icon: 'usage' }
        ],
        secondary: [
            { id: 'owner', label: 'Owner Dashboard', path: '/owner' },
            { id: 'manager', label: 'Manager Dashboard', path: '/manager' },
            { id: 'chef', label: 'Chef Dashboard', path: '/chef' },
            { id: 'menu', label: 'Menu & Orders', path: '/menu' },
            { id: 'analytics', label: 'Analytics', path: '/analytics' }
        ]
    },

    // Text content
    text: {
        searchPlaceholder: "Search...",
        loginWelcome: "Hello Again!",
        loginSubtitle: "Welcome back, you've been missed!",
        loginFormLabels: {
            email: "Email Address",
            password: "Password",
            rememberMe: "Remember me",
            forgotPassword: "Forgot password?",
            signIn: "Sign In",
            signUp: "Sign up"
        },
        socialSignIn: {
            dividerText: "Or with",
            google: "Sign in with Google",
            apple: "Sign in with Apple",
            noAccount: "Don't have an account yet?"
        },
        chefSpace: {
            title: "Menu Book",
            searchPlaceholder: "Search menu items...",
            addMenuItem: "Add Menu Item",
            viewDetails: "View Details",
            filterLabel: "Filter by Category:",
            categories: ["All Items", "Appetizers", "Main Course", "Desserts", "Beverages"]
        },
        chatbot: {
            welcomeMessage: "Hi! I'm your managerial assistant. Ask about stock or forecasts.",
            placeholder: "Ask: what items are low on stock?",
            sendButton: "Send",
            responses: {
                stock: "Tomatoes at 45kg; reorder point 20kg. No action needed today.",
                forecast: "Cheese demand tomorrow: 6kg ± 2kg.",
                default: "Sorry, demo bot answers stock/forecast questions."
            }
        }
    },

    // Auto-refresh intervals (in milliseconds)
    refresh: {
        dashboard: 30000,        // 30 seconds
        metrics: 60000,          // 1 minute
        charts: 120000,          // 2 minutes
        notifications: 15000,    // 15 seconds
        realTime: 5000          // 5 seconds
    },

    // Chart default configurations
    charts: {
        defaultColors: {
            primary: "#5F63F2",
            success: "#10B981",
            warning: "#F59E0B",
            danger: "#EF4444",
            info: "#3B82F6"
        },
        animations: {
            enabled: true,
            duration: 300
        }
    },

    // Pagination settings
    pagination: {
        defaultPageSize: 10,
        pageSizeOptions: [5, 10, 25, 50, 100]
    },

    // File upload settings
    upload: {
        maxFileSize: 5 * 1024 * 1024, // 5MB
        allowedImageTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
        allowedDocumentTypes: ['application/pdf', 'text/csv', 'application/json']
    }
};

// Environment-specific overrides
export const getAppConfig = () => {
    const env = import.meta.env.MODE;

    // Development overrides
    if (env === 'development') {
        return {
            ...appConfig,
            api: {
                ...appConfig.api,
                baseUrl: 'http://localhost:3001'
            },
            features: {
                ...appConfig.features,
                realTimeUpdates: true
            }
        };
    }

    // Production overrides
    if (env === 'production') {
        return {
            ...appConfig,
            features: {
                ...appConfig.features,
                realTimeUpdates: true
            }
        };
    }

    return appConfig;
};

export default getAppConfig();
