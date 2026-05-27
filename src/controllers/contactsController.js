const ContactsStore = require('../models/contactsStore');
const { validateContact } = require('../utils/validator');

/**
 * Contacts Controller
 * Isolates request/response business logic from Express router mapping.
 */
class ContactsController {
  
  // Retrieve all contacts
  static getAllContacts(req, res) {
    try {
      const contacts = ContactsStore.getAll();
      res.status(200).json(contacts);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Create a new contact
  static createContact(req, res) {
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
  }

  // Delete a contact
  static deleteContact(req, res) {
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
  }

  // Clear all contacts (primarily for test state isolation)
  static clearContacts(req, res) {
    try {
      ContactsStore.clear();
      res.status(200).json({ message: "Contacts cleared successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = ContactsController;
