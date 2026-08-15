import { useEffect, useState, type FormEvent } from 'react';
import { Users, Plus, Phone, Pencil, Trash2, Star, AlertCircle, X } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { supabase, type EmergencyContact } from '@/lib/supabase';
import { Modal } from '@/components/ui/Modal';
import { EmptyState } from '@/components/ui/EmptyState';
import { Spinner } from '@/components/ui/Spinner';
import { useToast } from '@/components/ui/Toast';
import { classNames } from '@/lib/utils';

const RELATIONSHIPS = ['Mother', 'Father', 'Spouse', 'Sibling', 'Friend', 'Partner', 'Other'];

export function EmergencyContactsPage() {
  const { user } = useAuth();
  const { push } = useToast();
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<EmergencyContact | null>(null);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<EmergencyContact | null>(null);

  // form state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [relationship, setRelationship] = useState('Friend');
  const [isPrimary, setIsPrimary] = useState(false);
  const [receivesSos, setReceivesSos] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!user) return;
    supabase
      .from('emergency_contacts')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true })
      .then(({ data, error }) => {
        if (!error && data) setContacts(data as EmergencyContact[]);
        setLoading(false);
      });
  }, [user]);

  const openAdd = () => {
    setEditing(null);
    setName('');
    setPhone('');
    setRelationship('Friend');
    setIsPrimary(false);
    setReceivesSos(true);
    setErrors({});
    setModalOpen(true);
  };

  const openEdit = (contact: EmergencyContact) => {
    setEditing(contact);
    setName(contact.name);
    setPhone(contact.phone);
    setRelationship(contact.relationship);
    setIsPrimary(contact.is_primary);
    setReceivesSos(contact.receives_sos);
    setErrors({});
    setModalOpen(true);
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = 'Name is required.';
    if (!phone.trim()) e.phone = 'Phone number is required.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!user || !validate()) return;
    setSaving(true);

    if (editing) {
      const { data, error } = await supabase
        .from('emergency_contacts')
        .update({
          name: name.trim(),
          phone: phone.trim(),
          relationship,
          is_primary: isPrimary,
          receives_sos: receivesSos,
        })
        .eq('id', editing.id)
        .select('*')
        .maybeSingle();
      if (!error && data) {
        setContacts((c) => c.map((con) => (con.id === editing.id ? data as EmergencyContact : con)));
        push('success', 'Contact updated successfully.');
      } else {
        push('error', 'Failed to update contact.');
      }
    } else {
      const { data, error } = await supabase
        .from('emergency_contacts')
        .insert({
          user_id: user.id,
          name: name.trim(),
          phone: phone.trim(),
          relationship,
          is_primary: isPrimary,
          receives_sos: receivesSos,
        })
        .select('*')
        .maybeSingle();
      if (!error && data) {
        setContacts((c) => [...c, data as EmergencyContact]);
        push('success', 'Emergency contact added.');
      } else {
        push('error', 'Failed to add contact.');
      }
    }

    setSaving(false);
    setModalOpen(false);
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    const { error } = await supabase.from('emergency_contacts').delete().eq('id', confirmDelete.id);
    if (!error) {
      setContacts((c) => c.filter((con) => con.id !== confirmDelete.id));
      push('success', 'Contact removed.');
    } else {
      push('error', 'Failed to delete contact.');
    }
    setConfirmDelete(null);
  };

  const toggleReceivesSos = async (contact: EmergencyContact) => {
    const newValue = !contact.receives_sos;
    setContacts((c) => c.map((con) => (con.id === contact.id ? { ...con, receives_sos: newValue } : con)));
    const { error } = await supabase
      .from('emergency_contacts')
      .update({ receives_sos: newValue })
      .eq('id', contact.id);
    if (error) {
      setContacts((c) => c.map((con) => (con.id === contact.id ? { ...con, receives_sos: !newValue } : con)));
      push('error', 'Failed to update alert preference.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size={28} className="text-primary-600" />
      </div>
    );
  }

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8 max-w-3xl mx-auto pb-24 lg:pb-8">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
              <Users size={22} className="text-primary-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Emergency Contacts</h2>
              <p className="text-sm text-gray-500">{contacts.length} saved</p>
            </div>
          </div>
          <button onClick={openAdd} className="btn btn-primary px-4 py-2.5 text-sm">
            <Plus size={18} /> Add
          </button>
        </div>
        <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl bg-primary-50 border border-primary-100">
          <AlertCircle size={18} className="text-primary-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-primary-800">
            Your selected emergency contacts can be notified when you activate SOS.
          </p>
        </div>
      </div>

      {contacts.length === 0 ? (
        <EmptyState
          icon={<Users size={28} />}
          title="No emergency contacts yet"
          description="Add trusted people who will be notified when you activate SOS."
          action={
            <button onClick={openAdd} className="btn btn-primary">
              <Plus size={18} /> Add Contact
            </button>
          }
        />
      ) : (
        <div className="space-y-3">
          {contacts.map((contact) => (
            <div key={contact.id} className="card p-4 animate-fade-in">
              <div className="flex items-center gap-3 mb-3">
                <div className="relative flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-primary-100 text-primary-700 font-bold flex items-center justify-center">
                    {contact.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                  {contact.is_primary && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-warning-400 flex items-center justify-center border-2 border-white">
                      <Star size={10} className="text-white fill-white" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-gray-900 truncate">{contact.name}</p>
                    {contact.is_primary && (
                      <span className="badge bg-warning-100 text-warning-700">Primary</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">{contact.relationship}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-3">
                <Phone size={16} className="text-gray-400" />
                <a href={`tel:${contact.phone}`} className="text-sm text-gray-700 hover:text-primary-700 transition-colors">
                  {contact.phone}
                </a>
              </div>

              <div className="flex items-center justify-between gap-2 pt-3 border-t border-gray-100">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <button
                    onClick={() => toggleReceivesSos(contact)}
                    className={classNames(
                      'relative w-10 h-5.5 rounded-full transition-colors',
                      contact.receives_sos ? 'bg-success-500' : 'bg-gray-300'
                    )}
                    style={{ height: 22, width: 40 }}
                    aria-label="Toggle SOS alerts"
                  >
                    <span
                      className={classNames(
                        'absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform',
                        contact.receives_sos ? 'translate-x-5' : 'translate-x-0.5'
                      )}
                    />
                  </button>
                  <span className="text-xs font-medium text-gray-600">Receives SOS alerts</span>
                </label>
                <div className="flex items-center gap-1">
                  <a
                    href={`tel:${contact.phone}`}
                    className="p-2 rounded-lg bg-success-50 text-success-700 hover:bg-success-100 transition-colors"
                    aria-label="Call"
                  >
                    <Phone size={16} />
                  </a>
                  <button
                    onClick={() => openEdit(contact)}
                    className="p-2 rounded-lg bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors"
                    aria-label="Edit"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => setConfirmDelete(contact)}
                    className="p-2 rounded-lg bg-emergency-50 text-emergency-600 hover:bg-emergency-100 transition-colors"
                    aria-label="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Contact' : 'Add Emergency Contact'}>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="label" htmlFor="contactName">Name</label>
            <input
              id="contactName"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input"
              placeholder="Contact name"
            />
            {errors.name && <p className="text-xs text-emergency-600 mt-1">{errors.name}</p>}
          </div>
          <div>
            <label className="label" htmlFor="contactPhone">Phone number</label>
            <input
              id="contactPhone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="input"
              placeholder="+1 555 000 0000"
            />
            {errors.phone && <p className="text-xs text-emergency-600 mt-1">{errors.phone}</p>}
          </div>
          <div>
            <label className="label" htmlFor="contactRel">Relationship</label>
            <select
              id="contactRel"
              value={relationship}
              onChange={(e) => setRelationship(e.target.value)}
              className="input"
            >
              {RELATIONSHIPS.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
          <div className="space-y-3 pt-2">
            <label className="flex items-center justify-between cursor-pointer select-none">
              <div>
                <p className="text-sm font-medium text-gray-700">Primary emergency contact</p>
                <p className="text-xs text-gray-500">Called first during SOS</p>
              </div>
              <button
                type="button"
                onClick={() => setIsPrimary(!isPrimary)}
                className={classNames(
                  'relative rounded-full transition-colors',
                  isPrimary ? 'bg-warning-400' : 'bg-gray-300'
                )}
                style={{ height: 22, width: 40 }}
              >
                <span
                  className={classNames(
                    'absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform',
                    isPrimary ? 'translate-x-5' : 'translate-x-0.5'
                  )}
                />
              </button>
            </label>
            <label className="flex items-center justify-between cursor-pointer select-none">
              <div>
                <p className="text-sm font-medium text-gray-700">Receives SOS alerts</p>
                <p className="text-xs text-gray-500">Notified when SOS is activated</p>
              </div>
              <button
                type="button"
                onClick={() => setReceivesSos(!receivesSos)}
                className={classNames(
                  'relative rounded-full transition-colors',
                  receivesSos ? 'bg-success-500' : 'bg-gray-300'
                )}
                style={{ height: 22, width: 40 }}
              >
                <span
                  className={classNames(
                    'absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform',
                    receivesSos ? 'translate-x-5' : 'translate-x-0.5'
                  )}
                />
              </button>
            </label>
          </div>
          <button type="submit" disabled={saving} className="btn btn-primary btn-lg w-full">
            {saving ? <Spinner size={20} /> : null}
            {saving ? 'Saving...' : editing ? 'Update Contact' : 'Add Contact'}
          </button>
        </form>
      </Modal>

      {/* Delete confirmation */}
      <Modal open={!!confirmDelete} onClose={() => setConfirmDelete(null)} title="Remove Contact" size="sm">
        <div>
          <p className="text-sm text-gray-600 mb-5">
            Are you sure you want to remove <span className="font-semibold text-gray-900">{confirmDelete?.name}</span> from your emergency contacts?
          </p>
          <div className="flex gap-2">
            <button onClick={() => setConfirmDelete(null)} className="btn btn-outline flex-1">
              Cancel
            </button>
            <button onClick={handleDelete} className="btn btn-danger flex-1">
              <Trash2 size={18} /> Remove
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
