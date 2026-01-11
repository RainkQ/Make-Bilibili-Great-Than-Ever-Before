import { logger } from '../logger';
import type { MakeBilibiliGreatThanEverBeforeModule } from '../types';

const disableAV1: MakeBilibiliGreatThanEverBeforeModule = {
  id: 'disable-av1',
  name: 'disable-av1',
  defaultEnabled: true,
  description: '防止叔叔强行喂 AV1 屎',
  any: ({ onlyCallOnce }) => {
    ((origCanPlayType) => {
      // eslint-disable-next-line sukka/class-prototype -- override native method
      HTMLMediaElement.prototype.canPlayType = function (type) {
        logger.log('HTMLVideoElement.prototype.canPlayType called with', { type });

        if (type.includes('av01')) {
          logger.info('AV1 disabled!', { meta: 'HTMLVideoElement.prototype.canPlayType' });
          return '';
        };
        return origCanPlayType.call(this, type);
      };
      // eslint-disable-next-line @typescript-eslint/unbound-method -- override native method
    })(HTMLMediaElement.prototype.canPlayType);
    ((origIsTypeSupported) => {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- can be nullable
      if (origIsTypeSupported == null) return false;

      unsafeWindow.MediaSource.isTypeSupported = function (type) {
        logger.log('MediaSource.isTypeSupported called with', { type });

        if (type.includes('av01')) {
          logger.info('AV1 disabled!', { meta: 'MediaSource.isTypeSupported' });
          return false;
        }
        return origIsTypeSupported.call(this, type);
      };
      // eslint-disable-next-line @typescript-eslint/unbound-method -- override native method
    })(unsafeWindow.MediaSource.isTypeSupported);
  }
};

export default disableAV1;
