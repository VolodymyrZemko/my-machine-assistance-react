export const translations = {
  en: {
    // Search
    searchTitle: "Machine Assistance",
    searchDescription: "Nespresso offers step by step instructions and easy guides to help you make the most of your Nespresso machine and Aeroccino milk frother. Simply choose your model listed below and find everything you need to know about your machine.",
    searchPlaceholder: "Search machines by name...",
    searchResultFor: "Search result for:",
    didntFindWhat: "Didn't find what you need?",
    selectFromList: "Select your machine from the list below.",
    
    // Tabs
    myMachine: "My Machine",
    olMachines: "OL Machines",
    vlMachines: "VL Machines",
    milkMachines: "Milk Machines",
    
    // My Machine Section
    yourMachines: "Your Machines",
    pleaseLogin: "Please log in to your account to find the machines registered to you.",
    loginToAccount: "Log in to your account",
    noMachines: "You do not have any registered machine, choose from list.",
    myAccount: "My Account",
    viewDetails: "View Details",
    machineNotFound: "Unfortunately, we did not find your machine. Please use search or find it from the list below.",
    
    // Machine Detail
    serialNumber: "S/N:",
    purchaseDate: "Purchase Date:",
    
    // Breadcrumbs
    home: "Home",
    machineAssistance: "Machine Assistance",
    
    // Tabs in detail
    overview: "Overview",
    guides: "Guides",
    troubleshooting: "Troubleshooting",
    
    // Messages
    noData: "Data is not available for this machine.",
    overviewNotAvailable: "Overview data is not available for this machine.",
    guidesNotAvailable: "Guides data is not available for this machine.",
    troubleshootingNotAvailable: "Troubleshooting data is not available for this machine.",
    
    // Guide section
    selectFunctionality: "Select a functionality from the list below to view detailed guides and videos.",
    backToGuides: "Back to all guides",
    step: "Step",
    selectIssue: "Select the issue you are facing from the list below.",
    
    // Footer
    personalizedAssistance: "PERSONALIZED MACHINE ASSISTANCE",
    needHelp: "NEED HELP?"
  },
  el: {
    // Search
    searchTitle: "Υποστήριξη Μηχανών",
    searchDescription: "Η Nespresso προσφέρει οδηγίες βήμα προς βήμα και εύκολους οδηγούς για να σας βοηθήσει να αξιοποιήσετε στο έπακρο τη μηχανή Nespresso και τον αφρογαλακτοποιητή Aeroccino. Απλά επιλέξτε το μοντέλο σας από την παρακάτω λίστα και βρείτε όλα όσα χρειάζεστε να γνωρίζετε για τη μηχανή σας.",
    searchPlaceholder: "Αναζήτηση μηχανών κατά όνομα...",
    searchResultFor: "Αποτέλεσμα αναζήτησης για:",
    didntFindWhat: "Δεν βρήκατε αυτό που χρειάζεστε;",
    selectFromList: "Επιλέξτε τη μηχανή σας από την παρακάτω λίστα.",
    
    // Tabs
    myMachine: "Η Μηχανή Μου",
    olMachines: "Μηχανές OL",
    vlMachines: "Μηχανές VL",
    milkMachines: "Μηχανές Γάλακτος",
    
    // My Machine Section
    yourMachines: "Οι Μηχανές Σας",
    pleaseLogin: "Παρακαλώ συνδεθείτε στον λογαριασμό σας για να βρείτε τις μηχανές που είναι εγγεγραμμένες σε εσάς.",
    loginToAccount: "Συνδεθείτε στον λογαριασμό σας",
    noMachines: "Δεν έχετε καμία εγγεγραμμένη μηχανή, επιλέξτε από τη λίστα.",
    myAccount: "Ο Λογαριασμός Μου",
    viewDetails: "Προβολή Λεπτομερειών",
    machineNotFound: "Δυστυχώς, δεν βρήκαμε τη μηχανή σας. Παρακαλώ χρησιμοποιήστε την αναζήτηση ή βρείτε την από την παρακάτω λίστα.",
    
    // Machine Detail
    serialNumber: "Α/Σ:",
    purchaseDate: "Ημερομηνία Αγοράς:",
    
    // Breadcrumbs
    home: "Αρχική",
    machineAssistance: "Υποστήριξη Μηχανών",
    
    // Tabs in detail
    overview: "Επισκόπηση",
    guides: "Οδηγοί",
    troubleshooting: "Αντιμετώπιση Προβλημάτων",
    
    // Messages
    noData: "Τα δεδομένα δεν είναι διαθέσιμα για αυτή τη μηχανή.",
    overviewNotAvailable: "Τα δεδομένα επισκόπησης δεν είναι διαθέσιμα για αυτή τη μηχανή.",
    guidesNotAvailable: "Οι οδηγοί δεν είναι διαθέσιμοι για αυτή τη μηχανή.",
    troubleshootingNotAvailable: "Η αντιμετώπιση προβλημάτων δεν είναι διαθέσιμη για αυτή τη μηχανή.",
    
    // Guide section
    selectFunctionality: "Επιλέξτε μια λειτουργία από την παρακάτω λίστα για να δείτε λεπτομερείς οδηγούς και βίντεο.",
    backToGuides: "Πίσω σε όλους τους οδηγούς",
    step: "Βήμα",
    selectIssue: "Επιλέξτε το πρόβλημα που αντιμετωπίζετε από την παρακάτω λίστα.",
    
    // Footer
    personalizedAssistance: "ΕΞΑΤΟΜΙΚΕΥΜΕΝΗ ΥΠΟΣΤΗΡΙΞΗ ΜΗΧΑΝΩΝ",
    needHelp: "ΧΡΕΙΑΖΕΣΤΕ ΒΟΗΘΕΙΑ;"
  }
};

// Get current language from HTML lang attribute
export function getCurrentLanguage() {
  const htmlLang = document.documentElement.lang || 'en';
  return htmlLang.toLowerCase().startsWith('el') ? 'el' : 'en';
}

// Get translation function
export function useTranslation() {
  const lang = getCurrentLanguage();
  return (key) => translations[lang]?.[key] || translations.en[key] || key;
}
