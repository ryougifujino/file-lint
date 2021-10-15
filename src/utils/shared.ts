export function isObject(o: unknown) {
  return Object.prototype.toString.call(o) === '[object Object]'
}
