// 去除鸿蒙字体，强制使用系统默认字体
import type { MakeBilibiliGreatThanEverBeforeModule } from '../types';
import { tagged as css } from 'foxts/tagged';

const useSystemFonts: MakeBilibiliGreatThanEverBeforeModule = {
  id: 'use-system-fonts',
  name: 'use-system-fonts',
  defaultEnabled: true,
  description: '使用系统字体',
  any: ({ addStyle }) => {
    document.querySelectorAll('link[href*="/jinkela/long/font/"]').forEach(x => x.remove());
    addStyle(css`html, body { font-family: system-ui !important; }`);
  }
};

export default useSystemFonts;
