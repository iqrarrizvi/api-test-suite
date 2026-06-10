import { test, expect } from '@playwright/test';
import { ApiClient } from '../utils/apiClient.js';
import { validLogin, validRegister, invalidLogin } from '../fixtures/testData.js';

test.describe('Auth API', () => {

  // ── Login ──────────────────────────────────────────────────────────────────

  test('POST /api/login with valid credentials returns token @smoke', async ({ request }) => {
    const client = new ApiClient(request);
    const res = await client.post('/api/login', validLogin);

    expect(res.status()).toBe(200);
    const body = await res.json();

    expect(typeof body.token).toBe('string');
    expect(body.token.length).toBeGreaterThan(0);
  });

  test('POST /api/login with missing password returns 400 and error @regression', async ({ request }) => {
    const client = new ApiClient(request);
    const res = await client.post('/api/login', invalidLogin);

    expect(res.status()).toBe(400);
    const body = await res.json();

    expect(body).toHaveProperty('error');
    expect(body.error).toBe('Missing password');
  });

  test('POST /api/login with wrong password returns 400 @regression', async ({ request }) => {
    const client = new ApiClient(request);
    const res = await client.post('/api/login', { email: validLogin.email, password: 'wrongpassword' });

    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body).toHaveProperty('error');
  });

  // ── Register ───────────────────────────────────────────────────────────────

  test('POST /api/register with valid credentials returns id and token @smoke', async ({ request }) => {
    const client = new ApiClient(request);
    const res = await client.post('/api/register', validRegister);

    expect(res.status()).toBe(200);
    const body = await res.json();

    expect(typeof body.id).toBe('number');
    expect(typeof body.token).toBe('string');
  });

  test('POST /api/register with missing password returns 400 @regression', async ({ request }) => {
    const client = new ApiClient(request);
    const res = await client.post('/api/register', { email: 'newuser@example.com' });

    expect(res.status()).toBe(400);
    const body = await res.json();

    expect(body).toHaveProperty('error');
    expect(body.error).toBe('Missing password');
  });

});
