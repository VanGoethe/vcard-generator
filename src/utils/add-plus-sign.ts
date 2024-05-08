export function addPlusSign(number: string) {
  if (number.startsWith('+')) {
    return number
  } else {
    return '+' + number
  }
}
