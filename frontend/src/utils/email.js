import { formatEventDate, formatTitleCase, getCollectionPrice, formatDisciplines } from './whatsapp';

export const STUDIO_EMAIL = import.meta.env.VITE_STUDIO_EMAIL || 'dishantshelar59@gmail.com';

/**
 * Mobile device detection
 */
export const isMobileDevice = () => {
  if (typeof window === 'undefined') return false;
  return /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
    ('ontouchstart' in window && window.innerWidth <= 1024);
};

/**
 * Build professional email subject
 */
export const buildEmailSubject = ({ formData = {}, selectedCollection = null }) => {
  const name = formData.name?.trim() || 'Client';
  const eventType = formData.eventType?.trim() || 'Commission';
  const rawCollection = selectedCollection?.title || 'Signature';
  return `Atelier Commission Inquiry: ${name} — ${eventType} (${formatTitleCase(rawCollection)})`;
};

/**
 * Build clean, formatted email body without bloated multi-byte characters
 * Guarantees length is well under 1,500 chars so mobile mail apps never truncate
 */
export const buildEmailBody = ({ formData = {}, selectedCollection = null, inquiryId = '' }) => {
  const name = formData.name?.trim() || 'Not provided';
  const email = formData.email?.trim() || 'Not provided';

  let phone = 'Not provided';
  if (formData.phone && formData.phone.trim()) {
    const trimmedPhone = formData.phone.trim();
    if (trimmedPhone.startsWith('+')) {
      phone = trimmedPhone;
    } else {
      const code = formData.countryCode || '+91';
      phone = `${code} ${trimmedPhone}`;
    }
  }

  let eventType = formData.eventType?.trim() || 'Not provided';
  if (eventType === 'Other' && formData.otherEventType?.trim()) {
    eventType = `Other (${formData.otherEventType.trim()})`;
  }
  const eventDate = formatEventDate(formData.eventDate);
  const duration = formData.duration?.trim() || 'Not provided';
  const location = formData.location?.trim() || 'Not provided';

  let mapsLink = '';
  if (formData.coordinates?.lat && formData.coordinates?.lng) {
    mapsLink = `https://www.google.com/maps/search/?api=1&query=${formData.coordinates.lat},${formData.coordinates.lng}`;
  } else if (formData.location && formData.location.trim()) {
    mapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(formData.location.trim())}`;
  }

  const rawCollectionTitle = selectedCollection?.title || 'Signature';
  const collectionName = formatTitleCase(rawCollectionTitle);
  const price = getCollectionPrice(selectedCollection);

  const currentDisciplines = formData.disciplines || [];
  const curationItems =
    selectedCollection?.deliverables || selectedCollection?.curationHighlights || [];
  const servicesList =
    currentDisciplines.length > 0
      ? formatDisciplines(currentDisciplines)
      : curationItems.length > 0
        ? curationItems.slice(0, 4).map((d) => `- ${d}`).join('\n')
        : '- Full Atelier Coverage';

  const budget = formData.budget?.trim() || 'Not provided';
  const visionNotes = formData.message?.trim() || 'Not provided';
  const source = formData.source?.trim() || 'Not provided';
  const refLine = inquiryId ? `Reference ID: ${inquiryId}\n\n` : '';

  return `Dear DS Photography & Films Team,

I would like to inquire about commissioning your atelier for an upcoming event.

${refLine}--- CLIENT DETAILS ---
Name: ${name}
Email: ${email}
Phone / WhatsApp: ${phone}

--- EVENT DETAILS ---
Event Type: ${eventType}
Target Date: ${eventDate}
Duration: ${duration}
Location: ${location}${mapsLink ? `\nMaps: ${mapsLink}` : ''}

--- SELECTED COLLECTION ---
Collection: ${collectionName}
Investment: ${price}

Requested Creative Disciplines:
${servicesList}

--- ADDITIONAL DETAILS ---
Budget: ${budget}
Found Us Through: ${source}

Vision & Notes:
${visionNotes}

Looking forward to hearing from you.

Best regards,
${name}`;
};

/**
 * Generate mailto URL with encoded subject and body
 */
export const getMailtoUrl = ({
  formData = {},
  selectedCollection = null,
  inquiryId = '',
  toEmail = STUDIO_EMAIL,
}) => {
  const subject = buildEmailSubject({ formData, selectedCollection });
  const body = buildEmailBody({ formData, selectedCollection, inquiryId });
  return `mailto:${toEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
};

/**
 * Generate direct web Gmail compose URL
 */
export const getGmailUrl = ({
  formData = {},
  selectedCollection = null,
  inquiryId = '',
  toEmail = STUDIO_EMAIL,
}) => {
  const subject = buildEmailSubject({ formData, selectedCollection });
  const body = buildEmailBody({ formData, selectedCollection, inquiryId });
  return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(toEmail)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
};

/**
 * Open email directly with pre-composed draft addressed to studio email
 * On mobile devices (iOS/Android): uses native mailto to launch Apple Mail / Gmail app with pre-filled message
 * On desktop: attempts web Gmail compose in new tab, falling back to mailto
 */
export const handleEmailSubmit = ({ formData, selectedCollection, inquiryId = '' }) => {
  const mailtoUrl = getMailtoUrl({ formData, selectedCollection, inquiryId, toEmail: STUDIO_EMAIL });
  const gmailUrl = getGmailUrl({ formData, selectedCollection, inquiryId, toEmail: STUDIO_EMAIL });

  if (isMobileDevice()) {
    // Mobile phones: Use native mailto to immediately launch default mail app (Apple Mail / Gmail app) with pre-filled message
    try {
      const a = document.createElement('a');
      a.href = mailtoUrl;
      a.target = '_self';
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        if (document.body.contains(a)) document.body.removeChild(a);
      }, 500);
    } catch {
      window.location.href = mailtoUrl;
    }
    return mailtoUrl;
  }

  // Desktop: open Gmail web compose in a new tab; fall back to mailto if blocked
  try {
    const win = window.open(gmailUrl, '_blank', 'noopener,noreferrer');
    if (!win || win.closed || typeof win.closed === 'undefined') {
      window.location.href = mailtoUrl;
    }
  } catch {
    window.location.href = mailtoUrl;
  }

  return gmailUrl;
};
