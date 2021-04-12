export const IsDefine = value => {
  if (
    value == null ||
    value === '' ||
    value === 'undefined' ||
    value === undefined ||
    value === 'null' ||
    value === '(null)' ||
    value === 'NULL' ||
    typeof value === 'undefined'
  ) {
    return false
  } else {
    value = value + ''
    value = value.replace(/\s/g, '')
    if (value === '') {
      return false
    }
    return true
  }
}
