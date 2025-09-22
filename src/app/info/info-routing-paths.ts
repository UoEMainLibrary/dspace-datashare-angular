import { getInfoModulePath } from '../app-routing-paths';

export const END_USER_AGREEMENT_PATH = 'end-user-agreement';
export const PRIVACY_PATH = 'privacy';
export const FEEDBACK_PATH = 'feedback';
export const COAR_NOTIFY_SUPPORT = 'coar-notify-support';
export const ACCESSIBILITY_SETTINGS_PATH = 'accessibility';

// CUSTOMISED
export const ABOUT_PATH = 'about';
export const ACCESSIBILITY_STATEMENT_PATH = 'accessibility-statement';
export const COPYRIGHT_PATH = 'copyright';
export const ORGANISED_PATH = 'organised';

export function getEndUserAgreementPath() {
  return getSubPath(END_USER_AGREEMENT_PATH);
}

export function getPrivacyPath() {
  return getSubPath(PRIVACY_PATH);
}

export function getFeedbackPath() {
  return getSubPath(FEEDBACK_PATH);
}

export function getCOARNotifySupportPath(): string {
  return getSubPath(COAR_NOTIFY_SUPPORT);
}

export function getAccessibilitySettingsPath() {
  return getSubPath(ACCESSIBILITY_SETTINGS_PATH);
}

//CUSTOMISED
export function getAboutPath() {
  return getSubPath(ABOUT_PATH);
}

export function getAccessibilityStatementPath() {
  return getSubPath(ACCESSIBILITY_STATEMENT_PATH);
}

export function getCopyrightPath() {
  return getSubPath(COPYRIGHT_PATH);
}

export function getOrganisedPath() {
  return getSubPath(ORGANISED_PATH);
}


function getSubPath(path: string) {
  return `${getInfoModulePath()}/${path}`;
}
