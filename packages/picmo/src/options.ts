import { PickerOptions } from './types';

import { NativeRenderer } from './renderers/native';
import { lightTheme } from './themes';
import en from './i18n/lang-en';

const defaultOptions: Partial<PickerOptions> = {
  renderer: new NativeRenderer(),
  theme: lightTheme,

  animate: true,

  showSearch: true,
  showCategoryTabs: true,
  showVariants: true,
  showRecents: true,
  showPreview: true,

  emojisPerRow: 8,
  visibleRows: 6,

  emojiVersion: 'auto',
  maxRecents: 50,
  i18n: en,
  locale: 'en',

  custom: []
};

export function getOptions(options: Partial<PickerOptions> = {}): PickerOptions {
  return { 
    ...defaultOptions,
    rootElement: document.body,
    ...options 
  } as PickerOptions;
}