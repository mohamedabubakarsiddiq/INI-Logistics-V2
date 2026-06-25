// js/script.js - consolidated, safer, with extra diagnostics
(function () {
  'use strict';

  // Utility: generate shipment id
  function generateShipmentId() {
    return 'INI' + Math.floor(1000 + Math.random() * 9000);
  }

  // Safe DOM getter
  function $id(id) {
    return document.getElementById(id);
  }

  // Populate customer dropdown from localStorage
  function loadCustomerDropdown() {
    const dropdown = $id('customerSelect');
    if (!dropdown) return;
    const customers = JSON.parse(localStorage.getItem('customers') || '[]');
    console.log(`loadCustomerDropdown: found ${customers.length} customers`);
    customers.forEach(c => {
      const opt = document.createElement('option');
      opt.value = c.name || c.id || c.email || c.name;
      opt.textContent = c.name || c.email || opt.value;
      dropdown.appendChild(opt);
    });
  }

  // Initialize shipment page: set id and dropdown
  function initializeShipmentPage() {
    const idField = $id('shipmentId');
    if (idField && !idField.value) idField.value = generateShipmentId();
    loadCustomerDropdown();
  }

  // Show non-blocking message (reuses existing showToast if present)
  function showMessage(text, success = true) {
    if (typeof showToast === 'function') {
      showToast(text);
      return;
    }
    const msg = $id('message');
    if (!msg) return;
    msg.textContent = text;
    msg.style.color = success ? 'green' : 'red';
  }

  // Validate required fields
  function validateForm(data) {
    const required = ['sender', 'receiver', 'origin', 'destination', 'weight', 'cost'];
    for (const key of required) {
      if (!data[key] && data[key] !== 0) {
        return `Please fill the ${key} field.`;
      }
    }
    if (isNaN(Number(data.weight)) || Number(data.weight) <= 0) return 'Weight must be a positive number.';
    if (isNaN(Number(data.cost)) || Number(data.cost) < 0) return 'Cost must be a number.';
    return null;
  }

  // Save shipment (single consolidated function)
  function saveShipmentHandler(event) {
    event && event.preventDefault();
    console.log('saveShipmentHandler called');
    const shipment = {
      id: $id('shipmentId') ? $id('shipmentId').value : generateShipmentId(),
      sender: ($id('customerSelect') && $id('customerSelect').value) || ($id('sender') && $id('sender').value.trim()) || 'Unknown',
      senderPhone: $id('senderPhone') ? $id('senderPhone').value.trim() : '',
      receiver: $id('receiver') ? $id('receiver').value.trim() : '',
      receiverPhone: $id('receiverPhone') ? $id('receiverPhone').value.trim() : '',
      email: $id('email') ? $id('email').value.trim() : '',
      address: $id('address') ? $id('address').value.trim() : '',
      origin: $id('origin') ? $id('origin').value.trim() : '',
      destination: $id('destination') ? $id('destination').value.trim() : '',
      weight: $id('weight') ? Number($id('weight').value) : 0,
      packageType: $id('packageType') ? $id('packageType').value : '',
      cost: $id('cost') ? Number($id('cost').value) : 0,
      priority: $id('priority') ? $id('priority').value : 'Standard',
      status: $id('status') ? $id('status').value : 'Shipment Created',
      notes: $id('notes') ? $id('notes').value.trim() : '',
      estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      createdDate: new Date().toLocaleDateString(),
      currentLocation: $id('origin') ? $id('origin').value.trim() : ''
    };

    console.log('saveShipmentHandler: built shipment object', shipment);

    const validationError = validateForm(shipment);
    if (validationError) {
      console.warn('saveShipmentHandler: validation failed:', validationError);
      showMessage(validationError, false);
      return;
    }

    console.log('saveShipmentHandler: validation passed');

    const shipments = JSON.parse(localStorage.getItem('shipments') || '[]');
    shipments.push(shipment);
    localStorage.setItem('shipments', JSON.stringify(shipments));

    console.log('saveShipmentHandler: shipment saved, total shipments =', shipments.length);

    showMessage('✅ Shipment Created Successfully', true);

    // small UX delay then navigate to shipments list
    setTimeout(() => {
      window.location.href = 'shipments.html';
    }, 900);
  }

  // Publicly-exposed minimal functions for other pages (guarded)
  function loadShipmentsTable() {
    const table = $id('shipmentTable');
    if (!table) return;
    const shipments = JSON.parse(localStorage.getItem('shipments') || '[]');
    table.innerHTML = '';
    shipments.forEach((s, idx) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${s.id}</td>
        <td>${s.sender}</td>
        <td>${s.receiver}</td>
        <td>${s.origin}</td>
        <td>${s.destination}</td>
        <td>${s.packageType || ''}</td>
        <td>${s.weight || ''} KG</td>
        <td>${s.priority || ''}</td>
        <td>₹${s.cost || 0}</td>
        <td>${s.estimatedDelivery || ''}</td>
        <td><span class="status ${statusClass(s.status)}">${s.status}</span></td>
        <td>
          <button class="action-btn" data-index="${idx}" data-action="view">View</button>
          <button class="action-btn edit-btn" data-index="${idx}" data-action="edit">Edit</button>
          <button class="action-btn delete-btn" data-index="${idx}" data-action="delete">Delete</button>
        </td>
      `;
      table.appendChild(tr);
    });
  }

  function statusClass(status) {
    switch (status) {
      case 'Shipment Created': return 'created';
      case 'Picked Up': return 'picked';
      case 'In Transit': return 'transit';
      case 'Out For Delivery': return 'delivery';
      case 'Delivered': return 'delivered';
      default: return '';
    }
  }

  // View, Edit, Delete handlers using event delegation (safer)
  function tableActionHandler(e) {
    const btn = e.target.closest('button[data-action]');
    if (!btn) return;
    const idx = Number(btn.dataset.index);
    const action = btn.dataset.action;
    const shipments = JSON.parse(localStorage.getItem('shipments') || '[]');

    if (action === 'view') {
      const s = shipments[idx];
      if (!s) return alert('Shipment not found');
      alert(`Shipment ID: ${s.id}\nSender: ${s.sender}\nReceiver: ${s.receiver}\nOrigin: ${s.origin}\nDestination: ${s.destination}\nStatus: ${s.status}\nPriority: ${s.priority}\nCost: ₹${s.cost}`);
      return;
    }

    if (action === 'edit') {
      const newStatus = prompt('Set new status:\nShipment Created\nPicked Up\nIn Transit\nOut For Delivery\nDelivered', shipments[idx].status);
      if (!newStatus) return;
      shipments[idx].status = newStatus;
      localStorage.setItem('shipments', JSON.stringify(shipments));
      loadShipmentsTable();
      return;
    }

    if (action === 'delete') {
      if (!confirm('Delete this shipment?')) return;
      shipments.splice(idx, 1);
      localStorage.setItem('shipments', JSON.stringify(shipments));
      loadShipmentsTable();
      return;
    }
  }

  // Tracking helper: safe implementation for tracking.html
  function trackShipmentById(trackingId) {
    if (!trackingId) return null;
    const shipments = JSON.parse(localStorage.getItem('shipments') || '[]');
    return shipments.find(s => s.id === trackingId) || null;
  }

  // Wire up events on DOM ready
  document.addEventListener('DOMContentLoaded', function () {
    console.log('script.js DOMContentLoaded');
    // Initialize page id & customers
    initializeShipmentPage();

    // Expose save handler for debugging
    window.saveShipment = saveShipmentHandler;

    // Create button
    const createBtn = $id('createShipmentBtn');
    if (createBtn) {
      createBtn.addEventListener('click', saveShipmentHandler);
      console.log('Bound saveShipmentHandler to #createShipmentBtn');
    } else console.warn('createShipmentBtn not found on page');

    // Shipment table actions
    const shipmentTable = $id('shipmentTable');
    if (shipmentTable) {
      shipmentTable.addEventListener('click', tableActionHandler);
      console.log('Bound tableActionHandler to #shipmentTable');
    } else console.log('No #shipmentTable on this page');

    // If page lists shipments, populate
    loadShipmentsTable();

    // Expose tracking helper to global for tracking page to use
    window.trackShipmentById = trackShipmentById;
    window.initializeShipmentPage = initializeShipmentPage;
    window.loadShipments = loadShipmentsTable;
  });

})();
