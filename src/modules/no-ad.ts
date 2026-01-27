import type { MakeBilibiliGreatThanEverBeforeModule } from '../types';
import { tagged as css } from 'foxts/tagged';

declare global {
  interface Window {
    __INITIAL_STATE__?: {
      elecFullInfo: {
        list?: unknown[]
      },
      adData: Record<string, Array<{ name: string, pic: string, url: string }>>
    }
  }
}

const noAd: MakeBilibiliGreatThanEverBeforeModule = {
  id: 'no-ad',
  name: 'no-ad',
  defaultEnabled: true,
  description: '去除广告',
  any({ addStyle }) {
    // 去广告

    /**
     * 下面是叔叔家的垃圾前端在 computed 里写副作用检测 AdBlock 是否启用：

    u = () => {
      var A;
      if (!h.value)
        return !1;
      const _ = "cm."
        , v = "bilibili.com"
        , f = ((A = h.value) == null ? void 0 : A.querySelectorAll(`a[href*="${_}${v}"]`)) || [];
      for (let y = 0; y < f.length; y++)
        if (window.getComputedStyle(f[y]).display == "none")
          return !0;
      return !1

      我们只要 display 不是 none 就行了
    }
     */
    addStyle(css`
      .adblock-tips,
      .feed-card:has(.bili-video-card>div:empty),
      a[href*="cm.bilibili.com"],
      .desktop-download-tip,
      .ad-report {
        width: 1px !important;
        height: 1px !important;
        opacity: 0 !important;
        pointer-events: none !important;
        position: absolute !important;
        padding: 0 !important;
        margin: -1px !important;
        overflow: hidden !important;
        clip: rect(0, 0, 0, 0) !important;
        white-space: nowrap !important;
        border-width: 0 !important;
      }
    `);

    if (unsafeWindow.__INITIAL_STATE__?.adData) {
      for (const key in unsafeWindow.__INITIAL_STATE__.adData) {
        if (!Array.isArray(unsafeWindow.__INITIAL_STATE__.adData[key])) continue;
        for (const item of unsafeWindow.__INITIAL_STATE__.adData[key]) {
          item.name = 'B 站未来有可能会倒闭，但绝不会变质';
          item.pic = 'https://static.hdslb.com/images/transparent.gif';
          item.url = 'https://space.bilibili.com/208259';
        }
      }
    }
    if (unsafeWindow.__INITIAL_STATE__?.elecFullInfo) {
      unsafeWindow.__INITIAL_STATE__.elecFullInfo.list = [];
    }
  }
};

export default noAd;
