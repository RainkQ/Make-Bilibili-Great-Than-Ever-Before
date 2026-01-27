import type { MakeBilibiliGreatThanEverBeforeModule } from '../types';
import { defineReadonlyProperty } from '../utils/define-readonly-property';

declare global {
  interface Window {
    original?: {
      reprint: string
    }
  }
}

const fixCopyInCV: MakeBilibiliGreatThanEverBeforeModule = {
  id: 'fix-copy-in-cv',
  name: 'fix-copy-in-cv',
  defaultEnabled: true,
  description: '修复专栏无法复制',
  onCV() {
    if ('original' in unsafeWindow) {
      defineReadonlyProperty(unsafeWindow.original, 'reprint', '1');
    }

    const holder = document.querySelector('.article-holder');
    if (holder) {
      holder.classList.remove('unable-reprint');
      holder.addEventListener('copy', e => e.stopImmediatePropagation(), true);
    }
  }
};

export default fixCopyInCV;
