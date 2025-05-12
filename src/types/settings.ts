// // src/types/shop_settings.ts

// // Helper type for opening hours
// export interface OpeningHourRule {
//     day: number; // 0=Sunday, 1=Monday, ..., 6=Saturday
//     open: string; // "HH:MM" format (24hr)
//     closed: string; // "HH:MM" format (24hr) - Can span past midnight
// }

// // Helper type for allowed countries
// export interface AllowedCountry {
//     code: string; // Lowercase (e.g., "eg", "sa")
//     "dial-code": string; // Dialing code (e.g., "20", "966")
//     "mobile-format": string; // Regex string
// }

// // Main Settings Interface
// export interface ShopSettings {
//     // Basic Info & Branding
//     label: string;                  // Internal Label/ID (mrrx4) - Usually not editable by user
//     "web-uri"?: string | null;      // Website URL (Optional)
//     "logo-uri"?: string | null;     // Logo URL (Handled via FileUpload/display)
//     "app-brand-logo"?: string | null; // App Logo URL (Separate from main logo?)
//     "remove-branding": boolean;     // Orbis Q Branding Removal toggle

//     // Localization & Currency
//     country: string;                // Country Code (e.g., EG) - Likely display only or limited select
//     "primary-language": string;     // e.g., "ar-sa"
//     "secondary-language"?: string | null; // e.g., "en-us"
//     languages: string[];            // Array of supported language codes
//     "dialing-code": string;         // Default dialing code
//     "mobile-format": string;        // Default mobile format regex
//     "currency-code": string;        // e.g., "EGP"
//     "currency-symbol": string;      // e.g., "EGP" or "e£"
//     "currency-format": string;      // e.g., "currency_symbol_amount"
//     // Currency Translations - Might be complex to edit directly, maybe display only?
//     "currency-code-translations"?: Record<string, string>;
//     "currency-symbol-translations"?: Record<string, string>;
//     "currency-format-translations"?: Record<string, string>;
//     "rounding-mode": 'none' | 'up' | 'down' | 'half_up' | 'half_down'; // Example modes
//     "decimal-places": number;       // Decimal places for prices
//     "rounding-precision"?: number | null; // e.g., 0.05 for rounding to nearest 5 halalas

//     // Operations & Ordering
//     "default-timezone": string;     // e.g., "GMT+2", "Asia/Riyadh"
//     "default-opening-hours": string; // JSON string of OpeningHourRule[]
//     "supported-order-types": ('deliver' | 'pickup' | 'dine_in')[]; // Array of strings
//     "supported-payment-types": ('cash' | 'card' | 'card-on-delivery' | 'online')[]; // Array of strings
//     "pickup-payment-types": string[]; // Subset of supported types
//     "deliver-payment-types": string[]; // Subset of supported types
//     "order-price-calculation": 'modifier-based' | 'item-based'; // Example types
//     "allow-advance-order": boolean;
//     "max-days-allowed-in-advance-order"?: number | null;
//     "order-cancellation-time": number; // Minutes allowed to cancel
//     "order-cancellation-max-status"?: string | null; // Status code beyond which cancellation isn't allowed
//     "default-order-status-cash": string; // e.g., "posted", "pending"
//     "default-order-status-card": string;
//     "is-cart-notes-enabled": boolean | number; // Use boolean in TS
//     "is-cart-items-notes-enabled": boolean | number;
//     "cart-expiry-minutes"?: number | null;
//     "is-multi-payment-allowed": boolean;
//     "can-cancel-payment": boolean | number;
//     "is-auto-close-orders-daily": boolean | number;
//     "order-display-id-config": string; // Format string like "{id}" or "INV-{id}"

//     // Delivery Settings
//     "default-delivery-charge"?: number | string | null; // Use number in TS
//     "default-promised-time-delta-delivery": number; // Minutes
//     "minimum-order-amount-delivery"?: number | string | null; // Use number in TS
//     "maximum-order-amount-delivery"?: number | string | null;
//     "minimum-order-amount-free-delivery"?: number | string | null;
//     "special-delivery-price"?: number | string | null;
//     "minimum-order-amount-for-special-delivery"?: number | string | null;
//     "delivery-charge-per-km"?: number | string | null;
//     "delivery-maximum-distance"?: number | string | null;
//     "default-driver-location-ttl"?: number; // Minutes

//     // Pickup Settings
//     "default-promised-time-delta-pickup": number; // Minutes
//     "minimum-order-amount-pickup"?: number | string | null;

//     // Financial & VAT
//     "vat-rate": number | string; // Use number in TS
//     "vat-type": 'inclusive' | 'exclusive';
//     "vat-number"?: string | null;
//     "vat-certificate-url"?: string | null;
//     "tax-id"?: number | null; // Link to a specific Tax record?

//     // Communication & Contact
//     "call-center-number"?: string | null;
//     "feedback-email"?: string | null;
//     "alert-email"?: string | null;
//     "whatsapp-number"?: string | null;
//     "receipt-footer"?: string | null;
//     "feedback-redirect-url"?: string | null;

//     // Social Links
//     "twitter-link"?: string | null;
//     "facebook-link"?: string | null;
//     "instagram-link"?: string | null;
//     "youtube-link"?: string | null;
//     "website-link"?: string | null; // Can differ from web-uri
//     "snapchat-link"?: string | null;
//     "tiktok-link"?: string | null;

//     // Authentication & Security
//     "login-option": 'mobile-number' | 'email' | 'both'; // Example options
//     "social-login-option"?: string | null; // Comma-separated string? (e.g., "google,apple")
//     "otp-length": number;
//     "is-2fa-enabled": boolean;

//     // Inventory & Sync
//     "is-inventory-sync-enabled": boolean | number;
//     "is-menu-auto-sync": boolean | number; // Sync with POS?

//     // UI & Experience
//     "is-optional-modifier-groups-hidden": boolean;
//     "prompt-rating-seconds"?: number | null; // Seconds after order completion

//     // Kiosk Settings (If applicable)
//     "kiosk-business-type"?: string; // e.g., "food-and-beverage"

//     // Maintenance Mode
//     "is-maintenance-mode": boolean;

//     // Other/Internal
//     "billing-type"?: string; // Display only?
//     "is-free-package"?: boolean | number; // Display only?
//     "allowed-countries"?: AllowedCountry[]; // Display only or managed elsewhere?
//     // recommended-dimensions seems like metadata, not usually user-editable
// }

// // Type for form data, making numeric/boolean fields potentially strings/flexible for input
// // We might break this down further by tab later
// export type ShopSettingsFormData = Partial<{
//     [K in keyof ShopSettings]: ShopSettings[K] extends boolean ? boolean : // Keep boolean for switches
//                                ShopSettings[K] extends number ? string : // Use string for number inputs
//                                // eslint-disable-next-line @typescript-eslint/no-unused-vars
//                                ShopSettings[K] extends (infer U)[] ? ShopSettings[K] : // Keep arrays as is
//                                string | null; // Default to string or null
// }> & {
//     // Add specific fields handled differently, e.g., opening hours might be structured differently in form state
//     opening_hours_structured?: OpeningHourRule[] | null; // Parsed version for editing
//     // Logo/App Logo handled by file state
// };


// // // Initial state for the form (derivable from fetched data, but good fallback)
// // export const initialShopSettingsFormData: ShopSettingsFormData = {
// //     label: '',
// //     country: 'EG', // Example default
// //     "primary-language": 'ar-sa',
// //     languages: ['ar-sa', 'en-us'],
// //     "dialing-code": '20',
// //     "mobile-format": '^(?:\\+20|20|0)1\\d{9}$',
// //     "currency-code": 'EGP',
// //     "currency-symbol": 'EGP',
// //     "currency-format": 'currency_symbol_amount',
// //     "rounding-mode": 'none',
// //     "decimal-places": '0', // Use string for input
// //     "web-uri": '',
// //     "logo-uri": null,
// //     "default-opening-hours": '[]', // Start as empty JSON string
// //     opening_hours_structured: [], // Start with empty array for UI
// //     "default-timezone": 'Africa/Cairo', // Example
// //     "default-delivery-charge": '15',
// //     "default-promised-time-delta-delivery": '45',
// //     "default-promised-time-delta-pickup": '15',
// //     "minimum-order-amount-delivery": '0',
// //     "order-cancellation-time": '5',
// //     "allow-advance-order": false,
// //     "order-price-calculation": 'modifier-based',
// //     "vat-rate": '14',
// //     "vat-type": 'inclusive',
// //     "default-order-status-cash": 'posted',
// //     "default-order-status-card": 'posted',
// //     "supported-order-types": ['deliver', 'pickup'],
// //     "supported-payment-types": ['cash', 'card', 'card-on-delivery'],
// //     "pickup-payment-types": [],
// //     "deliver-payment-types": [],
// //     "feedback-email": '',
// //     "alert-email": '',
// //     "is-maintenance-mode": false,
// //     "remove-branding": false,
// //     "vat-number": "",
// //     "whatsapp-number": "",
// //     "is-cart-notes-enabled": false,
// //     "is-cart-items-notes-enabled": false,
// //     "login-option": 'mobile-number',
// //     "social-login-option": 'solo-guest,google,apple',
// //     "is-inventory-sync-enabled": true,
// //     "is-multi-payment-allowed": true,
// //     "can-cancel-payment": true,
// //     "is-auto-close-orders-daily": true,
// //     "is-menu-auto-sync": false,
// //     "is-optional-modifier-groups-hidden": false,
// //     "prompt-rating-seconds": '3600',
// //     "delivery-charge-per-km": '0',
// //     "delivery-maximum-distance": '99',
// //     "is-notification-center-enabled": true,
// //     "is-2fa-enabled": false,
// //     // ... initialize other fields to defaults or empty strings/null
// // };