import { test, expect } from '@playwright/test';
import { ApiClient } from '../utils/apiClient.js';
import { validLogin, invalidLogin } from '../fixtures/testData.js';

test.describe('Auth API', () => {

  // ── Login ──────────────────────────────────────────────────────────────────

  test('POST /auth/login with valid credentials returns access token @smoke', async ({ request }) => {
    const client = new ApiClient(request);
    const res = await client.post('/auth/login', validLogin);

    expect(res.status()).toBe(200);
    const body = await res.json();

    expect(typeof body.accessToken).toBe('string');
    expect(body.accessToken.length).toBeGreaterThan(0);
    expect(typeof body.refreshToken).toBe('string');
  });

  test('POST /auth/login with wrong password returns 400 @regression', async ({ request }) => {
    const client = new ApiClient(request);
    const res = await client.post('/auth/login', invalidLogin);

    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body).toHaveProperty('message');
  });

  test('POST /auth/login with missing password returns 400 @regression', async ({ request }) => {
    const client = new ApiClient(request);
    const res = await client.post('/auth/login', { username: 'emilys' });

    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body).toHaveProperty('message');
  });

  // ── Token lifecycle ────────────────────────────────────────────────────────

  test('GET /auth/me with valid token returns authenticated user @smoke', async ({ request }) => {
    const client = new ApiClient(request);

    // Step 1: login to get token
    const loginRes = await client.post('/auth/login', validLogin);
    const { accessToken } = await loginRes.json();

    // Step 2: use token to fetch current user
    const meRes = await request.get('/auth/me', {
      headers: { 'Authorization': `Bearer ${accessToken}` },
    });

    expect(meRes.status()).toBe(200);
    const me = await meRes.json();
    expect(me.username).toBe(validLogin.username);
  });

  test('GET /auth/me without token returns 401 @regression', async ({ request }) => {
    const res = await request.get('/auth/me');
    expect(res.status()).toBe(401);
  });

});
