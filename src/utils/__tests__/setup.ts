import { vi } from 'vitest'

type MockOpenRequest = Partial<IDBOpenDBRequest> & { readyState: IDBRequestReadyState }

const createMockRequest = (): IDBOpenDBRequest => {
  const request: MockOpenRequest = {
    result: null as unknown as IDBDatabase,
    error: null,
    onsuccess: null,
    onerror: null,
    onblocked: null,
    onupgradeneeded: null,
    readyState: 'done',
  }

  return request as IDBOpenDBRequest
}

const indexedDBMock: IDBFactory = {
  open: vi.fn((name: string, version?: number) => {
    void name
    void version
    return createMockRequest()
  }),
  deleteDatabase: vi.fn((name: string) => {
    void name
    return createMockRequest()
  }),
  cmp: vi.fn((first: unknown, second: unknown) => {
    if (first === second) return 0
    return (first as number) > (second as number) ? 1 : -1
  }),
} as unknown as IDBFactory

globalThis.indexedDB = indexedDBMock

// Mock fetch with a simple successful response
globalThis.fetch = vi.fn<typeof fetch>().mockImplementation(async (input, init) => {
  void input
  void init
  const body = new Blob(['mock-data'], { type: 'application/octet-stream' })
  return new Response(body, {
    status: 200,
    statusText: 'OK',
  })
})

// Ensure URL.createObjectURL / revokeObjectURL exist
const urlConstructor = globalThis.URL as typeof URL & {
  createObjectURL?: (obj: unknown) => string
  revokeObjectURL?: (url: string) => void
}

if (!urlConstructor.createObjectURL) {
  Object.defineProperty(urlConstructor, 'createObjectURL', {
    value: vi.fn(() => 'blob:mock-url'),
    writable: true,
  })
} else {
  vi.spyOn(urlConstructor, 'createObjectURL').mockReturnValue('blob:mock-url')
}

if (!urlConstructor.revokeObjectURL) {
  Object.defineProperty(urlConstructor, 'revokeObjectURL', {
    value: vi.fn(),
    writable: true,
  })
} else {
  vi.spyOn(urlConstructor, 'revokeObjectURL').mockImplementation(() => {})
}