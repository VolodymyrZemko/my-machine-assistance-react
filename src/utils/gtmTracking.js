/**
 * Google Tag Manager (GTM) Tracking Events
 * Centralized tracking functions for the Machine Assistance application
 */

/**
 * Track tab change on list page
 * @param {string} tabName - English name of the tab (e.g., "My Machine", "Original", "Vertuo", "Milk Devices")
 */
export const GTMtrackTabChange = (tabName) => {
  window.gtmDataObject = window.gtmDataObject || [];
  window.gtmDataObject.push({
    event: 'local_event',
    event_raised_by: 'gr',
    local_event_category: 'user engagement',
    local_event_action: 'click',
    local_event_label: `machine assistance - ${tabName}`
  });
  console.log(`GTM Event: machine assistance - ${tabName}`);
};

/**
 * Track footer view event
 * Triggered when the footer is 100% in view for a certain duration
 */
// export const trackFooterView = () => {
//   window.gtmDataObject = window.gtmDataObject || [];
//   window.gtmDataObject.push({
//     event: 'local_event',
//     event_raised_by: 'gr',
//     local_event_category: 'impression',
//     local_event_action: 'view',
//     local_event_label: 'machine assistance - need help - {machine name/search}'
//   });
//   console.log('GTM Event: machine assistance - need help - {machine name/search}');
// };
