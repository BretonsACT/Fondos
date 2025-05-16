/**
 * Clase para manejar la interfaz de usuario
 */
class UI {
  /**
   * Muestra los fondos en la tabla
   * @param {Array} funds - Array de objetos con datos de los fondos
   * @param {Array} performances - Array de objetos con datos de rendimiento
   */
  static displayFunds(funds, performances) {
    const tableBody = document.getElementById('fundsTableBody');
    const emptyState = document.getElementById('emptyState');
    
    // Mostrar/ocultar estados
