const iphone = {
  viewport: {
    width: 390,
    height: 844,
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
  },
};

export const screenshotViewports = [
  { name: "desktop-primary", viewport: { width: 1280, height: 1024, deviceScaleFactor: 1 } },
  { name: "desktop-1080p", viewport: { width: 1920, height: 1080, deviceScaleFactor: 1 } },
  { name: "desktop-1440p", viewport: { width: 2560, height: 1440, deviceScaleFactor: 1 } },
  { name: "desktop-2160p", viewport: { width: 3840, height: 2160, deviceScaleFactor: 1 } },
  { name: "iphone-12-portrait", viewport: iphone.viewport },
  {
    name: "iphone-12-landscape",
    viewport: { ...iphone.viewport, width: 844, height: 390, isLandscape: true },
  },
];
