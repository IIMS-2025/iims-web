// TypeScript interfaces for application configuration

export interface AppBranding {
    primaryColor: string;
    logoIcon: string;
    brandName: string;
}

export interface AppRoutes {
    default: string;
    login: string;
    fallback: string;
}

export interface ApiConfig {
    baseUrl: string;
    timeout: number;
    retryAttempts: number;
}

export interface AuthConfig {
    tokenKey: string;
    refreshTokenKey: string;
    tokenExpireKey: string;
}

export interface UIConfig {
    sidebarWidth: string;
    topbarHeight: string;
    searchInputWidth: string;
    defaultAvatar: string;
}

export interface DefaultUser {
    name: string;
    role: string;
    avatar: string;
    initials: string;
}

export interface TenantConfig {
    name: string;
    currency: string;
    locale: string;
}

export interface FeatureFlags {
    realTimeUpdates: boolean;
    autoRefresh: boolean;
    webSocketSupport: boolean;
    darkMode: boolean;
    multiTenant: boolean;
    analytics: boolean;
    notifications: boolean;
}

export interface NavigationItem {
    id: string;
    label: string;
    path: string;
    icon?: string;
}

export interface NavigationConfig {
    primary: NavigationItem[];
    secondary: NavigationItem[];
}

export interface LoginFormLabels {
    email: string;
    password: string;
    rememberMe: string;
    forgotPassword: string;
    signIn: string;
    signUp: string;
}

export interface SocialSignInText {
    dividerText: string;
    google: string;
    apple: string;
    noAccount: string;
}

export interface ChefSpaceText {
    title: string;
    searchPlaceholder: string;
    addMenuItem: string;
    viewDetails: string;
    filterLabel: string;
    categories: string[];
}

export interface ChatbotResponses {
    stock: string;
    forecast: string;
    default: string;
}

export interface ChatbotText {
    welcomeMessage: string;
    placeholder: string;
    sendButton: string;
    responses: ChatbotResponses;
}

export interface TextConfig {
    searchPlaceholder: string;
    loginWelcome: string;
    loginSubtitle: string;
    loginFormLabels: LoginFormLabels;
    socialSignIn: SocialSignInText;
    chefSpace: ChefSpaceText;
    chatbot: ChatbotText;
}

export interface RefreshConfig {
    dashboard: number;
    metrics: number;
    charts: number;
    notifications: number;
    realTime: number;
}

export interface ChartColors {
    primary: string;
    success: string;
    warning: string;
    danger: string;
    info: string;
}

export interface ChartAnimations {
    enabled: boolean;
    duration: number;
}

export interface ChartsConfig {
    defaultColors: ChartColors;
    animations: ChartAnimations;
}

export interface PaginationConfig {
    defaultPageSize: number;
    pageSizeOptions: number[];
}

export interface UploadConfig {
    maxFileSize: number;
    allowedImageTypes: string[];
    allowedDocumentTypes: string[];
}

// Main app configuration interface
export interface AppConfig {
    name: string;
    version: string;
    description: string;
    icon: string;
    branding: AppBranding;
    routes: AppRoutes;
    api: ApiConfig;
    auth: AuthConfig;
    ui: UIConfig;
    defaultUser: DefaultUser;
    tenant: TenantConfig;
    features: FeatureFlags;
    navigation: NavigationConfig;
    text: TextConfig;
    refresh: RefreshConfig;
    charts: ChartsConfig;
    pagination: PaginationConfig;
    upload: UploadConfig;
}

// Menu item types for ChefSpace
export interface MenuItem {
    id: number;
    name: string;
    description: string;
    price: string;
    rating: string;
    category: string;
    image: string;
}

export interface CategoryStyle {
    backgroundColor: string;
    color: string;
}

export interface CategoryStyles {
    [key: string]: CategoryStyle;
}

// Login page specific types
export interface SocialProvider {
    id: string;
    name: string;
    icon: React.ReactNode;
}

export interface LoginRightPanel {
    title: string;
    subtitle: string;
    imageAlt: string;
}

export interface LoginContent {
    rightPanel: LoginRightPanel;
    socialProviders: SocialProvider[];
}

export interface LoginConfig {
    branding: AppBranding;
    routes: AppRoutes;
    text: TextConfig;
    assets: {
        loginGraph: string;
    };
    content: LoginContent;
}

// ChefSpace specific types
export interface ChefSpaceUIConfig {
    pageTitle: string;
    searchPlaceholder: string;
    addButton: string;
    viewDetails: string;
    filterLabel: string;
    categories: string[];
}

export interface ChefSpaceConfig {
    branding: AppBranding;
    text: ChefSpaceText;
    user: DefaultUser;
    navigation: NavigationItem[];
    ui: ChefSpaceUIConfig;
    categoryStyles: CategoryStyles;
}

// Chatbot specific types
export interface ChatbotUIConfig {
    height: number;
    padding: number;
    maxWidth: number;
}

export interface ChatbotConfig {
    text: ChatbotText;
    ui: ChatbotUIConfig;
    responses: ChatbotResponses;
}

// Layout specific types
export interface LayoutConfig {
    branding: AppBranding;
    tenant: TenantConfig;
    user: DefaultUser;
    version: string;
    description: string;
    ui: UIConfig;
    text: TextConfig;
    navigation: NavigationConfig;
}

// Routing specific types
export interface RoutingConfig {
    routes: AppRoutes;
    features: FeatureFlags;
}

// Environment-specific configuration
export interface EnvironmentConfig extends AppConfig {
    // Can include environment-specific overrides
}

export type AppConfigFunction = () => AppConfig;
