/**
 * Clase para gestionar el almacenamiento y recuperación de fondos del usuario
 */
class UserFundsManager {
  constructor() {
    this.funds = this.loadFundsFromStorage();
    this.fundPerformances = {};
  }

  /**
   * Carga los fondos guardados del almacenamiento local
   * @returns {Array} Array de fondos guardados
   */
  loadFundsFromStorage() {
    const storedFunds = localStorage.getItem('userFunds');
    return storedFunds ? JSON.parse(storedFunds) : [];
  }

  /**
   * Guarda los fondos en el almacenamiento local
   */
  saveFundsToStorage() {
    localStorage.setItem('userFunds', JSON.stringify(this.funds));
  }

  /**
   * Añade un nuevo fondo a la lista
   * @param {string} isin - Código ISIN del fondo
   * @param {string} name - Nombre del fondo
   * @returns {boolean} true si se añadió correctamente, false si ya existía
   */
  addFund(isin, name) {
    if (!this.funds.some(fund => fund.isin === isin)) {
      this.funds.push({ 
        isin, 
        name, 
        dateAdded: new Date().toISOString() 
      });
      this.saveFundsToStorage();
      return true;
    }
    return false;
  }

  /**
   * Elimina un fondo de la lista
   * @param {string} isin - Código ISIN del fondo a eliminar
   */
  removeFund(isin) {
    this.funds = this.funds.filter(fund => fund.isin !== isin);
    this.saveFundsToStorage();
  }

  /**
   * Obtiene la lista de fondos guardados
   * @returns {Array} Array con los fondos guardados
   */
  getFunds() {
    return this.funds;
  }

  /**
   * Guarda los datos de rendimiento de un fondo
   * @param {string} isin - Código ISIN del fondo
   * @param {Object} performance - Datos de rendimiento
   */
  savePerformance(isin, performance) {
    this.fundPerformances[isin] = {
      ...performance,
      lastUpdate: new Date().toISOString()
    };
  }

  /**
   * Obtiene los datos de rendimiento de un fondo
   * @param {string} isin - Código ISIN del fondo
   * @returns {Object|null} Datos de rendimiento o null si no existen
   */
  getPerformance(isin) {
    return this.fundPerformances[isin] || null;
  }

  /**
   * Comprueba si hay datos de rendimiento almacenados para un fondo
   * @param {string} isin - Código ISIN del fondo
   * @returns {boolean} true si existen datos de rendimiento
   */
  hasPerformanceData(isin) {
    return !!this.fundPerformances[isin];
  }

  /**
   * Valida el formato de un código ISIN
   * @param {string} isin - Código a validar
   * @returns {boolean} true si es válido
   */
  static isValidISIN(isin) {
    const isinRegex = /^[A-Z]{2}[A-Z0-9]{9}[0-9]$/;
    return isinRegex.test(isin);
  }
}

