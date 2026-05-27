const { validateContact } = require('../../src/utils/validator');

describe('validateContact Unit Tests', () => {
  // Test Case 1: Valid Contact Data
  test('should validate a correct contact successfully', () => {
    const validContact = {
      name: 'Juan Dela Cruz',
      email: 'juan.delacruz@example.com',
      phone: '09171234567'
    };
    const result = validateContact(validContact);
    expect(result.isValid).toBe(true);
    expect(result.errors).toEqual({});
  });

  // Test Case 2: Invalid Name Validation
  test('should fail when name is empty, too short, too long, or has special characters', () => {
    // Empty Name
    const contactEmptyName = { name: '', email: 'test@example.com', phone: '09171234567' };
    let result = validateContact(contactEmptyName);
    expect(result.isValid).toBe(false);
    expect(result.errors.name).toBeDefined();

    // Too Short Name (< 2 chars)
    const contactShortName = { name: 'A', email: 'test@example.com', phone: '09171234567' };
    result = validateContact(contactShortName);
    expect(result.isValid).toBe(false);
    expect(result.errors.name).toBeDefined();

    // Too Long Name (> 50 chars)
    const contactLongName = { name: 'A'.repeat(51), email: 'test@example.com', phone: '09171234567' };
    result = validateContact(contactLongName);
    expect(result.isValid).toBe(false);
    expect(result.errors.name).toBeDefined();

    // Special Characters
    const contactSpecialName = { name: 'Juan@Cruz', email: 'test@example.com', phone: '09171234567' };
    result = validateContact(contactSpecialName);
    expect(result.isValid).toBe(false);
    expect(result.errors.name).toBeDefined();
  });

  // Test Case 3: Invalid Email Validation
  test('should fail when email format is invalid', () => {
    // Missing @ symbol
    const contactMissingAt = { name: 'Juan Cruz', email: 'juancruz.example.com', phone: '09171234567' };
    let result = validateContact(contactMissingAt);
    expect(result.isValid).toBe(false);
    expect(result.errors.email).toBeDefined();

    // Missing domain extension
    const contactMissingExt = { name: 'Juan Cruz', email: 'juan@example', phone: '09171234567' };
    result = validateContact(contactMissingExt);
    expect(result.isValid).toBe(false);
    expect(result.errors.email).toBeDefined();
  });

  // Test Case 4: Invalid Phone Validation
  test('should fail when phone format is invalid', () => {
    // Too few digits
    const contactShortPhone = { name: 'Juan Cruz', email: 'juan@example.com', phone: '0917' };
    let result = validateContact(contactShortPhone);
    expect(result.isValid).toBe(false);
    expect(result.errors.phone).toBeDefined();

    // Non-numeric characters
    const contactAlphaPhone = { name: 'Juan Cruz', email: 'juan@example.com', phone: '0917abcde12' };
    result = validateContact(contactAlphaPhone);
    expect(result.isValid).toBe(false);
    expect(result.errors.phone).toBeDefined();

    // Invalid format (e.g., prefix not matching common PH format or international format)
    const contactBadPrefix = { name: 'Juan Cruz', email: 'juan@example.com', phone: '12345678900' };
    result = validateContact(contactBadPrefix);
    expect(result.isValid).toBe(false);
    expect(result.errors.phone).toBeDefined();
  });
});
