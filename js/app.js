document.addEventListener('DOMContentLoaded', initApp);

// API key (normalmente se manejaría en el backend por seguridad)
const API_KEY = 'demo_api_key'; 
const fundAPI = new FundAPI(API_KEY);
const userFundsManager = new UserFundsManager();

async function initApp() {
  // Registrar el Service Worker para PWA
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/service-worker.js');
      console.log('Service Worker registrado correctamente', registration);
    } catch (error) {
      console.log('Error al registrar el Service Worker', error);
    }
  }
  
  // Cargar datos iniciales
  await loadUserFunds();
  
  // Configurar event listeners
  document.getElementById('addFundForm').addEventListener('submit', addNewFund);
  document.getElementById('fundsTableBody').addEventListener('click', handleTableClick);
  document.getElementById('sortByMonthBtn').addEventListener('click', () => sortFunds('month'));
  document.getElementById('sortByYearBtn').addEventListener('click', () => sortFunds('year'));
}

async function loadUserFunds() {
  const funds = userFundsManager.getFunds();
  
  if (funds.length === 0) {
    UI.displayEmptyState();
    return;
  }
  
  UI.displayLoading();
  
  try {
    const performances = [];
    
    for (const fund of funds) {
      const performance = await fundAPI.getFundPerformance(fund.isin);
      performances.push(performance);
    }
    
    UI.displayFunds(funds, performances);
  } catch (error) {
    console.error('Error al cargar datos de fondos:', error);
    UI.showAlert('Error al cargar datos de fondos. Inténtalo de nuevo más tarde.', 'danger');
  }
}

async function addNewFund(e) {
  e.preventDefault();
  
  const isinInput = document.getElementById('isinInput');
  const isin = isinInput.value.trim().toUpperCase();
  
  if (!isin) {
    UI.showAlert('Por favor ingrese un ISIN válido', 'danger');
    return;
  }
  
  if (!UserFundsManager.isValidISIN(isin)) {
    UI.showAlert('Formato de ISIN inválido. Debe contener 12 caracteres alfanuméricos.', 'danger');
    return;
  }
  
  try {
    // Mostrar mensaje de carga
    UI.showAlert('Buscando información del fondo...', 'info');
    
    const fundData = await fundAPI.getFundData(isin);
    
    if (!fundData) {
      UI.showAlert('Fondo no encontrado. Verifique el ISIN', 'danger');
      return;
    }
    
    const added = userFundsManager.addFund(isin, fundData.name);
    
    if (added) {
      UI.showAlert('Fondo añadido correctamente', 'success');
      isinInput.value = '';
      await loadUserFunds();
    } else {
      UI.showAlert('Este fondo ya está en su lista', 'warning');
    }
  } catch (error) {
    console.error('Error al añadir el fondo:', error);
    UI.showAlert('Error al añadir el fondo. Inténtalo de nuevo más tarde.', 'danger');
  }
}

function handleTableClick(e) {
  // Manejar eliminación de fondos
  if (e.target.classList.contains('remove-fund')) {
    const isin = e.target.getAttribute('data-isin');
    
    if (confirm('¿Estás seguro de que quieres eliminar este fondo de tu lista?')) {
      userFundsManager.removeFund(isin);
      UI.showAlert('Fondo eliminado correctamente', 'success');
      loadUserFunds();
    }
  }
}

async function sortFunds(criterion) {
  const funds = userFundsManager.getFunds();
  
  if (funds.length === 0) {
    return;
  }
  
  UI.displayLoading();
  
  try {
    const performances = [];
    
    for (const fund of funds) {
      const performance = await fundAPI.getFundPerformance(fund.isin);
      performances.push(performance);
    }
    
    // Ordenar por variación (de mayor pérdida a menor)
    if (criterion === 'month') {
      performances.sort((a, b) => a.returns.oneMonth - b.returns.oneMonth);
    } else {
      performances.sort((a, b) => a.returns.oneYear - b.returns.oneYear);
    }
    
    // Reordenar los fondos según el criterio de rendimiento
    const sortedFunds = performances.map(perf => 
      funds.find(fund => fund.isin === perf.isin)
    );
    
    UI.displayFunds(sortedFunds, performances);
  } catch (error) {
    console.error('Error al ordenar fondos:', error);
    UI.showAlert('Error al ordenar fondos. Inténtalo de nuevo más tarde.', 'danger');
  }
}
