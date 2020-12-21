export function isObject(o: unknown) {
  return Object.prototype.toString.call(o) === '[object Object]'
}

export function safePrint(o: unknown): unknown {
  if (typeof o === 'symbol') {
    return o.toString()
  }
  if (Array.isArray(o)) {
    return o.map((i) => safePrint(i))
  }
  return o
}
