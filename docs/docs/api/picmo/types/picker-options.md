# `PickerOptions`

Customization options for an emoji picker.

A `PickerOptions` object is passed to the `createPicker` and `createPopup` functions.

## Properties

### `animate`

- **Type**: `boolean`
- **Default**: `true`

Whether or not to show animated transitions in the picker.

### `categories`

- **Type**: [`CategoryKey[]`](./category-key) | `undefined`

If specified, only the categories in this array will be shown in the picker. The filtered categories will be shown in the order they in which they appear in the array.

### `custom`

- **Type**: [`CustomEmoji[]`](./custom-emoji) | `undefined`

Specifies the custom emojis/GIFs to show in the picker. They will all be included in a single "Custom" category.

### `emojiData`

- **Type**: [`Emoji[]`](https://emojibase.dev/api/emojibase/interface/Emoji) | `undefined`
- **Default**: `undefined`

The emoji data to use for the picker. If not specified, the data will be downloaded from the CDN when the database is created.

### `emojiSize`

- **Type**: `string`
- **Default**: `'2em'`

The size of emojis in the picker grid. This can be any valid CSS size value.

### `emojisPerRow`

- **Type**: `number`
- **Default**: `8`

The number of columns to show in the emoji grid.

### `emojiVersion`

- **Type**: `number` | `auto`
- **Default**: `auto`

Specifies the version of the emoji data to use. An emoji will only be shown if it is available for the specified version.

A specific number can be specified, or `auto` can be used to automatically determine the supported Emoji version based on a quick rendering test.

### `i18n`

- **Type**: [`Dictionary`](./dictionary)
- **Default**: Built-in English strings

A collection of i18n strings to use for the picker.

### `locale`

- **Type**: [`Locale`](https://emojibase.dev/api/emojibase#Locale)

The locale to use for emoji data. 

### `maxRecents`

- **Type**: `number`
- **Default**: `50`

The maximum number of recent emojis to cache locally.

### `messages`

- **Type**: [`MessagesDataset`](https://emojibase.dev/api/emojibase/interface/MessagesDataset) | `undefined`
- **Default**: `undefind`

The messages data to use for the picker, containing category names. If not specified, the data will be downloaded from the CDN when the database is created.

### `renderer`

- **Type**: [`Renderer`](../classes/renderer) subclass instance

Default: instance of [`NativeRenderer`](../classes/native-renderer)

The `Renderer` subclass instance that will be used to render the emojis.

### `rootElement`

- **Type**: `HTMLElement`
- **Default**: `document.body`

The DOM element that will contain the picker. Any existing children of this element will be removed when `createPicker` is called.

### `showCategoryTabs`

- **Type**: `boolean`
- **Default**: `true`

Whether or not to show the category tabs at the top of the picker.

### `showPreview`

- **Type**: `boolean`
- **Default**: `true`

Whether or not to show the preview area at the bottom of the picker.

### `showRecents`

- **Type**: `boolean`
- **Default**: `true`

Whether or not to show recently used emojis.

### `showSearch`

- **Type**: `boolean`
- **Default**: `true`

Whether or not to show the search box at the top of the picker.

### `showVariants`

- **Type**: `boolean`
- **Default**: `true`

Whether or not to show the variants of an emoji, where supported. If `false`, the default variant will always be emitted

### `theme`

- **Type**: `string`
- **Default**: `lightTheme`

The color theme to use for the picker. Usually this will be one of the class names exported by `picmo/themes`. Built-in themes are:

- `lightTheme`: A light theme with a white background.
- `darkTheme`: A dark theme with a black background.
- `autoTheme`: Automatically sets the light or dark theme based on the operating system/browser settings.

### `visibleRows`

- **Type**: `number`
- **Default**: `6`

The number of visible rows to show in the emoji grid.