import { useState, type FormEvent } from 'react';
import { FileWarning, MapPin, Camera, CheckCircle2, AlertCircle, ArrowLeft, Calendar } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { supabase, type IncidentType } from '@/lib/supabase';
import { Spinner } from '@/components/ui/Spinner';
import { useToast } from '@/components/ui/Toast';
import { classNames, formatDateTime } from '@/lib/utils';

const INCIDENT_TYPES: { id: IncidentType; label: string; icon: string }[] = [
  { id: 'harassment', label: 'Harassment', icon: '⚠️' },
  { id: 'suspicious', label: 'Suspicious Activity', icon: '👁' },
  { id: 'unsafe_area', label: 'Unsafe Area', icon: '🚨' },
  { id: 'stalking', label: 'Stalking', icon: '👁‍🗨' },
  { id: 'other', label: 'Other', icon: '📋' },
];

export function ReportIncidentPage() {
  const { user } = useAuth();
  const { push } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [type, setType] = useState<IncidentType>('harassment');
  const [dateTime, setDateTime] = useState(new Date().toISOString().slice(0, 16));
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [fileName, setFileName] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    const fieldErrors: Record<string, string> = {};
    if (!description.trim()) fieldErrors.description = 'Please describe the incident.';
    if (!location.trim()) fieldErrors.location = 'Please enter the location.';
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length > 0) return;

    setSubmitting(true);
    const { error: insertError } = await supabase.from('incidents').insert({
      user_id: user!.id,
      incident_type: type,
      description: description.trim(),
      location_text: location.trim(),
      image_path: fileName,
    });
    setSubmitting(false);

    if (insertError) {
      setError('Failed to submit report. Please try again.');
      return;
    }
    push('success', 'Your report has been submitted.');
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="px-4 py-6 sm:px-6 sm:py-8 max-w-2xl mx-auto pb-24 lg:pb-8">
        <div className="card p-8 flex flex-col items-center text-center animate-scale-in">
          <div className="w-20 h-20 rounded-full bg-success-100 flex items-center justify-center mb-4">
            <CheckCircle2 size={44} className="text-success-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Your report has been submitted.</h2>
          <p className="text-sm text-gray-500 mb-1 max-w-sm">
            Thank you for reporting. Your report is private and will be reviewed. Reports help improve community safety awareness.
          </p>
          <p className="text-xs text-gray-400 mb-6">Submitted on {formatDateTime(new Date())}</p>
          <button
            onClick={() => {
              setSubmitted(false);
              setType('harassment');
              setLocation('');
              setDescription('');
              setFileName(null);
              setDateTime(new Date().toISOString().slice(0, 16));
            }}
            className="btn btn-outline"
          >
            <ArrowLeft size={18} /> Report Another Incident
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8 max-w-2xl mx-auto pb-24 lg:pb-8 space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-emergency-50 flex items-center justify-center">
          <FileWarning size={22} className="text-emergency-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Report Incident</h2>
          <p className="text-sm text-gray-500">Report a safety concern</p>
        </div>
      </div>

      <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl bg-gray-50 border border-gray-100">
        <AlertCircle size={18} className="text-gray-500 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-gray-600">
          Your reports are private and not shared publicly. Reports help improve safety awareness in your area.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="card p-5 space-y-5">
        {error && (
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-emergency-50 border border-emergency-200 text-emergency-800 text-sm font-medium">
            <AlertCircle size={18} className="text-emergency-600 flex-shrink-0" />
            {error}
          </div>
        )}

        {/* Incident type */}
        <div>
          <label className="label">Incident type</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {INCIDENT_TYPES.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setType(t.id)}
                className={classNames(
                  'flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left',
                  type === t.id
                    ? 'bg-primary-700 text-white shadow-sm'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                )}
              >
                <span className="text-base">{t.icon}</span>
                <span className="flex-1">{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Date/time */}
        <div>
          <label className="label" htmlFor="dateTime">Date & time</label>
          <div className="relative">
            <Calendar size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              id="dateTime"
              type="datetime-local"
              value={dateTime}
              onChange={(e) => setDateTime(e.target.value)}
              className="input pl-11"
            />
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="label" htmlFor="location">Location</label>
          <div className="relative">
            <MapPin size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              id="location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="input pl-11"
              placeholder="Where did this happen?"
            />
          </div>
          {errors.location && <p className="text-xs text-emergency-600 mt-1">{errors.location}</p>}
        </div>

        {/* Description */}
        <div>
          <label className="label" htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="input min-h-[100px] resize-y"
            placeholder="Describe what happened..."
          />
          {errors.description && <p className="text-xs text-emergency-600 mt-1">{errors.description}</p>}
        </div>

        {/* File attachment */}
        <div>
          <label className="label">Image / file attachment (optional)</label>
          <label className="flex flex-col items-center justify-center gap-2 px-4 py-6 rounded-xl border-2 border-dashed border-gray-200 cursor-pointer hover:border-primary-300 hover:bg-primary-50/30 transition-colors">
            <Camera size={24} className="text-gray-400" />
            <span className="text-sm text-gray-500">
              {fileName ? fileName : 'Tap to attach an image or file'}
            </span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setFileName(file.name);
              }}
            />
          </label>
        </div>

        <button type="submit" disabled={submitting} className="btn btn-primary btn-lg w-full">
          {submitting ? <Spinner size={20} /> : <FileWarning size={20} />}
          {submitting ? 'Submitting...' : 'Submit Report'}
        </button>
      </form>
    </div>
  );
}
