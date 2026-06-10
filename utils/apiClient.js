/**
 * Thin wrapper around Playwright's APIRequestContext.
 * Provides helpers for common assertions so test code stays readable.
 */
export class ApiClient {
  #request;

  constructor(request) {
    this.#request = request;
  }

  async get(path, options = {}) {
    return this.#request.get(path, options);
  }

  async post(path, body, options = {}) {
    return this.#request.post(path, { data: body, ...options });
  }

  async put(path, body, options = {}) {
    return this.#request.put(path, { data: body, ...options });
  }

  async patch(path, body, options = {}) {
    return this.#request.patch(path, { data: body, ...options });
  }

  async delete(path, options = {}) {
    return this.#request.delete(path, options);
  }
}

/**
 * Asserts that every key in `schema` exists on `obj` with the expected type.
 * Throws a descriptive error on mismatch so failures are easy to read.
 *
 * Usage: assertSchema(body, { id: 'number', email: 'string' })
 */
export function assertSchema(obj, schema) {
  for (const [key, expectedType] of Object.entries(schema)) {
    const actual = typeof obj[key];
    if (actual !== expectedType) {
      throw new Error(
        `Schema mismatch on field "${key}": expected ${expectedType}, got ${actual} (value: ${JSON.stringify(obj[key])})`
      );
    }
  }
}
