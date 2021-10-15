import chalk from 'chalk'

export function toPrintable(o: unknown): unknown {
  if (typeof o === 'symbol') {
    return o.toString()
  }
  if (Array.isArray(o)) {
    return o.map((i) => toPrintable(i))
  }
  return o
}

export function highlight(o: unknown) {
  return chalk.bgYellowBright(` ${toPrintable(o)} `)
}

export function printError(message: string) {
  console.log(chalk.red.underline(message))
}
