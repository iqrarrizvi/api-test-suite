import { test, expect } from '@playwright/test';
import { ApiClient, assertSchema } from '../utils/apiClient.js';
import { newUser, updatedUser } from '../fixtures/testData.js';

const USER_SCHEMA = { id: 'number', email: 'string', firstName: 'string', lastName: 'string' };

test.describe('Users API', () => {

  // ── List & pagination ──────────────────────────────────────────────────────

  test('GET /users returns paginated list with correct shape @smoke', async ({ request }) => {
    const client = new ApiClient(request);
    const res = await client.get('/users?limit=10&skip=0');

    expect(res.status()).toBe(200);
    const body = await res.json();

    expect(body).toHaveProperty('total');
    expect(body).toHaveProperty('skip', 0);
    expect(body).toHaveProperty('limit', 10);
    expect(Array.isArray(body.users)).toBe(true);
    expect(body.users.length).toBeGreaterThan(0);
  });

  test('GET /users skip returns different page of results @regression', async ({ request }) => {
    const client = new ApiClient(request);
    const [res1, res2] = await Promise.all([
      client.get('/users?limit=5&skip=0'),
      client.get('/users?limit=5&skip=5'),
    ]);

    const [p1, p2] = await Promise.all([res1.json(), res2.json()]);

    expect(p1.users[0].id).not.toBe(p2.users[0].id);
  });

  // ── Single user ────────────────────────────────────────────────────────────

  test('GET /users/:id returns correct user schema @smoke', async ({ request }) => {
    const client = new ApiClient(request);
    const res = await client.get('/users/1');

    expect(res.status()).toBe(200);
    const body = await res.json();
    assertSchema(body, USER_SCHEMA);
    expect(body.id).toBe(1);
  });

  test('GET /users/:id returns 404 for non-existent user @regression', async ({ request }) => {
    const client = new ApiClient(request);
    const res = await client.get('/users/9999');

    expect(res.status()).toBe(404);
    const body = await res.json();
    expect(body).toHaveProperty('message');
  });

  // ── Create ─────────────────────────────────────────────────────────────────

  test('POST /users/add creates a user and returns 201 @smoke', async ({ request }) => {
    const client = new ApiClient(request);
    const res = await client.post('/users/add', newUser);

    expect(res.status()).toBe(201);
    const body = await res.json();

    expect(body.firstName).toBe(newUser.firstName);
    expect(body.lastName).toBe(newUser.lastName);
    expect(typeof body.id).toBe('number');
  });

  // ── Update ─────────────────────────────────────────────────────────────────

  test('PUT /users/:id replaces user fields @regression', async ({ request }) => {
    const client = new ApiClient(request);
    const res = await client.put('/users/1', updatedUser);

    expect(res.status()).toBe(200);
    const body = await res.json();

    expect(body.firstName).toBe(updatedUser.firstName);
    expect(body.age).toBe(updatedUser.age);
  });

  test('PATCH /users/:id partially updates a field @regression', async ({ request }) => {
    const client = new ApiClient(request);
    const res = await client.patch('/users/1', { age: 99 });

    expect(res.status()).toBe(200);
    const body = await res.json();

    expect(body.age).toBe(99);
  });

  // ── Delete ─────────────────────────────────────────────────────────────────

  test('DELETE /users/:id returns isDeleted flag @regression', async ({ request }) => {
    const client = new ApiClient(request);
    const res = await client.delete('/users/1');

    expect(res.status()).toBe(200);
    const body = await res.json();

    expect(body.isDeleted).toBe(true);
    expect(typeof body.deletedOn).toBe('string');
  });

});
