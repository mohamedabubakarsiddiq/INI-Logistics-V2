// js/dashboard.js
// Cleaned and consolidated dashboard logic

function loadDashboard(){
  // Welcome message (optional element)
  const welcomeEl = document.getElementById("welcomeMessage");
  if(welcomeEl){
    welcomeEl.innerText = "Welcome Back, Logistics Administrator";
  }

  const shipments = JSON.parse(localStorage.getItem("shipments")) || [];
  const total = shipments.length;
  const delivered = shipments.filter(s => s.status === "Delivered").length;
  const transit = shipments.filter(s => s.status === "In Transit").length;
  const pending = Math.max(0, total - delivered - transit);

  const setIfExists = (id, value) => {
    const el = document.getElementById(id);
    if(el) el.innerText = value;
  };

  setIfExists("totalShipments", total);
  setIfExists("deliveredShipments", delivered);
  setIfExists("transitShipments", transit);
  setIfExists("pendingShipments", pending);

  // Today stats (if shipments have a createdAt property)
  const today = new Date().toDateString();
  const todayShipmentsCount = shipments.filter(s => s.createdAt && new Date(s.createdAt).toDateString() === today).length;
  const todayDeliveredCount = shipments.filter(s => s.createdAt && s.status === "Delivered" && new Date(s.createdAt).toDateString() === today).length;
  setIfExists("todayShipments", todayShipmentsCount);
  setIfExists("todayDelivered", todayDeliveredCount);

  // Recent Shipments (last 5)
  const table = document.getElementById("recentTable");
  if(table){
    if(shipments.length === 0){
      table.innerHTML = `\n<tr><td colspan="5">No Shipments Available</td></tr>\n`;
    } else {
      table.innerHTML = "";
      shipments.slice(-5).reverse().forEach(sh => {
        table.innerHTML += `\n<tr>\n<td>${sh.id || "-"}</td>\n<td>${sh.sender || "-"}</td>\n<td>${sh.receiver || "-"}</td>\n<td>${sh.destination || "-"}</td>\n<td>${sh.status || "-"}</td>\n</tr>\n`;
      });
    }
  }

  // Revenue
  const revenue = shipments.reduce((acc, s) => acc + Number(s.cost || 0), 0);
  setIfExists("totalRevenue", "₹" + revenue);

  // Customers
  const customers = JSON.parse(localStorage.getItem("customers")) || [];
  setIfExists("totalCustomers", customers.length);

  // Current date
  const currentDateEl = document.getElementById("currentDate");
  if(currentDateEl) currentDateEl.innerHTML = new Date().toDateString();

  // Counters animation (optional)
  const counters = document.querySelectorAll(".counter");
  counters.forEach(counter => {
    const update = () => {
      const target = +counter.dataset.target || 0;
      const count = +counter.innerText || 0;
      const speed = Math.max(1, target / 100);
      if(count < target){
        counter.innerText = Math.ceil(count + speed);
        setTimeout(update, 20);
      } else {
        counter.innerText = target;
      }
    };
    update();
  });

  // Charts: ensure unique canvas IDs and create/update charts only once
  try{
    // Shipment status chart
    const shipmentCanvas = document.getElementById("shipmentChart");
    if(shipmentCanvas){
      const shipmentData = [delivered, transit, pending];
      if(window.shipmentChartInstance){
        // update existing
        window.shipmentChartInstance.data.datasets[0].data = shipmentData;
        window.shipmentChartInstance.update();
      } else {
        window.shipmentChartInstance = new Chart(shipmentCanvas, {
          type: 'pie',
          data: {
            labels: ["Delivered", "In Transit", "Pending"],
            datasets: [{
              data: shipmentData,
              backgroundColor: ['#4caf50', '#2196f3', '#ff9800']
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false
          }
        });
      }
    }

    // Revenue chart
    const revenueCanvas = document.getElementById("revenueChart");
    if(revenueCanvas){
      const cap = 100000;
      const remaining = Math.max(0, cap - revenue);
      const revenueData = [revenue, remaining];

      if(window.revenueChartInstance){
        window.revenueChartInstance.data.datasets[0].data = revenueData;
        window.revenueChartInstance.update();
      } else {
        window.revenueChartInstance = new Chart(revenueCanvas, {
          type: 'doughnut',
          data: {
            labels: ["Revenue", "Remaining"],
            datasets: [{
              data: revenueData,
              backgroundColor: ['#ff6384', '#e9ecef']
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false
          }
        });
      }
    }
  } catch(e){
    console.error('Chart init error', e);
  }
}

// Page load routing
window.addEventListener('load', function(){
  const path = window.location.pathname || '';
  if(path.includes('dashboard.html') || path === '/' || path.endsWith('/')){
    loadDashboard();
  }
  if(path.includes('shipment.html') && typeof initializeShipmentPage === 'function'){
    initializeShipmentPage();
  }
  if(path.includes('shipments.html') && typeof loadShipments === 'function'){
    loadShipments();
  }
});
