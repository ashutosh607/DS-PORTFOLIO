import { CREATIVE_DISCIPLINES } from '../pages/services/data/servicesData.js';

export const WHATSAPP_PHONE_NUMBER = '919029736973';

/**
 * Format a string to Title Case (e.g., "SIGNATURE" -> "Signature")
 */
export const formatTitleCase = (str) => {
  if (!str) return '';
  return str
    .toLowerCase()
    .split(' ')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Format date string (e.g., "2026-10-18" -> "18 October 2026")
 */
export const formatEventDate = (dateStr) => {
  if (!dateStr || typeof dateStr !== 'string' || !dateStr.trim()) {
    return 'Not provided';
  }
  const trimmed = dateStr.trim();
  // Check if it's YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    const [year, month, day] = trimmed.split('-');
    const dateObj = new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10));
    if (!isNaN(dateObj.getTime())) {
      return dateObj.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    }
  }
  return trimmed;
};

/**
 * Get readable collection price
 */
export const getCollectionPrice = (collection) => {
  if (!collection) return 'Custom Quote';
  if (collection.price && collection.price !== '[PRICE TO BE ADDED]') {
    return collection.price;
  }
  if (collection.numericPrice) {
    return `$${collection.numericPrice.toLocaleString()}`;
  }
  return collection.price || 'Custom Quote';
};

/**
 * Map selected discipline IDs to human readable names
 */
export const formatDisciplines = (disciplines = []) => {
  if (!disciplines || disciplines.length === 0) {
    return '• Not provided';
  }

  const disciplineMap = {
    'fine-art-photo': 'Fine-Art Photography',
    'cinematography': 'Cinematography (Super 8 / 4K)',
    'drone-aerial': 'Drone & Aerial Landscapes',
    'archival-album': 'Archival Fine-Art Album',
  };

  const formatted = disciplines.map((id) => {
    if (disciplineMap[id]) return disciplineMap[id];
    const found = CREATIVE_DISCIPLINES?.find((d) => d.id === id);
    return found ? found.title : id;
  });

  return formatted.map((item) => `• ${item}`).join('\n');
};

/**
 * Build clean, professional WhatsApp message
 */
export const buildWhatsAppMessage = ({ formData = {}, selectedCollection = null }) => {
  // Client details
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

  // Event details
  const eventType = formData.eventType?.trim() || 'Not provided';
  const eventDate = formatEventDate(formData.eventDate);
  const duration = formData.duration?.trim() || 'Not provided';
  const location = formData.location?.trim() || 'Not provided';

  // Google Maps link
  let mapsLink = '';
  if (formData.coordinates?.lat && formData.coordinates?.lng) {
    mapsLink = `https://www.google.com/maps/search/?api=1&query=${formData.coordinates.lat},${formData.coordinates.lng}`;
  } else if (formData.location && formData.location.trim()) {
    mapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(formData.location.trim())}`;
  }

  // Selected collection
  const rawCollectionTitle = selectedCollection?.title || 'Signature';
  const collectionName = formatTitleCase(rawCollectionTitle);
  const price = getCollectionPrice(selectedCollection);

  // Selected services / disciplines
  const currentDisciplines = formData.disciplines || ['fine-art-photo', 'archival-album'];
  const servicesList = formatDisciplines(currentDisciplines);

  // Additional details
  const budget = formData.budget?.trim() || 'Not provided';
  const visionNotes = formData.message?.trim() || 'Not provided';
  const source = formData.source?.trim() || 'Not provided';

  return `Hello! I'd like to make an inquiry with DS Photography & Films.

━━━━━━━━━━━━━━━━
CLIENT DETAILS
━━━━━━━━━━━━━━━━

Name: ${name}
Email: ${email}
Phone / WhatsApp: ${phone}

━━━━━━━━━━━━━━━━
EVENT DETAILS
━━━━━━━━━━━━━━━━

Event: ${eventType}
Date: ${eventDate}
Duration: ${duration}
Location: ${location}${mapsLink ? `\nGoogle Maps: ${mapsLink}` : ''}

━━━━━━━━━━━━━━━━
SELECTED COLLECTION
━━━━━━━━━━━━━━━━

Collection: ${collectionName}
Investment: ${price}

Services:
${servicesList}

━━━━━━━━━━━━━━━━
ADDITIONAL DETAILS
━━━━━━━━━━━━━━━━

Budget: ${budget}

Vision / Notes:
${visionNotes}

Found us through: ${source}

Thank you!`;
};

/**
 * Generate wa.me link with encoded message
 */
export const getWhatsAppUrl = (message, phoneNumber = WHATSAPP_PHONE_NUMBER) => {
  const cleanNumber = phoneNumber.replace(/[^0-9]/g, '');
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
};

/**
 * Open WhatsApp directly in new tab/window
 */
export const handleWhatsAppSubmit = ({ formData, selectedCollection }) => {
  const message = buildWhatsAppMessage({ formData, selectedCollection });
  const url = getWhatsAppUrl(message, WHATSAPP_PHONE_NUMBER);
  window.open(url, '_blank', 'noopener,noreferrer');
  return url;
};
