
export const withResolvers = function withResolvers() {
    let a, b;
    let c = new Promise(function (resolve, reject) {
      a = resolve;
      b = reject;
    });
    return {resolve: a, reject: b, promise: c};
  };