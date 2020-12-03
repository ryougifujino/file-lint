import _glob from 'glob'

export default function glob(basePath: string, pattern: string): Promise<string[]> {
  return new Promise((resolve, reject) => {
    _glob(pattern, { dot: true, mark: true, cwd: basePath }, (err, files) => {
      if (err) {
        reject(err)
      } else {
        resolve(files)
      }
    })
  })
}
