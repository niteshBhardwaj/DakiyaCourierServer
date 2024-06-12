
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