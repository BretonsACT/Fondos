class UI {
  /**
   * Muestra los fondos en la tabla.
   * @param {Array} funds - Array de fondos [{isin, name, ...}]
   * @param {Array} performances - Array de rendimientos [{isin, monthVariation, yearVariation, volatility}]
   */
  static displayFunds(funds, performances) {
    const tableBody = document.getElementById('fundsTableBody');
    const emptyState = document.getElementById('emptyState');
    tableBody.innerHTML = '';

    if (!funds.length) {
      if (emptyState) emptyState.style.display = 'block';
      return;
    }
    if (emptyState) emptyState.style.display = 'none';

    funds.forEach(fund => {
      const perf = performances.find(p => p.isin === fund.isin);
      if (!perf) return;

      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${fund.name}</td>
        <td>${fund.isin}</td>
        <td class="${UI.getVariationClass(perf.monthVariation)}">${perf.monthVariation}%</td>
        <td class="${UI.getVariationClass(perf.yearVariation)}">${perf.yearVariation}%</td>
        <td>${perf.volatility}%</td>
        <td>
          <button class="btn btn-danger btn-sm remove-fund" data-isin="${fund.isin}">Eliminar</button>
        </td>
      `;
      tableBody.appendChild(row);
    });
  }

  /**
   * Devuelve la clase CSS según la variación (positivo/negativo).
   */
  static getVariationClass(variation) {
    if (variation < 0) return 'text-danger';
    if (variation > 0) return 'text-success';
    return '';
  }

  /**
   * Muestra una alerta flotante.
   */
  static showAlert(message, className) {
    // Elimina alertas anteriores
    const existingAlert = document.querySelector('.alert');
    if (existingAlert) existingAlert.remove();

    const div = document.createElement('div');
    div.className = `alert alert-${className} alert-dismissible fade show`;
    div.role = 'alert';
    div.innerHTML = `
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;

    const container = document.querySelector('.container');
    container.insertBefore(div, container.firstChild);

    setTimeout(() => {
      if (div) div.remove();
    }, 3000);
  }

  /**
   * Muestra el indicador de carga.
   */
  static displayLoading(show = true) {
    const loading = document.getElementById('loadingIndicator');
    if (loading) loading.classList.toggle('d-none', !show);
  }

  /**
   * Muestra el estado vacío si no hay fondos.
   */
  static displayEmptyState() {
    const emptyState = document.getElementById('emptyState');
    if (emptyState) emptyState.style.display = 'block';
    const tableBody = document.getElementById('fundsTableBody');
    if (tableBody) tableBody.innerHTML = '';
  }
}
