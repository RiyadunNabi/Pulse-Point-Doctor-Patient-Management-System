# Design Prompt for Patient Appointments Management System

## Overall Visual Theme

Create a modern, healthcare-focused web application interface with a **lightweight, colorful, and welcoming** design aesthetic. The design should feel professional yet approachable, using soft gradients and pastel tones rather than harsh colors or solid blocks.

## Color Palette & Gradients

### Primary Color Scheme
- **Sky Blue to Cyan**: `from-sky-50 to-cyan-50`, `from-sky-500 to-cyan-500`
- **Blue to Purple**: `from-blue-500 to-purple-600` (for icons and accents)
- **Emerald/Green tones**: `from-green-50 to-emerald-50`, `from-green-500 to-emerald-500`
- **Amber/Orange**: `from-amber-50 to-orange-50` for pending/warning states
- **Purple/Pink**: `from-purple-50 to-pink-50` for secondary sections
- **Red/Rose**: `from-red-50 to-rose-50` for cancelled/error states

### Background Strategy
- **Main background**: `bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50`
- **Card backgrounds**: Semi-transparent with backdrop blur (`bg-white/80 backdrop-blur-sm`)
- **Section backgrounds**: Light gradient pairs like `bg-gradient-to-br from-green-50 to-emerald-50`

## Typography & Text Sizing

### Text Hierarchy
- **Main titles**: `text-xl font-bold` or `text-2xl font-bold`
- **Section headers**: `text-lg font-semibold` 
- **Card titles**: `text-base font-semibold`
- **Body text**: `text-sm` for most content
- **Meta information**: `text-xs` for dates, secondary info
- **Button text**: `text-xs font-medium` for compact buttons, `text-sm font-medium` for primary buttons

### Font Weights
- **Bold**: For titles and important information (`font-bold`, `font-semibold`)
- **Medium**: For buttons and labels (`font-medium`)
- **Normal**: For body text and descriptions

## Layout & Grid Systems

### Grid Layouts
- **Main content**: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`
- **Card grids**: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3` for compact items
- **Two-column layouts**: `grid grid-cols-1 md:grid-cols-2 gap-4` for side-by-side content
- **Responsive**: Always start with `grid-cols-1` and scale up

### Spacing & Padding
- **Card padding**: `p-4` to `p-6` depending on card size
- **Small elements**: `px-2.5 py-1.5` for compact buttons
- **Medium elements**: `px-3 py-2` for standard buttons
- **Large elements**: `px-6 py-3` for primary actions
- **Section spacing**: `space-y-4` to `space-y-6` between major sections

## Component Design Patterns

### Card Structure
```
- Rounded corners: `rounded-xl`
- Borders: `border border-[color]-200`
- Shadow: `shadow-sm` with `hover:shadow-lg` on interaction
- Background: Gradient with `bg-gradient-to-br from-[color]-50 to-[color2]-50`
- Padding: `p-4` to `p-6`
```

### Button Styling
- **Primary buttons**: `bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-700 hover:to-cyan-700 text-white`
- **Secondary buttons**: Colored backgrounds like `bg-green-500 hover:bg-green-600 text-white`
- **Button sizing**: `px-2.5 py-1.5` for compact, `px-6 py-2.5` for primary
- **Border radius**: `rounded-lg`
- **Transitions**: `transition-all duration-200`

### Status Badges
- **Pending**: `bg-amber-100 text-amber-700 border-amber-200`
- **Completed**: `bg-green-100 text-green-700 border-green-200`
- **Cancelled**: `bg-red-100 text-red-700 border-red-200`
- **Size**: `text-xs px-2 py-1 rounded-full`

## Interactive Elements

### Hover Effects
- **Cards**: `hover:shadow-lg hover:border-[color]-300 transform hover:-translate-y-1`
- **Buttons**: `hover:shadow-md` with color darkening
- **Transitions**: `transition-all duration-200` or `duration-300`

### Icons
- **Size**: `w-4 h-4` for inline icons, `w-5 h-5` for section headers
- **Colors**: Match the section color scheme (blue-500, green-600, etc.)
- **Positioning**: Use with flexbox (`flex items-center space-x-2`)

## Layout Principles

### Information Architecture
- **Horizontal layouts**: Use for related information (date + time side by side)
- **Grid layouts**: For similar items (medications, tests, files in 2-3 columns)
- **Compact design**: Avoid full-width cards when grid layouts are more efficient
- **Visual hierarchy**: Use gradients and spacing to separate different types of content

### Responsive Behavior
- **Mobile first**: Start with `grid-cols-1` and single column layouts
- **Tablet**: Add `md:grid-cols-2` for two-column layouts
- **Desktop**: Use `lg:grid-cols-3` for three-column grids when appropriate

## Special Design Elements

### Semi-transparent Overlays
- **Usage**: `bg-white/70 backdrop-blur-sm` for content over gradients
- **Borders**: Light colored borders like `border-green-300`

### Decorative Background Elements
```
<div className="absolute inset-0 overflow-hidden pointer-events-none">
  <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-sky-200/20 to-cyan-200/20 rounded-full blur-3xl"></div>
  <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-blue-200/20 to-sky-200/20 rounded-full blur-3xl"></div>
</div>
```

## Color-Coding Strategy

### By Function
- **Doctor/Medical info**: Blue gradients (`from-blue-50 to-cyan-50`)
- **Diagnosis/Health**: Green gradients (`from-green-50 to-emerald-50`)
- **Medications**: Purple gradients (`from-purple-50 to-pink-50`)
- **Tests/Investigations**: Cyan gradients (`from-cyan-50 to-blue-50`)
- **Instructions**: Amber gradients (`from-amber-50 to-orange-50`)
- **Files/Documents**: Indigo gradients (`from-indigo-50 to-purple-50`)

### Status-Based Coloring
- **Pending/Warning**: Amber/yellow tones
- **Success/Completed**: Green/emerald tones
- **Error/Cancelled**: Red/rose tones
- **Info/Neutral**: Slate/gray tones

This design system creates a cohesive, professional healthcare interface that feels modern and approachable while maintaining excellent readability and user experience through consistent use of soft colors, proper spacing, and logical information hierarchy.