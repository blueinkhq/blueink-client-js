const { BundleSubClient } = require('../blueink/subclients/bundle')
const { TemplateSubClient } = require('../blueink/subclients/template')
const { VerifySubClient } = require('../blueink/subclients/verify')

// Network-free unit tests that assert each subclient hits the correct
// HTTP method + path for the APIv2 2.16 endpoints. The request layer is
// replaced with a spy so no real HTTP calls are made (CI-safe).
const mockRequest = () => {
  const calls = []
  const record = (method) => (path, data) => {
    calls.push({ method, path, data })
    return Promise.resolve({ status: 200, data: {} })
  }
  return {
    calls,
    get: record('get'),
    post: record('post'),
    put: record('put'),
    patch: record('patch'),
    delete: record('delete')
  }
}

describe('2.16 endpoint construction', () => {
  describe('BundleSubClient', () => {
    it('update() PATCHes /bundles/{id}/', () => {
      const req = mockRequest()
      BundleSubClient(req).update('B-abc123', { signing_brand: 'X' })
      expect(req.calls[0].method).toBe('patch')
      expect(req.calls[0].path).toBe('/bundles/B-abc123/')
      expect(req.calls[0].data).toEqual({ signing_brand: 'X' })
    })

    it('send() POSTs /bundles/{id}/send/', () => {
      const req = mockRequest()
      BundleSubClient(req).send('B-abc123')
      expect(req.calls[0].method).toBe('post')
      expect(req.calls[0].path).toBe('/bundles/B-abc123/send/')
    })

    it('validate() PUTs /bundles/{id}/validate/', () => {
      const req = mockRequest()
      BundleSubClient(req).validate('B-abc123')
      expect(req.calls[0].method).toBe('put')
      expect(req.calls[0].path).toBe('/bundles/B-abc123/validate/')
    })
  })

  describe('TemplateSubClient', () => {
    it('update() PATCHes /templates/{id}/', () => {
      const req = mockRequest()
      TemplateSubClient(req).update('T-abc123', { metadata: { a: 1 } })
      expect(req.calls[0].method).toBe('patch')
      expect(req.calls[0].path).toBe('/templates/T-abc123/')
      expect(req.calls[0].data).toEqual({ metadata: { a: 1 } })
    })
  })

  describe('VerifySubClient', () => {
    it('create() POSTs /verify/', () => {
      const req = mockRequest()
      VerifySubClient(req).create({ hash: 'deadbeef' })
      expect(req.calls[0].method).toBe('post')
      expect(req.calls[0].path).toBe('/verify/')
      expect(req.calls[0].data).toEqual({ hash: 'deadbeef' })
    })
  })

  describe('Client registration', () => {
    it('registers the verify subclient', () => {
      const Client = require('../blueink/client')
      const client = new Client('fake-key')
      expect(client.verify).toBeDefined()
      expect(typeof client.verify.create).toBe('function')
      expect(typeof client.bundles.update).toBe('function')
      expect(typeof client.bundles.send).toBe('function')
      expect(typeof client.bundles.validate).toBe('function')
      expect(typeof client.templates.update).toBe('function')
    })
  })

  describe('Event types', () => {
    it('includes 2.16 event types', () => {
      const { EVENT_TYPE } = require('../blueink/constants')
      const values = Object.values(EVENT_TYPE)
      expect(values).toContain('packet_declined')
      expect(values).toContain('bundle_signer_reassigned')
    })
  })
})
