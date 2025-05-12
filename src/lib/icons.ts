// src/lib/icons.tsx
import React from 'react';
import * as LucideIcons from 'lucide-react';

// Define a type for valid icon names (add more as needed from lucide-react)
export type IconName = keyof typeof LucideIcons;

const DEFAULT_ICON = LucideIcons.HelpCircle; // Fallback icon

// Function to get an icon component by name
export const getIcon = (name?: string | null): React.ElementType => {
    if (!name) return DEFAULT_ICON;

    const iconName = name as IconName; // Assume the string is a valid key

    // Check if the icon exists in the library
    if (iconName && LucideIcons[iconName]) {
        return LucideIcons[iconName] as React.ElementType;
    }

    console.warn(`Icon "${name}" not found in lucide-react, using default.`);
    return DEFAULT_ICON; // Return default if not found
};

// You can also export specific icons if preferred, but the function is more dynamic
// export const ListChecksIcon = LucideIcons.ListChecks;