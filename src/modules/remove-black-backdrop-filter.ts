import type { MakeBilibiliGreatThanEverBeforeModule } from '../types';
import { tagged as css } from 'foxts/tagged';

const removeBlackBackdropFilter: MakeBilibiliGreatThanEverBeforeModule = {
  id: 'remove-black-backdrop-filter',
  name: 'remove-black-backdrop-filter',
  defaultEnabled: true,
  description: '移除黑色背景滤镜',
  onVideo({ addStyle }) {
    addStyle(css`html, body { -webkit-filter: none !important; filter: none !important; }`);
  }
};

export default removeBlackBackdropFilter;
