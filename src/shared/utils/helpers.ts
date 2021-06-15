export const titleCase = (s: string): string => {
  const lowered = s.toLowerCase()
  return lowered.charAt(0).toUpperCase() + lowered.substr(1)
}

export const microToMilliSeconds = (micro: number): number => {
  return micro * 0.001
}

export const trimStringsFromObj = (
  obj: Record<string, unknown>
): Record<string, unknown> => {
  let trimmed = {}
  for (const key in obj) {
    let val = obj[key]
    if (typeof val === 'string') {
      val = val.trim()
    }
    trimmed = { ...trimmed, [key]: val }
  }
  return trimmed
}

// CREDITS: https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
export const randomString = (length: number): string =>
  [...Array(length)].map(() => (~~(Math.random() * 36)).toString(36)).join('')

export const parseLink = (html: string): RegExpExecArray | null => {
  return /href="(https?:\/\/[a-zA-Z0-9_./-:=&;?]+)"/.exec(html)
}

// const uri = String.raw`(/[a-zA-Z0-9_./-]+)`
// const hrefRegex = new RegExp(
//   `href="${config.web.http.host}${uri}"`,
//   'g'
// )

// CREDITS: https://ipirozhenko.com/blog/measuring-requests-duration-nodejs-express/
export const getDurationInMilliseconds = (start: [number, number]): number => {
  const NS_PER_SEC = 1e9
  const NS_TO_MS = 1e6
  const diff = process.hrtime(start)

  return (diff[0] * NS_PER_SEC + diff[1]) / NS_TO_MS
}

export const sanitize = (input: any): any => {
  let sanitized: any

  // For string variables
  sanitized =
    typeof input === 'string' && input.trim().length > 0 ? input.trim() : ''

  // for boolean values
  sanitized = typeof input === 'boolean' && input === true ? true : false

  // for array values
  sanitized = typeof input === 'object' && input instanceof Array ? input : []

  // for number values
  sanitized = typeof input === 'number' && input % 1 === 0 ? input : 0

  // for objects
  sanitized =
    typeof input === 'object' && !(input instanceof Array) && input !== null
      ? input
      : {}

  return sanitized
}

export const mongoSanitize = (obj: any): any => {
  const sanitized = sanitize(obj)

  if (Object.keys(sanitized).length === 0) return sanitized

  for (const key in sanitized) {
    if (/^\$/.test(key)) {
      delete sanitized[key]
    } else {
      mongoSanitize(sanitized[key])
    }
  }

  return sanitized
}

export const isMinLength = (str: string, min: number): boolean => {
  return str.length >= min
}

export const isMaxLength = (str: string, max: number): boolean => {
  return str.length <= max
}

export const isAlphaNum = (str: string, extended = false): boolean => {
  let extRegex = ''
  if (extended) extRegex = String.raw`!@#`
  const isAlphaNumRegex = new RegExp(`[\\w\\s,.${extRegex}-]+$`, 'g')
  return isAlphaNumRegex.test(str)
}

export const isEmail = (email: string): boolean => {
  const emailRegex =
    /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01\x09\x0b\x0c\x0e-\x7f])+)\])/
  return emailRegex.test(email)
}
