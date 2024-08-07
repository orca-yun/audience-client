export function isMobileDevice() {
  return /iphone|ipad|ipod|android|blackberry|windows phone/gi.test(
    navigator.userAgent
  );
}

export const isIOS = () => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
};

export const isWechat = () => {
  return /MicroMessenger/i.test(navigator.userAgent);
};

export const safeJsonParse = <T>(str: string) => {
  try {
    const jsonValue: T = JSON.parse(str);

    return jsonValue;
  } catch {
    return str;
  }
};
