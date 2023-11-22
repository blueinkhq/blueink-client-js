const PersonHelper = require('../blueink/helper/PersonHelper')

describe('PersonHelper', () => {
  let personHelper

  beforeEach(() => {
    personHelper = new PersonHelper(
      'John Doe',
      {
        number: 1,
        string: 'stringy',
        dict: { number: 2 },
        list: [3]
      },
      ['1234567890'],
      ['johndoe@example.com']
    )
  })

  describe('addPhone', () => {
    it('should add a phone number to the person', () => {
      const newPhones = personHelper.addPhone('0987654321')
      expect(newPhones).toEqual(['1234567890', '0987654321'])
    })
  })

  describe('setPhones', () => {
    it("should set the person's phone numbers", () => {
      const newPhones = personHelper.setPhones([
        '0987654321',
        '5555555555'
      ])
      expect(newPhones).toEqual(['0987654321', '5555555555'])
    })
  })

  describe('getPhones', () => {
    it("should get the person's phone numbers", () => {
      const phones = personHelper.getPhones()
      expect(phones).toEqual(['1234567890'])
    })
  })

  describe('addEmail', () => {
    it('should add an email address to the person', () => {
      const newEmails = personHelper.addEmail('janedoe@example.com')
      expect(newEmails).toEqual(['johndoe@example.com', 'janedoe@example.com'])
    })
  })

  describe('setEmails', () => {
    it("should set the person's email addresses", () => {
      const newEmails = personHelper.setEmails([
        'janedoe@example.com',
        'bob@example.com'
      ])
      expect(newEmails).toEqual(['janedoe@example.com', 'bob@example.com'])
    })
  })

  describe('getEmails', () => {
    it("should get the person's email addresses", () => {
      const emails = personHelper.getEmails()
      expect(emails).toEqual(['johndoe@example.com'])
    })
  })

  describe('setMetadata', () => {
    it("should set the person's metadata", () => {
      const newMetadata = personHelper.setMetadata({
        number: 2,
        string: 'stringy',
        dict: { number: 3 },
        list: [4]
      })
      expect(newMetadata).toEqual({
        number: 2,
        string: 'stringy',
        dict: { number: 3 },
        list: [4]
      })
    })
  })

  describe('setName', () => {
    it("should set the person's name", () => {
      const newName = personHelper.setName('Jane Doe')
      expect(newName).toEqual('Jane Doe')
    })
  })

  describe('asDict', () => {
    it("should return the person's data as a dictionary", () => {
      const dict = personHelper.asDict({ additionalData: 'foo' })
      expect(dict).toEqual({
        name: 'John Doe',
        metadata: {
          number: 1,
          string: 'stringy',
          dict: { number: 2 },
          list: [3]
        },
        channels: [
          { email: 'johndoe@example.com', kind: 'em' },
          { phone: '1234567890', kind: 'mp' }
        ],
        additionalData: 'foo'
      })
    })
  })
})
