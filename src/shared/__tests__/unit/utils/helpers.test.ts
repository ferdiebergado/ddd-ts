import { isAlphaNum, isEmail } from '../../../utils/helpers'

describe('Helpers', () => {
  describe('isEmail', () => {
    it('should return true when email is valid', () => {
      const email = 'abc@example.com'
      expect(isEmail(email)).toEqual(true)
    })
    it('should return false when email is invalid', () => {
      const email = 'abc@example'
      expect(isEmail(email)).toEqual(false)
    })
  })

  describe('isAlphaNum', () => {
    describe('default', () => {
      it('should return true if string is alphanumeric', () => {
        const str = 'john n. smith-gyver'
        expect(isAlphaNum(str)).toEqual(true)
      })

      it('should return false if string is not alphanumeric', () => {
        const str = '<a href="javascript:void">!john smith#gyver?</a>'
        expect(isAlphaNum(str)).toEqual(false)
      })
    })
    describe('extended', () => {
      it('should return true if string is alphanumeric', () => {
        const str = '#johnsmith@gyver23!'
        expect(isAlphaNum(str, true)).toEqual(true)
      })

      it('should return false if string is not alphanumeric', () => {
        const str = '!#^&<a href="javascript:void">!john smith#gyver?</a>$'
        expect(isAlphaNum(str)).toEqual(false)
      })
    })
  })
})
