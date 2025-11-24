# Translations Implementation

## Overview
The application now supports bilingual content (English and Greek) based on the HTML `lang` attribute.

## How It Works

### Language Detection
The translation system automatically detects the language from the HTML document:
```javascript
const htmlLang = document.documentElement.lang || 'en';
return htmlLang.toLowerCase().startsWith('el') ? 'el' : 'en';
```

### Usage in Components
```javascript
import { useTranslation } from './translations/translations.js';

function MyComponent() {
  const t = useTranslation();
  
  return <p>{t('searchPlaceholder')}</p>;
}
```

## Testing Language Switching

### English Version
Set the HTML lang attribute to English in `index.html`:
```html
<html lang="en">
```

### Greek Version
Set the HTML lang attribute to Greek in `index.html`:
```html
<html lang="el">
```

After changing the `lang` attribute, refresh the page to see the translations.

## Translated Sections

### App.jsx
- ✅ Search placeholder
- ✅ Search results header
- ✅ "Didn't find what you need?" message
- ✅ "Select from list" message
- ✅ Tab labels (My Machine, OL, VL, PL)
- ✅ Login prompt
- ✅ "Your Machines" heading
- ✅ Serial Number label
- ✅ Purchase Date label
- ✅ Machine not found message
- ✅ No machines message

### MachineDetail.jsx
- ✅ Breadcrumbs (Home, Machine Assistance)
- ✅ Tab names (Overview, Guides, Troubleshooting)
- ✅ "Select a functionality" message
- ✅ "Back to all guides" button
- ✅ "Step X" labels
- ✅ "Select the issue" message
- ✅ Data not available messages (Overview, Guides, Troubleshooting)

## Translation Keys Reference

All translation keys are defined in `/src/translations/translations.js`:

**Search & Navigation:**
- `searchPlaceholder`
- `searchResultFor`
- `didntFindWhat`
- `selectFromList`

**Tabs:**
- `myMachine`
- `olMachines`
- `vlMachines`
- `plMachines`

**Messages:**
- `pleaseLogin`
- `loginToAccount`
- `yourMachines`
- `serialNumber`
- `purchaseDate`
- `machineNotFound`
- `noMachines`

**Detail Page:**
- `home`
- `machineAssistance`
- `overview`
- `guides`
- `troubleshooting`
- `selectFunctionality`
- `backToGuides`
- `step`
- `selectIssue`
- `overviewNotAvailable`
- `guidesNotAvailable`
- `troubleshootingNotAvailable`

## Adding New Translations

To add a new translated string:

1. Add the key and translations to both `en` and `el` objects in `translations.js`:
```javascript
export const translations = {
  en: {
    // ... existing translations
    newKey: "New English text"
  },
  el: {
    // ... existing translations
    newKey: "Νέο ελληνικό κείμενο"
  }
};
```

2. Use the key in your component:
```javascript
const t = useTranslation();
return <p>{t('newKey')}</p>;
```

## Fallback Behavior

If a translation key is not found:
1. It tries the English translation
2. If that fails, it returns the key itself
3. This prevents the app from breaking due to missing translations
