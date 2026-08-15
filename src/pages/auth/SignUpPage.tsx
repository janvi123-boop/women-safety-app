import { useState, type FormEvent } from 'react';
import { Shield, Mail, Lock, Eye, EyeOff, UserPlus, AlertCircle, User, Phone, Check } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { Spinner } from '@/components/ui/Spinner';

type SignUpProps = {
  onSwitchToLogin: () => void;
  onComplete: () => void;
};

export function SignUpPage({ onSwitchToLogin, onComplete }: SignUpProps) {
  const { signUp } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emergencyContactName, setEmergencyContactName] = useState('');
  const [emergencyContactPhone, setEmergencyContactPhone] = useState('');
  const [agree, setAgree] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!fullName.trim()) errors.fullName = 'Please enter your full name.';
    if (!email.trim()) errors.email = 'Please enter your email.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Please enter a valid email address.';
    if (!phone.trim()) errors.phone = 'Please enter your phone number.';
    if (!password) errors.password = 'Please enter a password.';
    else if (password.length < 6) errors.password = 'Password must be at least 6 characters.';
    if (password !== confirmPassword) errors.confirmPassword = 'Passwords do not match.';
    if (!agree) errors.agree = 'You must agree to the Terms and Privacy Policy.';
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!validate()) return;
    setLoading(true);
    const { error: authError } = await signUp(email.trim(), password, fullName.trim(), phone.trim());
    if (authError) {
      setError(authError);
      setLoading(false);
      return;
    }
    onComplete();
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="flex-1 flex flex-col justify-center px-6 py-12 max-w-md w-full mx-auto">
        <div className="flex flex-col items-center mb-8 animate-fade-in">
          <div className="w-16 h-16 rounded-2xl bg-primary-700 flex items-center justify-center shadow-lg mb-4">
            <Shield size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
          <p className="text-sm text-gray-500 mt-1">Stay safe and connected</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 animate-slide-up">
          {error && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-emergency-50 border border-emergency-200 text-emergency-800 text-sm font-medium">
              <AlertCircle size={18} className="text-emergency-600 flex-shrink-0" />
              {error}
            </div>
          )}

          <div>
            <label className="label" htmlFor="fullName">Full name</label>
            <div className="relative">
              <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="input pl-11"
                placeholder="Jane Doe"
              />
            </div>
            {fieldErrors.fullName && <p className="text-xs text-emergency-600 mt-1">{fieldErrors.fullName}</p>}
          </div>

          <div>
            <label className="label" htmlFor="email">Email</label>
            <div className="relative">
              <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input pl-11"
                placeholder="you@example.com"
              />
            </div>
            {fieldErrors.email && <p className="text-xs text-emergency-600 mt-1">{fieldErrors.email}</p>}
          </div>

          <div>
            <label className="label" htmlFor="phone">Phone number</label>
            <div className="relative">
              <Phone size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="input pl-11"
                placeholder="+1 555 000 0000"
              />
            </div>
            {fieldErrors.phone && <p className="text-xs text-emergency-600 mt-1">{fieldErrors.phone}</p>}
          </div>

          <div>
            <label className="label" htmlFor="password">Password</label>
            <div className="relative">
              <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input pl-11 pr-11"
                placeholder="At least 6 characters"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {fieldErrors.password && <p className="text-xs text-emergency-600 mt-1">{fieldErrors.password}</p>}
          </div>

          <div>
            <label className="label" htmlFor="confirmPassword">Confirm password</label>
            <div className="relative">
              <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                id="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input pl-11"
                placeholder="Re-enter your password"
              />
            </div>
            {fieldErrors.confirmPassword && <p className="text-xs text-emergency-600 mt-1">{fieldErrors.confirmPassword}</p>}
          </div>

          <div className="pt-2 border-t border-gray-100">
            <p className="label">Emergency contact (optional)</p>
            <p className="text-xs text-gray-500 mb-3">Add someone you trust to be notified during emergencies. You can add more later.</p>
            <div className="space-y-3">
              <div className="relative">
                <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={emergencyContactName}
                  onChange={(e) => setEmergencyContactName(e.target.value)}
                  className="input pl-11"
                  placeholder="Contact name"
                />
              </div>
              <div className="relative">
                <Phone size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="tel"
                  value={emergencyContactPhone}
                  onChange={(e) => setEmergencyContactPhone(e.target.value)}
                  className="input pl-11"
                  placeholder="Contact phone number"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="flex items-start gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                className="w-4 h-4 mt-0.5 rounded border-gray-300 text-primary-600 focus:ring-primary-500 flex-shrink-0"
              />
              <span className="text-sm text-gray-600">
                I agree to the <span className="font-medium text-primary-700">Terms of Service</span> and{' '}
                <span className="font-medium text-primary-700">Privacy Policy</span>.
              </span>
            </label>
            {fieldErrors.agree && <p className="text-xs text-emergency-600 mt-1">{fieldErrors.agree}</p>}
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary btn-lg w-full">
            {loading ? <Spinner size={20} /> : <UserPlus size={20} />}
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{' '}
          <button onClick={onSwitchToLogin} className="font-semibold text-primary-700 hover:text-primary-800 transition-colors">
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}
