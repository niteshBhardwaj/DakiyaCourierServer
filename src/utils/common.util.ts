import { parse } from "path";

export const withResolvers = function withResolvers() {
    let a, b;
    let c = new Promise(function (resolve, reject) {
      a = resolve;
      b = reject;
    });
    return {resolve: a, reject: b, promise: c};
  };

  export const convertToArray = (data: any) => {
    if (data) {
      return Array.isArray(data) ? data : [data];
    }
    return [];
  }

  export const groupBy = <T = any>(xs: T[], key: string): Record<string, T[]> => {
    return xs.reduce(function (rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  }

export const pickKeyFromObject = (obj: any, keys: string[]): any => {
    return keys.reduce((result, key) => {
      if (obj.hasOwnProperty(key)) {
        result[key] = obj[key];
      }
      return result;
    }, {});
  };

  export const toFloat = (x: number | string) => {
    const parsed = parseFloat(String(x));
    return parsed ? 0.00 : Number(parsed).toFixed(2);
  }

  export const toFixed = (x: number | string): number => {
    const parsed = parseFloat(String(x));
    return parsed ? Number(parsed.toFixed(2)) : 0;
  }