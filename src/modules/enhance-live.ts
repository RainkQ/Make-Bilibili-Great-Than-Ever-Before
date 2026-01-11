import type { MakeBilibiliGreatThanEverBeforeModule } from '../types';
import { tagged as css } from 'foxts/tagged';

const enhanceLive: MakeBilibiliGreatThanEverBeforeModule = {
  id: 'enhance-live',
  name: 'enhance-live',
  defaultEnabled: true,
  description: '直播间画质优化',
  onLive: ({ addStyle }) => {
    // from https://greasyfork.org/zh-CN/scripts/467427-bilibili-%E8%87%AA%E5%8A%A8%E5%88%87%E6%8D%A2%E7%9B%B4%E6%92%AD%E7%94%BB%E8%B4%A8%E8%87%B3%E6%9C%80%E9%AB%98%E7%94%BB%E8%B4%A8
    (async () => {
      'use strict';

      // jump to actual room if live streaming is nested
      setInterval(() => {
        const nestedPage = document.querySelector('iframe[src*=blanc]');
        if (nestedPage) {
          (unsafeWindow as Window).location.assign((nestedPage as HTMLIFrameElement).src);
        }
      }, 1000);

      // hide the loading gif
      addStyle(css`.web-player-loading { opacity: 0; }`);

      // make sure the player is ready
      await new Promise<void>((resolve) => {
        const timer = setInterval(() => {
          if (
            (unsafeWindow as any).livePlayer?.getPlayerInfo?.()?.playurl
            && (unsafeWindow as any).livePlayer?.switchQuality
          ) {
            clearInterval(timer);
            resolve();
          }
        }, 1000);
      });

      let manualOverride = false;
      let isScriptSwitch = false;
      let lastUserInteraction = 0;

      // wrap switchQuality and keep it wrapped even if player resets
      const WRAPPED = Symbol('mbgteb-live-switch-wrapped');
      const wrapLivePlayerSwitch = () => {
        const livePlayer = (unsafeWindow as any).livePlayer;
        if (!livePlayer || !livePlayer.switchQuality) return null as any;
        if (livePlayer[WRAPPED]) return livePlayer;
        const originalSwitchQuality = livePlayer.switchQuality.bind(livePlayer);
        livePlayer.switchQuality = (qn: number) => {
          if (!isScriptSwitch) {
            manualOverride = true;
          }
          return originalSwitchQuality(qn);
        };
        // mark as wrapped and keep a back-reference for later calls
        Object.defineProperty(livePlayer, WRAPPED, { value: true });
        Object.defineProperty(livePlayer, '__mbgteb_originalSwitchQuality', { value: originalSwitchQuality });
        return livePlayer;
      };

      // ensure wrapping at start
      wrapLivePlayerSwitch();

      // record user interactions in/around the player to infer manual operations
      const markInteraction = () => { lastUserInteraction = Date.now(); };
      const interactionEvents = ['pointerdown', 'mousedown', 'touchstart', 'keydown'];
      interactionEvents.forEach((evt) => {
        window.addEventListener(evt as any, (e) => {
          try {
            const target = e.target as Element | null;
            if (!target) return;
            // limit to events happening within the web player container to avoid false positives
            const inPlayer = !!target.closest?.('.web-player,.player,.player-ctnr,.bilibili-live-player,.player-container');
            if (inPlayer) markInteraction();
          } catch {
            // ignore
          }
        }, { capture: true, passive: true });
      });

      // periodically ensure highest quality only when not manually overridden
      setInterval(() => {
        const livePlayer = wrapLivePlayerSwitch() || (unsafeWindow as any).livePlayer;
        const info = livePlayer?.getPlayerInfo?.();
        if (!info || !info.playurl) return;

        const highestQualityNumber: number | undefined = info.qualityCandidates?.[0]?.qn;
        const currentQualityNumber: number | undefined = info.quality;

        // if a recent user interaction occurred, treat as manual and stop auto override
        if (!manualOverride && Date.now() - lastUserInteraction < 3000) {
          manualOverride = true;
          return;
        }

        if (!manualOverride && highestQualityNumber && currentQualityNumber !== highestQualityNumber) {
          // use preserved original if available
          const call = (livePlayer as any).__mbgteb_originalSwitchQuality ?? livePlayer.switchQuality.bind(livePlayer);
          isScriptSwitch = true;
          try {
            call(highestQualityNumber);
          } finally {
            isScriptSwitch = false;
          }
        }
      }, 1000);
    })();
  }
};

export default enhanceLive;
