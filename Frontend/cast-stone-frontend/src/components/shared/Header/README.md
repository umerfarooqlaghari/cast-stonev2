# Cast Stone Navbar Component

A professional, magazine/editorial style navbar component for the Cast Stone website featuring dynamic dropdowns, smooth animations, and responsive design.

## Features

### 🎨 Design & Styling
- **Magazine/Editorial Theme**: Clean, sophisticated design with serif fonts for branding
- **Dark Brown/White Color Scheme**: Professional color palette matching brand identity
- **Smooth Animations**: CSS transitions and hover effects for enhanced user experience
- **Custom Dropdown Indicators**: Elegant SVG icons instead of default arrows
- **Responsive Design**: Adapts to different screen sizes

### 🧭 Navigation Structure

#### 1. Company Dropdown
- Contact Us
- Our Story
- Retail Locator
- Wholesale Signup

#### 2. Products
- Direct link to All Products page

#### 3. Collections Dropdown (Dynamic)
- **Hierarchical Structure**: Automatically displays collections based on backend data
- **Auto-updating**: Changes automatically when collections are modified
- **Nested Dropdowns**: Supports multi-level collection hierarchies
- **Loading States**: Shows loading indicator while fetching data

#### 4. Completed Projects
- Direct link to completed projects showcase

#### 5. Discover Dropdown
- Catalog
- Finishes
- Videos
- Technical Info
- FAQ

### 🔧 Technical Features

#### Dynamic Collections Integration
```typescript
// Fetches collections hierarchy from API
const fetchCollections = async () => {
  const hierarchyData = await collectionGetService.getHierarchy();
  setCollections(hierarchyData);
};
```

#### Dropdown Management
- **Click Outside to Close**: Automatically closes dropdowns when clicking elsewhere
- **Keyboard Accessibility**: Proper ARIA attributes for screen readers
- **State Management**: Tracks active dropdown and loading states

#### Performance Optimizations
- **Lazy Loading**: Collections are fetched only when component mounts
- **Efficient Re-renders**: Uses React hooks for optimal performance
- **CSS Animations**: Hardware-accelerated transitions

## Usage

```tsx
import Header from './components/shared/Header/Header';

// Basic usage
<Header />

// With custom title
<Header title="Custom Brand Name" />
```

## Styling

The component uses CSS modules with custom properties for theming:

```css
:root {
  --cast-stone-blue: #2563eb;
  --cast-stone-light-blue: #3b82f6;
  --cast-stone-white: #ffffff;
  --cast-stone-dark-text: #1f2937;
}
```

## API Dependencies

- **Collections Service**: Requires `collectionGetService.getHierarchy()` for dynamic collections
- **Entity Types**: Uses `CollectionHierarchy` interface from services

## Responsive Breakpoints

- **Desktop**: Full navigation with all features
- **Tablet (1024px)**: Compressed spacing
- **Mobile (768px)**: Reduced font sizes and padding
- **Small Mobile (640px)**: Navigation hidden (mobile menu to be implemented)

## Future Enhancements

- [ ] Mobile hamburger menu
- [ ] Search functionality
- [ ] User account dropdown
- [ ] Shopping cart badge with item count
- [ ] Mega menu for collections with images
- [ ] Breadcrumb integration

## Browser Support

- Modern browsers with CSS Grid and Flexbox support
- CSS custom properties support required
- ES6+ JavaScript features
