const express = require('express');
const router = express.Router();
const ContactsController = require('../controllers/contactsController');

/**
 * Express routes for contacts REST API
 * Maps endpoints directly to ContactsController methods.
 */

// GET /api/contacts - Retrieve all contacts
router.get('/', ContactsController.getAllContacts);

// POST /api/contacts - Create a new contact
router.post('/', ContactsController.createContact);

// DELETE /api/contacts/:id - Delete a contact
router.delete('/:id', ContactsController.deleteContact);

// POST /api/contacts/clear - Clear all contacts (primarily for E2E tests state isolation)
router.post('/clear', ContactsController.clearContacts);

module.exports = router;
