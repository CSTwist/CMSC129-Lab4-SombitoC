/**
 * Contact Validation Utilities
 * Clean, modularized helper functions for validating name, email, and phone.
 */

function validateName(name) {
  if (!name || typeof name !== 'string') {
    return 'Name is required';
  }
  const trimmed = name.trim();
  if (trimmed.length < 2) {
    return 'Name must be at least 2 characters long';
  }
  if (trimmed.length > 50) {
    return 'Name must be at most 50 characters long';
  }
  if (!/^[a-zA-Z0-9 ]+$/.test(trimmed)) {
    return 'Name must only contain alphanumeric characters and spaces';
  }
  return null;
}

function validateEmail(email) {
  if (!email || typeof email !== 'string') {
    return 'Email is required';
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Invalid email format';
  }
  return null;
}

function validatePhone(phone) {
  if (!phone || typeof phone !== 'string') {
    return 'Phone number is required';
  }
  // PH Mobile format: starts with 09 or +639 followed by exactly 9 digits
  const phoneRegex = /^(09|\+639)\d{9}$/;
  if (!phoneRegex.test(phone)) {
    return 'Phone number must be a valid Philippine mobile number (e.g., 09XXXXXXXXX or +639XXXXXXXXX)';
  }
  return null;
}

/**
 * Validates a contact object.
 * @param {Object} contact - The contact to validate.
 * @returns {Object} { isValid, errors }
 */
function validateContact(contact) {
  const errors = {};
  
  const nameError = validateName(contact.name);
  if (nameError) errors.name = nameError;

  const emailError = validateEmail(contact.email);
  if (emailError) errors.email = emailError;

  const phoneError = validatePhone(contact.phone);
  if (phoneError) errors.phone = phoneError;

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

module.exports = {
  validateContact,
  validateName,
  validateEmail,
  validatePhone
};
