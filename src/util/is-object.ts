export const isObject = function (obj) {
  return Object.prototype.toString.call(obj) === "[object Object]";
};
