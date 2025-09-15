import { useEffect, useState } from 'react';

interface BrowserOptimization {
  isSafari: boolean;
  isChrome: boolean;
  isFirefox: boolean;
  isMobile: boolean;
  imageClass: string;
  layoutClass: string;
}

export const useBrowserOptimization = (): BrowserOptimization => {
  const [optimization, setOptimization] = useState<BrowserOptimization>({
    isSafari: false,
    isChrome: false,
    isFirefox: false,
    isMobile: false,
    imageClass: '',
    layoutClass: ''
  });

  useEffect(() => {
    const userAgent = navigator.userAgent;
    const isSafari = /Safari/.test(userAgent) && !/Chrome/.test(userAgent);
    const isChrome = /Chrome/.test(userAgent) && !/Edg/.test(userAgent);
    const isFirefox = /Firefox/.test(userAgent);
    const isMobile = /Mobi|Android/i.test(userAgent);

    let imageClass = 'image-ratio-fix';
    let layoutClass = '';

    if (isSafari) {
      imageClass += ' safari-image-fix';
      layoutClass += ' safari-optimized';
    } else if (isChrome) {
      imageClass += ' chrome-image-fix';
      layoutClass += ' chrome-optimized';
    } else if (isFirefox) {
      imageClass += ' firefox-image-fix';
      layoutClass += ' firefox-optimized';
    }

    if (isMobile) {
      layoutClass += ' mobile-optimized';
    }

    setOptimization({
      isSafari,
      isChrome,
      isFirefox,
      isMobile,
      imageClass,
      layoutClass
    });
  }, []);

  return optimization;
};
