/**
 * Contact Validation Logic
 * Implements validation for contacts: name, email, and phone.
 */
function validateContact(contact) {
  const errors = {};

  // 1. Name Validation
  if (!contact.name || typeof contact.name !== 'string') {
    errors.name = 'Name is required';
  } else {
    const trimmedName = contact.name.trim();
    if (trimmedName.length < 2) {
      errors.name = 'Name must be at least 2 characters long';
    } else if (trimmedName.length > 50) {
      errors.name = 'Name must be at most 50 characters long';
    } else if (!/^[a-zA-Z0-9 ]+$/.test(trimmedName)) {
      errors.name = 'Name must only contain alphanumeric characters and spaces';
    }
  }

  // 2. Email Validation
  if (!contact.email || typeof contact.email !== 'string') {
    errors.email = 'Email is required';
  } else {
    // Simple robust email regex that requires domain extension
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contact.email)) {
      errors.email = 'Invalid email format';
    }
  }

  // 3. Phone Validation
  if (!contact.phone || typeof contact.phone !== 'string') {
    errors.phone = 'Phone number is required';
  } else {
    // PH Mobile format: starts with 09 or +639 followed by exactly 9 digits
    const phoneRegex = /^(09|\+639)\d{9}$/;
    if (!phoneRegex.test(contact.phone)) {
      errors.phone = 'Phone number must be a valid Philippine mobile number (e.g., 09XXXXXXXXX or +639XXXXXXXXX)';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

module.exports = {
  validateContact
};
