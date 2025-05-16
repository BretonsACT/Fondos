/**
 * Clase para manejar las consultas a la API financiera
 * Actualmente utiliza una simulación de API para demostración
 */
class FundAPI {
  constructor(apiKey = null) {
    this.apiKey = apiKey;
    // En un entorno real, utilizaríamos una API financiera
    // this.baseUrl = 'https://api.financialdata.org/v1/';
    
    // Para demostración, usaremos datos simulados
    this.demoFunds = {
      // Fondos españoles
      'ES0138791037': {
        name: 'Santander Acciones Españolas',
        isin: 'ES0138791037',
        category: 'Renta Variable España',
        management: 'Santander Asset Management'
      },
      'ES0114797036': {
        name: 'BBVA Bolsa',
        isin: 'ES0114797036',
        category: 'Renta Variable España',
        management: 'BBVA Asset Management'
      },
      'ES0147622031': {
        name: 'CaixaBank Bolsa España 150',
        isin: 'ES0147622031',
        category: 'Renta Variable España',
        management: 'CaixaBank Asset Management'
      },
      // Fondos internacionales
      'LU0996177134': {
        name: 'Fidelity World Fund',
        isin: 'LU0996177134',
        category: 'Renta Variable Internacional',
        management: 'Fidelity International'
      },
      'IE00B4L5Y983': {
        name: 'iShares Core MSCI World',
        isin: 'IE00B4L5Y983',
        category: 'ETF - Global',
        management: 'BlackRock'
      },
      'LU0140363002': {
        name: 'DPAM Equities World Sustainable',
        isin: 'LU0140363002',
        category: 'Renta Variable Internacional - ESG',
        management: 'Degroof Petercam'
      }
    };
  }

  /**
   * Obtiene información básica de un fondo por su ISIN
   * @param {string} isin - Código ISIN del fondo
   * @returns {Promise} Promesa con los datos del fondo
   */
  async getFundData(isin) {
    // Simulamos una llamada a API
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const fund = this.demoFunds[isin];
        if (fund) {
          resolve(fund);
        } else {
          reject(new Error('Fondo no encontrado'));
        }
      }, 600);
    });
  }

  /**
   * Obtiene el rendimiento de un fondo por su ISIN
   * @param {string} isin - Código ISIN del fondo
   * @returns {Promise} Promesa con los datos de rendimiento
   */
  async getFundPerformance(isin) {
    // Simulamos una llamada a API con datos aleatorios para demostración
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const fund = this.demoFunds[isin];
        if (fund) {
          // Generamos datos simulados de rendimiento
          // En un entorno real, estos datos vendrían de la API
          const monthVariation = (Math.random() * 10 - 5).toFixed(2); // Entre -5% y +5%
          const yearVariation = (Math.random() * 20 - 10).toFixed(2);  // Entre -10% y +10%
          const volatility = (Math.random() * 8 + 2).toFixed(2);       // Entre 2% y 10%
          
          resolve({
            isin: isin,
            monthVariation: parseFloat(monthVariation),
            yearVariation: parseFloat(yearVariation),
            volatility: parseFloat(volatility)
          });
        } else {
          reject(new Error('Fondo no encontrado'));
        }
      }, 800);
    });
  }
}
