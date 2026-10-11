// Real console URLs on the medtoken.in domain — paths here match each Angular console's actual
// app.routes.ts + angular.json baseHref exactly (verified against the real source, not guessed):
//   Lab Frontend      baseHref '/lab/'      -> signin/signup routes are 'lab/signin', 'lab/signup'
//   MedToken (Hospital) baseHref '/hospital/' -> 'hospital/signin', 'hospital/signup'
//   Clinic Frontend   baseHref '/clinic/'   -> 'clinic/signin', 'clinic/signup'
//   Pharmacy Frontend baseHref '/pharmacy/' -> 'pharmacy/signin', 'pharmacy/signup'
//   Platform Frontend baseHref '/' (root)   -> 'medtoken/superadmin/login'
// Subdomains (lab./clinic./hospital./platform.) are the only still-placeholder part — swap for
// wherever each app actually gets deployed; nothing else needs to change.
export const CONSOLE_LINKS = {
  lab: {
    // The Lab console also runs scan / imaging work (radiology), so the menu says both.
    label: 'Scan / Lab',
    login: 'https://lab.medtoken.in/lab/signin',
    signup: 'https://lab.medtoken.in/lab/signup',
  },
  clinic: {
    label: 'Clinic',
    login: 'https://clinic.medtoken.in/clinic/signin',
    signup: 'https://clinic.medtoken.in/clinic/signup',
  },
  hospital: {
    label: 'Hospital',
    login: 'https://hospital.medtoken.in/hospital/signin',
    signup: 'https://hospital.medtoken.in/hospital/signup',
  },
  pharmacy: {
    label: 'Pharmacy',
    login: 'https://pharmacy.medtoken.in/pharmacy/signin',
    signup: 'https://pharmacy.medtoken.in/pharmacy/signup',
  },
  platform: {
    label: 'Platform',
    login: 'https://platform.medtoken.in/medtoken/superadmin/login',
  },
};

export const LOGIN_LINKS = [
  { name: CONSOLE_LINKS.lab.label, url: CONSOLE_LINKS.lab.login },
  { name: CONSOLE_LINKS.clinic.label, url: CONSOLE_LINKS.clinic.login },
  { name: CONSOLE_LINKS.hospital.label, url: CONSOLE_LINKS.hospital.login },
  { name: CONSOLE_LINKS.pharmacy.label, url: CONSOLE_LINKS.pharmacy.login },
];

export const SIGNUP_LINKS = [
  { name: CONSOLE_LINKS.lab.label, url: CONSOLE_LINKS.lab.signup },
  { name: CONSOLE_LINKS.clinic.label, url: CONSOLE_LINKS.clinic.signup },
  { name: CONSOLE_LINKS.hospital.label, url: CONSOLE_LINKS.hospital.signup },
  { name: CONSOLE_LINKS.pharmacy.label, url: CONSOLE_LINKS.pharmacy.signup },
];
