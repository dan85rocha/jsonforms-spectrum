export const findValue: any = (obj: any, key: string | string[]) => {
  if (!obj || !key) {
    return undefined;
  }
  if (Array.isArray(key)) {
    for (const k of key) {
      const result: any = findValue(obj, k);
      if (result) {
        return result;
      }
    }
    return undefined;
  }
  if (obj[key]) {
    return obj[key];
  }
  for (const prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      if (typeof obj[prop] === 'object') {
        const result: any = findValue(obj[prop], key);
        if (result) {
          return result;
        }
      }
    }
  }
};
