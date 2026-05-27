const express = require('express');
const router = express.Router();
const ContactsStore = require('../models/contactsStore');
const { validateContact } = require('../utils/validator');

/**
5:  * Express routes for contacts REST API
6:  */

// GET /api/contacts - Retrieve all contacts
router.get('/', (req, res) => {
  try {
    const contacts = ContactsStore.getAll();
    res.status(200).json(contacts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/contacts - Create a new contact
router.post('/', (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const { isValid, errors } = validateContact({ name, email, phone });

    if (!isValid) {
      return res.status(400).json({ errors });
    }

    const newContact = ContactsStore.create({ name, email, phone });
    res.status(201).json(newContact);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/contacts/:id - Delete a contact
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const deleted = ContactsStore.delete(id);
    if (deleted) {
      res.status(200).json({ message: "Contact deleted successfully" });
    } else {
      res.status(404).json({ error: "Contact not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/contacts/clear - Clear all contacts (primarily for E2E tests state isolation)
router.post('/clear', (req, res) => {
  try {
    ContactsStore.clear();
    res.status(200).json({ message: "Contacts cleared successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
