export const applyResponsiveStyles = () => {
      const width = window.innerWidth;
      const dashboardElement = document.querySelector('.dashboard-container');
      
      if (!dashboardElement) return;

      
      dashboardElement.classList.remove(
        'dashboard-mobile', 
        'dashboard-small-tablet', 
        'dashboard-medium-tablet',
        'dashboard-large-tablet',
        'dashboard-extra-large',
        'dashboard-very-small'
      );

      if (width <= 480) {
        dashboardElement.classList.add('dashboard-very-small');
      } else if (width <= 575) {
        dashboardElement.classList.add('dashboard-mobile');
      } else if (width <= 767) {
        dashboardElement.classList.add('dashboard-small-tablet');
      } else if (width <= 991) {
        dashboardElement.classList.add('dashboard-medium-tablet');
      } else if (width <= 1199) {
        dashboardElement.classList.add('dashboard-large-tablet');
      } else {
        dashboardElement.classList.add('dashboard-extra-large');
      }
    };