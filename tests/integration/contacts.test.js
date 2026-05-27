const request = require('supertest');
const app = require('../../src/app');
const ContactsStore = require('../../src/models/contactsStore');

describe('Contacts API Integration Tests', () => {
  
  beforeEach(() => {
    // Clear in-memory contacts list if clear method is available
    if (typeof ContactsStore.clear === 'function') {
      try {
        ContactsStore.clear();
      } catch (e) {
        // Safe fail for RED stub phase
      }
    }
  });

  // Test Case 1: GET /api/contacts
  test('GET /api/contacts should return all contacts list', async () => {
    const response = await request(app)
      .get('/api/contacts')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
  });

  // Test Case 2: POST /api/contacts with valid data
  test('POST /api/contacts should create a new contact and return 201', async () => {
    const validContact = {
      name: 'Maria Clara',
      email: 'maria.clara@example.com',
      phone: '09189876543'
    };

    const response = await request(app)
      .post('/api/contacts')
      .send(validContact)
      .expect('Content-Type', /json/)
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe(validContact.name);
    expect(response.body.email).toBe(validContact.email);
    expect(response.body.phone).toBe(validContact.phone);
  });

  // Test Case 3: POST /api/contacts with invalid data
  test('POST /api/contacts should return 400 Bad Request when validation fails', async () => {
    const invalidContact = {
      name: 'M', // Too short
      email: 'invalid-email',
      phone: '123'
    };

    const response = await request(app)
      .post('/api/contacts')
      .send(invalidContact)
      .expect('Content-Type', /json/)
      .expect(400);

    expect(response.body).toHaveProperty('errors');
    expect(response.body.errors.name).toBeDefined();
    expect(response.body.errors.email).toBeDefined();
    expect(response.body.errors.phone).toBeDefined();
  });
});
