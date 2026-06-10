import { test, expect } from '@playwright/test';
import { ApiClient, assertSchema } from '../utils/apiClient.js';
import { newUser, updatedUser } from '../fixtures/testData.js';

const USER_SCHEMA = { id: 'number', email: 'string', first_name: 'string', last_name: 'string' };

test.describe('Users API', () => {

  // ── List & pagination ──────────────────────────────────────────────────────

  test('GET /api/users returns paginated list with correct shape @smoke', async ({ request }) => {
    const client = new ApiClient(request);
    const res = await client.get('/api/users?page=1');

    expect(res.status()).toBe(200);
    const body = await res.json();

    expect(body).toHaveProperty('page', 1);
    expect(body).toHaveProperty('per_page');
    expect(body).toHaveProperty('total');
    expect(Array.isArray(body.data)).toBe(true);
    expect(body.data.length).toBeGreaterThan(0);
  });

  test('GET /api/users page 2 returns different results than page 1 @regression', async ({ request }) => {
    const client = new ApiClient(request);
    const [res1, res2] = await Promise.all([
      client.get('/api/users?page=1'),
      client.get('/api/users?page=2'),
    ]);

    const [p1, p2] = await Promise.all([res1.json(), res2.json()]);

    expect(p1.page).toBe(1);
    expect(p2.page).toBe(2);
    expect(p1.data[0].id).not.toBe(p2.data[0].id);
  });

  // ── Single user ────────────────────────────────────────────────────────────

  test('GET /api/users/:id returns correct user schema @smoke', async ({ request }) => {
    const client = new ApiClient(request);
    const res = await client.get('/api/users/2');

    expect(res.status()).toBe(200);
    const { data } = await res.json();
    assertSchema(data, USER_SCHEMA);
    expect(data.id).toBe(2);
  });

  test('GET /api/users/:id returns 404 for non-existent user @regression', async ({ request }) => {
    const client = new ApiClient(request);
    const res = await client.get('/api/users/9999');

    expect(res.status()).toBe(404);
    const body = await res.json();
    expect(body).toEqual({});
  });

  // ── Create ─────────────────────────────────────────────────────────────────

  test('POST /api/users creates a user and returns 201 @smoke', async ({ request }) => {
    const client = new ApiClient(request);
    const res = await client.post('/api/users', newUser);

    expect(res.status()).toBe(201);
    const body = await res.json();

    expect(body.name).toBe(newUser.name);
    expect(body.job).toBe(newUser.job);
    assertSchema(body, { id: 'string', createdAt: 'string' });
  });

  // ── Update ─────────────────────────────────────────────────────────────────

  test('PUT /api/users/:id updates user and returns updatedAt @regression', async ({ request }) => {
    const client = new ApiClient(request);
    const res = await client.put('/api/users/2', updatedUser);

    expect(res.status()).toBe(200);
    const body = await res.json();

    expect(body.name).toBe(updatedUser.name);
    expect(body.job).toBe(updatedUser.job);
    expect(typeof body.updatedAt).toBe('string');
  });

  test('PATCH /api/users/:id partially updates user @regression', async ({ request }) => {
    const client = new ApiClient(request);
    const res = await client.patch('/api/users/2', { job: 'Lead QA Engineer' });

    expect(res.status()).toBe(200);
    const body = await res.json();

    expect(body.job).toBe('Lead QA Engineer');
    expect(typeof body.updatedAt).toBe('string');
  });

  // ── Delete ─────────────────────────────────────────────────────────────────

  test('DELETE /api/users/:id returns 204 with empty body @regression', async ({ request }) => {
    const client = new ApiClient(request);
    const res = await client.delete('/api/users/2');

    expect(res.status()).toBe(204);
    const text = await res.text();
    expect(text).toBe('');
  });

});
