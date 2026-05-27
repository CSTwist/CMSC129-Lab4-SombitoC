let contacts = [];
let nextId = 1;

class ContactsStore {
  static getAll() {
    return [...contacts];
  }

  static create(contact) {
    const newContact = {
      id: nextId++,
      name: contact.name,
      email: contact.email,
      phone: contact.phone
    };
    contacts.push(newContact);
    return newContact;
  }

  static delete(id) {
    const idToFind = Number(id);
    const index = contacts.findIndex(c => c.id === idToFind || String(c.id) === String(id));
    if (index !== -1) {
      contacts.splice(index, 1);
      return true;
    }
    return false;
  }

  static clear() {
    contacts = [];
    nextId = 1;
  }
}

module.exports = ContactsStore;
