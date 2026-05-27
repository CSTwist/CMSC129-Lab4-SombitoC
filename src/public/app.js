/**
 * Contacts Hub Frontend App Script
 * Manages UI interactions, form validation, dynamic searches, and API integrations.
 */

// Global State
let allContacts = [];
let contactToDeleteId = null;

// DOM Elements
const contactForm = document.getElementById('contact-form');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const phoneInput = document.getElementById('phone');
const saveBtn = document.getElementById('save-btn');
const searchInput = document.getElementById('search');
const contactsList = document.getElementById('contacts-list');

// Error Elements
const nameError = document.getElementById('name-error');
const emailError = document.getElementById('email-error');
const phoneError = document.getElementById('phone-error');

// Modal Elements
const deleteModal = document.getElementById('delete-confirm-modal');
const deleteContactNameLabel = document.getElementById('delete-contact-name');
const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
const cancelDeleteBtn = document.getElementById('cancel-delete-btn');

// Fetch and render contacts on startup
document.addEventListener('DOMContentLoaded', () => {
  fetchContacts();
  setupEventListeners();
});

function setupEventListeners() {
  // Form Submission
  contactForm.addEventListener('submit', handleFormSubmit);

  // Instant Search
  searchInput.addEventListener('input', handleSearch);

  // Input events to clear validation warnings on type
  nameInput.addEventListener('input', () => clearFieldError(nameInput, nameError));
  emailInput.addEventListener('input', () => clearFieldError(emailInput, emailError));
  phoneInput.addEventListener('input', () => clearFieldError(phoneInput, phoneError));

  // Modal Actions
  cancelDeleteBtn.addEventListener('click', hideDeleteModal);
  confirmDeleteBtn.addEventListener('click', executeDeleteContact);
  
  // Close modal clicking outside the modal box
  deleteModal.addEventListener('click', (e) => {
    if (e.target === deleteModal) hideDeleteModal();
  });
}

// Fetch all contacts from API
async function fetchContacts() {
  try {
    const response = await fetch('/api/contacts');
    if (response.ok) {
      allContacts = await response.json();
      renderContacts(allContacts);
    } else {
      console.error('Failed to load contacts');
    }
  } catch (error) {
    console.error('Error fetching contacts:', error);
  }
}

// Render contacts list in UI
function renderContacts(contactsArray) {
  contactsList.innerHTML = '';

  if (contactsArray.length === 0) {
    contactsList.innerHTML = `
      <div class="empty-state">
        <i class="fa-solid fa-circle-nodes empty-icon"></i>
        <p>${searchInput.value.trim() ? 'No matching contacts found.' : 'No contacts found. Add some above!'}</p>
      </div>
    `;
    return;
  }

  contactsArray.forEach(contact => {
    const card = createContactCardDOM(contact);
    contactsList.appendChild(card);
  });
}

/**
 * Creates and returns the DOM element for a single contact card.
 * @param {Object} contact - The contact object.
 * @returns {HTMLElement} The constructed contact card DOM node.
 */
function createContactCardDOM(contact) {
  const card = document.createElement('div');
  card.className = 'contact-card';
  card.setAttribute('data-id', contact.id);

  // Get initials for avatar
  const initials = contact.name
    .split(' ')
    .map(part => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  card.innerHTML = `
    <div class="avatar-circle">${initials || 'C'}</div>
    <div class="contact-info">
      <div class="contact-name">${escapeHTML(contact.name)}</div>
      <div class="contact-details">
        <div class="detail-item contact-email">
          <i class="fa-regular fa-envelope"></i>${escapeHTML(contact.email)}
        </div>
        <div class="detail-item contact-phone">
          <i class="fa-solid fa-mobile-screen"></i>${escapeHTML(contact.phone)}
        </div>
      </div>
    </div>
    <div class="contact-actions">
      <button class="delete-btn" aria-label="Delete contact">
        <i class="fa-regular fa-trash-can"></i>
      </button>
    </div>
  `;

  // Hook delete button click
  card.querySelector('.delete-btn').addEventListener('click', () => {
    showDeleteModal(contact.id, contact.name);
  });

  return card;
}

// Handle Form Submission
async function handleFormSubmit(e) {
  e.preventDefault();
  
  // Clear any existing errors
  clearErrors();

  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const phone = phoneInput.value.trim();

  // Disable all controls to prevent race conditions during async submit
  toggleFormDisabledState(true);

  try {
    const response = await fetch('/api/contacts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, email, phone })
    });

    const data = await response.json();

    if (response.status === 201) {
      // Success: Clear form inputs completely
      contactForm.reset();
      await fetchContacts();
      
      // If search input had text, filter again or clear it
      if (searchInput.value.trim()) {
        handleSearch();
      }
    } else if (response.status === 400 && data.errors) {
      // Validation Error
      showFieldErrors(data.errors);
    } else {
      console.error('Unexpected response:', data);
    }
  } catch (error) {
    console.error('Error creating contact:', error);
  } finally {
    // Re-enable form fields
    toggleFormDisabledState(false);
  }
}

// Filter contacts dynamically based on search query
function handleSearch() {
  const query = searchInput.value.trim().toLowerCase();
  
  if (!query) {
    renderContacts(allContacts);
    return;
  }

  const filtered = allContacts.filter(contact => 
    contact.name.toLowerCase().includes(query) || 
    contact.email.toLowerCase().includes(query)
  );

  renderContacts(filtered);
}

// Show validation errors on fields
function showFieldErrors(errors) {
  if (errors.name) {
    showFieldError(nameInput, nameError, errors.name);
  }
  if (errors.email) {
    showFieldError(emailInput, emailError, errors.email);
  }
  if (errors.phone) {
    showFieldError(phoneInput, phoneError, errors.phone);
  }
}

function showFieldError(inputEl, errorEl, message) {
  inputEl.classList.add('input-error');
  errorEl.textContent = message;
  errorEl.classList.add('visible');
}

function clearFieldError(inputEl, errorEl) {
  inputEl.classList.remove('input-error');
  errorEl.textContent = '';
  errorEl.classList.remove('visible');
}

function clearErrors() {
  clearFieldError(nameInput, nameError);
  clearFieldError(emailInput, emailError);
  clearFieldError(phoneInput, phoneError);
}

// Enable/Disable Form Inputs
function toggleFormDisabledState(disabled) {
  nameInput.disabled = disabled;
  emailInput.disabled = disabled;
  phoneInput.disabled = disabled;
  saveBtn.disabled = disabled;

  const btnText = saveBtn.querySelector('.btn-text');
  const btnSpinner = saveBtn.querySelector('.btn-loading-spinner');

  if (disabled) {
    btnText.classList.add('hidden');
    btnSpinner.classList.remove('hidden');
  } else {
    btnText.classList.remove('hidden');
    btnSpinner.classList.add('hidden');
  }
}

// Deletion Modal Interaction
function showDeleteModal(id, name) {
  contactToDeleteId = id;
  deleteContactNameLabel.textContent = name;
  deleteModal.classList.remove('hidden');
  
  // Focus confirm button
  confirmDeleteBtn.focus();
}

function hideDeleteModal() {
  contactToDeleteId = null;
  deleteModal.classList.add('hidden');
}

// API Delete Operation
async function executeDeleteContact() {
  if (!contactToDeleteId) return;

  confirmDeleteBtn.disabled = true;
  confirmDeleteBtn.textContent = 'Deleting...';

  try {
    const response = await fetch(`/api/contacts/${contactToDeleteId}`, {
      method: 'DELETE'
    });

    if (response.ok) {
      hideDeleteModal();
      await fetchContacts();
      if (searchInput.value.trim()) {
        handleSearch();
      }
    } else {
      console.error('Failed to delete contact');
    }
  } catch (error) {
    console.error('Error deleting contact:', error);
  } finally {
    confirmDeleteBtn.disabled = false;
    confirmDeleteBtn.textContent = 'Yes, Delete';
  }
}

// Helper to prevent XSS
function escapeHTML(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
