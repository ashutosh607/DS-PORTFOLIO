import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Upload, Image as ImageIcon, Type, PenLine, 
  Quote, Camera, MapPin, Link2, ArrowRight
} from 'lucide-react';
import { updateCategory } from '../../../utils/categoryManager';
import { useAdminAuth } from '../context/AdminAuthContext';
import { optimizeImageFile } from '../../../utils/imageOptimizer';
import '../AdminDashboard.css';

/* ── Inline style objects (guarantees spacing regardless of Tailwind) ── */
const styles = {
  overlay: {
    position: 'fixed', inset: 0, zIndex: 50,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: 24,
    backgroundColor: 'rgba(0,0,0,0.4)',
    backdropFilter: 'blur(4px)',
    overflowY: 'auto',
  },
  modal: {
    width: '100%', maxWidth: 580,
    backgroundColor: '#fff',
    borderRadius: 20,
    border: '1px solid #E8E2D8',
    boxShadow: '0 25px 60px rgba(0,0,0,0.15)',
    overflow: 'hidden',
    margin: '24px 0',
  },
  header: {
    display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
    padding: '28px 32px 16px 32px',
  },
  closeBtn: {
    width: 36, height: 36, borderRadius: '50%', border: 'none',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'transparent', color: '#8E887E', cursor: 'pointer',
    flexShrink: 0, marginLeft: 12, transition: 'all 0.2s',
  },
  formBody: {
    padding: '0 32px 28px 32px',
  },
  label: {
    display: 'block', fontSize: 10.5, fontWeight: 700,
    color: '#44403C', textTransform: 'uppercase',
    letterSpacing: '0.1em', marginBottom: 8,
  },
  inputRow: {
    display: 'flex', alignItems: 'center',
    width: '100%', height: 48, borderRadius: 12,
    border: '1px solid #E0DAD0', backgroundColor: '#F7F5F1',
    padding: '0 16px', gap: 14, transition: 'all 0.2s',
  },
  iconBadge: {
    width: 32, height: 32, borderRadius: 8,
    backgroundColor: '#EBE6DD', display: 'flex',
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0, color: '#6B6560',
  },
  input: {
    flex: 1, minWidth: 0, height: '100%',
    background: 'transparent', border: 'none', outline: 'none',
    fontSize: 13, color: '#1C1917', fontFamily: 'inherit',
  },
  fieldGap: { marginBottom: 18 },
  twoCol: {
    display: 'grid', gridTemplateColumns: '1fr 1fr',
    gap: 20, marginBottom: 18,
  },
  footer: {
    display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
    gap: 12, paddingTop: 18, borderTop: '1px solid #EBE6DD',
  },
  cancelBtn: {
    padding: '0 20px', height: 40, borderRadius: 10,
    border: 'none', background: 'transparent',
    fontSize: 13, fontWeight: 500, color: '#5C5852',
    cursor: 'pointer', transition: 'all 0.2s',
  },
  submitBtn: {
    padding: '0 22px', height: 40, borderRadius: 10,
    border: 'none', backgroundColor: '#1C1917',
    fontSize: 13, fontWeight: 500, color: '#fff',
    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
    transition: 'all 0.2s',
  },
  uploadArea: {
    border: '2px dashed #DDD8CD', borderRadius: 14,
    textAlign: 'center', cursor: 'pointer',
    padding: '32px 24px', backgroundColor: 'rgba(250,248,245,0.6)',
    transition: 'all 0.2s',
  },
  uploadAreaWithPreview: {
    border: '2px dashed #C5BFAF', borderRadius: 14,
    textAlign: 'center', cursor: 'pointer',
    padding: 16, backgroundColor: '#FAF8F5',
    transition: 'all 0.2s',
  },
};

export default function EditCategoryModal({ isOpen, onClose, onSuccess, category }) {
  const { getAuthHeaders } = useAdminAuth();

  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [quote, setQuote] = useState('');
  const [medium, setMedium] = useState('');
  const [location, setLocation] = useState('');
  
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState('');
  const [directCoverUrl, setDirectCoverUrl] = useState('');
  const [useDirectUrl, setUseDirectUrl] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (category) {
      setName(category.name || '');
      setTagline(category.tagline || '');
      setQuote(category.quote || '');
      setMedium(category.medium || '');
      setLocation(category.location || '');
      setCoverPreview(category.coverImage || category.featured?.image || '');
      setDirectCoverUrl(category.coverImage || '');
      setCoverFile(null); setUseDirectUrl(false); setError('');
    }
  }, [category, isOpen]);

  if (!isOpen || !category) return null;

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (JPG, PNG, WEBP).'); return;
    }
    setCoverFile(file); setError('');
    const reader = new FileReader();
    reader.onload = (ev) => setCoverPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setError('');
    if (!name.trim()) { setError('Category title cannot be empty.'); return; }
    const effectiveCover = coverFile ? coverPreview : (useDirectUrl ? directCoverUrl.trim() : coverPreview);
    if (!effectiveCover) { setError('Category cover photo is required.'); return; }
    setSubmitting(true);
    try {
      let payload;
      if (coverFile) {
        let uploadCover = coverFile;
        if (coverFile.type?.startsWith('image/')) {
          uploadCover = await optimizeImageFile(coverFile);
        }
        payload = new FormData();
        payload.append('name', name.trim());
        payload.append('coverFile', uploadCover);
        payload.append('tagline', tagline.trim());
        payload.append('quote', quote.trim());
        payload.append('medium', medium.trim());
        payload.append('location', location.trim());
      } else {
        payload = {
          name: name.trim(),
          coverImage: useDirectUrl ? directCoverUrl.trim() : coverPreview,
          tagline: tagline.trim(), quote: quote.trim(),
          medium: medium.trim(), location: location.trim(),
        };
      }
      const targetCatId = category.slug || category._id || category.id;
      const updated = await updateCategory(targetCatId, payload, getAuthHeaders());
      if (onSuccess) onSuccess(updated);
      onClose();
    } catch (err) {
      console.error('Failed to update category:', err);
      setError(err.message || 'Failed to update category.');
    } finally { setSubmitting(false); }
  };

  /* ── Reusable input field ── */
  const InputField = ({ icon: Icon, placeholder, value, onChange, type = 'text', required = false }) => (
    <div
      style={styles.inputRow}
      onFocus={(e) => { e.currentTarget.style.backgroundColor = '#fff'; e.currentTarget.style.borderColor = '#1C1917'; }}
      onBlur={(e) => { e.currentTarget.style.backgroundColor = '#F7F5F1'; e.currentTarget.style.borderColor = '#E0DAD0'; }}
    >
      <div style={styles.iconBadge}>
        <Icon size={14} />
      </div>
      <input
        type={type} placeholder={placeholder}
        value={value} onChange={onChange} required={required}
        style={styles.input}
      />
    </div>
  );

  return (
    <div style={styles.overlay} onClick={(e) => { if (e.target === e.currentTarget && !submitting) onClose(); }}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>

        {/* ─── Header ─── */}
        <div style={styles.header}>
          <div>
            <div style={{ fontSize: 10, letterSpacing: '0.2em', color: '#8E887E', textTransform: 'uppercase', fontWeight: 600, marginBottom: 4 }}>
              EDIT COLLECTION
            </div>
            <h3 style={{ fontSize: 26, color: '#1C1917', fontWeight: 400, lineHeight: 1.2, margin: 0, fontFamily: "'Playfair Display', Georgia, serif" }}>
              Edit Category
            </h3>
            <p style={{ fontSize: 13, color: '#8E887E', marginTop: 6, marginBottom: 0 }}>
              Update category settings, editorial notes, and cover artwork.
            </p>
          </div>
          <button
            type="button" onClick={onClose} disabled={submitting}
            style={styles.closeBtn}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#F0EBE3'; e.currentTarget.style.color = '#1C1917'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#8E887E'; }}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* ─── Form ─── */}
        <form onSubmit={handleSubmit} style={styles.formBody}>

          {error && (
            <div style={{ marginBottom: 16, padding: 12, backgroundColor: '#FEF2F2', border: '1px solid #FECACA', color: '#B91C1C', fontSize: 12, borderRadius: 10 }}>
              {error}
            </div>
          )}

          {/* ── 1. Cover Photo ── */}
          <div style={styles.fieldGap}>
            {!useDirectUrl ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                style={coverPreview ? styles.uploadAreaWithPreview : styles.uploadArea}
                onMouseEnter={(e) => { if (!coverPreview) e.currentTarget.style.borderColor = '#AAA49A'; }}
                onMouseLeave={(e) => { if (!coverPreview) e.currentTarget.style.borderColor = '#DDD8CD'; }}
              >
                <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={handleFileChange} style={{ display: 'none' }} />

                {coverPreview ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: '100%', height: 160, borderRadius: 10, overflow: 'hidden', border: '1px solid #E8E2D6' }}>
                      <img src={coverPreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    </div>
                    <span style={{ fontSize: 12, color: '#5C5852', fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                      <Upload size={12} /> Click to replace photo
                    </span>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: '#EBE6DD', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B6560', marginBottom: 12 }}>
                      <ImageIcon size={18} strokeWidth={1.5} />
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#1C1917' }}>Upload Category Cover Photo</span>
                    <span style={{ fontSize: 11, color: '#8E887E', marginTop: 4 }}>JPG, PNG, or WEBP&nbsp;&nbsp;(featured on public collection ribbon)</span>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <InputField icon={Link2} placeholder="https://..." value={directCoverUrl} onChange={(e) => setDirectCoverUrl(e.target.value)} type="url" />
                {directCoverUrl && (
                  <div style={{ marginTop: 12, height: 140, borderRadius: 10, overflow: 'hidden', border: '1px solid #E8E2D6' }}>
                    <img src={directCoverUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={() => setError('Invalid image URL')} />
                  </div>
                )}
              </div>
            )}

            <button
              type="button" onClick={() => setUseDirectUrl(!useDirectUrl)}
              style={{ marginTop: 10, fontSize: 11.5, color: '#7A756D', background: 'none', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, padding: 0 }}
            >
              <Link2 size={11} />
              <span style={{ textDecoration: 'underline', textUnderlineOffset: 2 }}>
                {useDirectUrl ? 'Upload photo file instead' : 'Or paste a direct image URL →'}
              </span>
            </button>
          </div>

          {/* ── 2. Category Title ── */}
          <div style={styles.fieldGap}>
            <label style={styles.label}>Category Title <span style={{ color: '#EF4444' }}>*</span></label>
            <InputField icon={Type} value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

          {/* ── 3. Tagline ── */}
          <div style={styles.fieldGap}>
            <label style={styles.label}>Tagline (Short Summary)</label>
            <InputField icon={PenLine} placeholder="e.g. Intimate moments and joyous new beginnings." value={tagline} onChange={(e) => setTagline(e.target.value)} />
          </div>

          {/* ── 4. Quote ── */}
          <div style={styles.fieldGap}>
            <label style={styles.label}>Quote / Editorial Note</label>
            <InputField icon={Quote} placeholder="e.g. Life celebrated in every quiet frame." value={quote} onChange={(e) => setQuote(e.target.value)} />
          </div>

          {/* ── 5. Medium + Location ── */}
          <div style={{ ...styles.twoCol, marginBottom: 24 }}>
            <div>
              <label style={styles.label}>Medium / Gear (Optional)</label>
              <InputField icon={Camera} placeholder="e.g. Leica M11 · 35mm Summilux" value={medium} onChange={(e) => setMedium(e.target.value)} />
            </div>
            <div>
              <label style={styles.label}>Location (Optional)</label>
              <InputField icon={MapPin} placeholder="e.g. Mumbai & Private Studios" value={location} onChange={(e) => setLocation(e.target.value)} />
            </div>
          </div>

          {/* ── Footer ── */}
          <div style={styles.footer}>
            <button
              type="button" onClick={onClose} disabled={submitting}
              style={styles.cancelBtn}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#F0EBE3'; e.currentTarget.style.color = '#1C1917'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#5C5852'; }}
            >
              Cancel
            </button>
            <button type="submit" disabled={submitting} style={{ ...styles.submitBtn, opacity: submitting ? 0.5 : 1 }}>
              {submitting ? (
                <>
                  <span style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.6s linear infinite', display: 'inline-block' }} />
                  <span>Saving…</span>
                </>
              ) : (
                <>
                  <span>Save Changes</span>
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
