/**
 * Google Tag Manager (GTM) Tracking Events
 * Centralized tracking functions for the Machine Assistance application
 */


/**
 * Track footer view event
 * Triggered when the footer is 100% in view for a certain duration
 * @param {string} context - 'search' for list page or machine name for detail page
 */
export const trackFooterView = (context) => {
//   window.gtmDataObject = window.gtmDataObject || [];
//   window.gtmDataObject.push({
//     event: 'local_event',
//     event_raised_by: 'gr',
//     local_event_category: 'impression',
//     local_event_action: 'view',
//     local_event_label: 'machine assistance - need help - ' + context
//   });
  console.log('GTM Event: machine assistance - need help -', context);
};

/**
 * Track service T&C link click in footer
 * Triggered when user clicks on the terms & conditions link
 */
export const trackServiceTCClick = () => {
//   window.gtmDataObject = window.gtmDataObject || [];
//   window.gtmDataObject.push({
//     event: 'local_event',
//     event_raised_by: 'gr',
//     local_event_category: 'user engagement',
//     local_event_action: 'click',
//     local_event_label: 'machine assistance - need help - service tc'
//   });
  console.log('GTM Event: machine assistance - need help - service tc');
};

/**
 * Track register machine link click in footer
 * Triggered when user clicks on the "Register your machine" button
 */
export const trackRegisterMachineClick = () => {
//   window.gtmDataObject = window.gtmDataObject || [];
//   window.gtmDataObject.push({
//     event: 'local_event',
//     event_raised_by: 'gr',
//     local_event_category: 'user engagement',
//     local_event_action: 'click',
//     local_event_label: 'machine assistance - register your machine'
//   });
  console.log('GTM Event: machine assistance - register your machine');
};
