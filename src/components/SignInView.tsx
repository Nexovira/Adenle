import React, { useState } from 'react';
import { Mail, Lock, LogIn, ArrowRight, ShieldCheck, AlertCircle, Eye, EyeOff, KeyRound, CheckCircle2, HelpCircle, Copy, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { NexoviraLogo } from './NexoviraLogo';

interface SignInViewProps {
  onNavigate: (path: string) => void;
  onSuccessRedirect?: string;
}

export const SignInView: React.FC<SignInViewProps> = ({ onNavigate, onSuccessRedirect = '/account' }) => {
  const { signInWithEmail, signUpWithEmail, signInWithGoogle, resetPassword } = useAuth();
  const [email, setEmail] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('nexovira_pending_auth_email') || '';
    }
    return '';
  });
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [domainNotice, setDomainNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [registeringQuick, setRegisteringQuick] = useState(false);

  const handleEmailChange = (newEmail: string) => {
    setEmail(newEmail);
    if (typeof window !== 'undefined') {
      localStorage.setItem('nexovira_pending_auth_email', newEmail);
    }
  };

  const handleQuickRegister = async () => {
    const cleanEmail = email.toLowerCase().trim();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!password || password.length < 6) {
      setError('Please enter a password with at least 6 characters.');
      return;
    }
    setRegisteringQuick(true);
    setError('');
    try {
      const isOwner = cleanEmail === 'nexovirasupport@gmail.com' || cleanEmail === 'admin@nexovira.com';
      const role = isOwner ? 'admin' : 'customer';
      const displayName = isOwner ? 'Store Owner / Admin' : 'Valued Customer';
      
      const profile = await signUpWithEmail(email, password, displayName, '', role, true);
      if (profile?.role === 'admin' || isOwner) {
        onNavigate('/admin');
      } else if (profile?.role === 'seller') {
        onNavigate('/seller');
      } else if (profile?.role === 'affiliate' || profile?.isAffiliate) {
        onNavigate('/affiliate');
      } else {
        onNavigate(onSuccessRedirect || '/account');
      }
    } catch (err: any) {
      if (err?.code === 'auth/email-already-in-use' || err?.message?.includes('email-already-in-use')) {
        setError('This email is already registered in Firebase. If you forgot your password, please click "Reset Password" below to receive a password reset link.');
      } else {
        setError(formatAuthError(err));
      }
    } finally {
      setRegisteringQuick(false);
    }
  };

  // Forgot password modal state
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotStatus, setForgotStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [copiedDomain, setCopiedDomain] = useState(false);

  const formatAuthError = (err: any) => {
    const message = err?.message || String(err);
    if (message.includes('unauthorized-domain') || err?.code === 'auth/unauthorized-domain') {
      const currentHost = typeof window !== 'undefined' ? window.location.hostname : 'preview domain';
      setDomainNotice(currentHost);
      return `Firebase Domain Authorization: The current domain (${currentHost}) is not yet authorized in Firebase Console.`;
    }
    if (message.includes('operation-not-allowed') || err?.code === 'auth/operation-not-allowed') {
      return 'Email/Password Authentication is currently disabled in Firebase Console. Go to Firebase Console → Authentication → Sign-in method, select Email/Password, and enable it.';
    }
    if (message.includes('user-not-found') || message.includes('wrong-password') || message.includes('invalid-credential') || err?.code === 'auth/invalid-credential') {
      return 'Invalid email or password. If you have not created an account with this email yet, please click "Sign Up" below.';
    }
    if (message.includes('too-many-requests') || err?.code === 'auth/too-many-requests') {
      return 'Access temporarily blocked due to many failed sign-in attempts. Please reset your password or try again in a few minutes.';
    }
    return message;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setDomainNotice(null);
    setLoading(true);

    try {
      const profile = await signInWithEmail(email, password);
      const cleanEmail = email.toLowerCase().trim();
      
      if (profile?.role === 'admin' || cleanEmail === 'admin@nexovira.com' || cleanEmail === 'nexovirasupport@gmail.com') {
        onNavigate('/admin');
      } else if (profile?.role === 'seller') {
        onNavigate('/seller');
      } else if (profile?.role === 'affiliate' || profile?.isAffiliate) {
        onNavigate('/affiliate');
      } else {
        onNavigate(onSuccessRedirect || '/account');
      }
    } catch (err: any) {
      setError(formatAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setDomainNotice(null);
    setLoading(true);
    try {
      await signInWithGoogle();
      const saved = localStorage.getItem('nexovira_user_profile');
      let role = 'customer';
      if (saved) {
        try { role = JSON.parse(saved).role || 'customer'; } catch (_) {}
      }
      if (role === 'admin') onNavigate('/admin');
      else if (role === 'seller') onNavigate('/seller');
      else if (role === 'affiliate') onNavigate('/affiliate');
      else onNavigate(onSuccessRedirect || '/account');
    } catch (err: any) {
      setError(formatAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotStatus(null);
    setForgotLoading(true);

    try {
      await resetPassword(forgotEmail || email);
      setForgotStatus({
        type: 'success',
        message: `Password reset email sent to ${forgotEmail || email}! Please check your inbox and spam folder.`
      });
    } catch (err: any) {
      setForgotStatus({
        type: 'error',
        message: formatAuthError(err)
      });
    } finally {
      setForgotLoading(false);
    }
  };

  const handleCopyDomain = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.hostname);
      setCopiedDomain(true);
      setTimeout(() => setCopiedDomain(false), 2000);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-[#0B0F17]">
      <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <NexoviraLogo size={42} showText={true} showTagline={true} taglineClassName="text-[10px] sm:text-xs font-semibold text-cyan-400 italic mt-0.5" />
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight mt-2">Sign In to NEXOVIRA</h1>
          <p className="text-slate-400 text-xs mt-1">Access your account, track orders, & manage purchases</p>
        </div>



        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-400" />
            <div className="space-y-2.5 flex-1">
              <span className="font-bold block text-rose-300">Sign-in Notice</span>
              <p className="text-xs text-red-200 leading-relaxed">{error}</p>
              
              {(error.toLowerCase().includes('invalid email or password') || error.toLowerCase().includes('not created an account') || error.toLowerCase().includes('invalid-credential')) && (
                <div className="pt-2.5 border-t border-red-500/20 space-y-2.5">
                  <p className="text-[11px] text-slate-300">
                    Need to initialize or register this account? You can create it now with your entered password:
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={handleQuickRegister}
                      disabled={registeringQuick}
                      className="px-3.5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-md shadow-cyan-900/30"
                    >
                      {registeringQuick ? (
                        <span>Creating Account...</span>
                      ) : (
                        <>
                          <ShieldCheck className="w-3.5 h-3.5 text-cyan-200" />
                          <span>Create Account &amp; Sign In</span>
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setForgotEmail(email);
                        setIsForgotPasswordOpen(true);
                      }}
                      className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors cursor-pointer border border-slate-700"
                    >
                      Reset Password
                    </button>
                    <button
                      type="button"
                      onClick={() => onNavigate('/signup')}
                      className="text-cyan-400 hover:text-cyan-300 text-xs font-semibold underline ml-1 cursor-pointer"
                    >
                      Full Sign Up Form
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {domainNotice && (
          <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold text-amber-400">
              <HelpCircle className="w-4 h-4 shrink-0" />
              <span>How to authorize domain in Firebase Console:</span>
            </div>
            <p className="text-slate-300">
              Go to <strong>Firebase Console &gt; Authentication &gt; Settings &gt; Authorized Domains</strong> and add this domain:
            </p>
            <div className="flex items-center justify-between gap-2 bg-slate-950 p-2 rounded-lg border border-slate-800 font-mono text-[11px] text-cyan-300">
              <span className="truncate">{domainNotice}</span>
              <button
                onClick={handleCopyDomain}
                className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white shrink-0 flex items-center gap-1 text-[10px]"
                title="Copy Domain Name"
              >
                {copiedDomain ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedDomain ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 w-5 h-5 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => handleEmailChange(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-11 pr-4 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 text-sm"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold uppercase text-slate-400">Password</label>
              <button
                type="button"
                onClick={() => {
                  setForgotEmail(email);
                  setForgotStatus(null);
                  setIsForgotPasswordOpen(true);
                }}
                className="text-xs text-cyan-400 hover:underline font-medium"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 w-5 h-5 text-slate-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-11 pr-11 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3 text-slate-500 hover:text-cyan-400 transition-colors focus:outline-none"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold py-3 rounded-xl shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
            <LogIn className="w-4 h-4" />
          </button>
        </form>

        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-800"></div></div>
          <span className="relative bg-slate-900 px-3 text-xs text-slate-500 uppercase font-semibold">Or continue with</span>
        </div>

        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full bg-slate-950 hover:bg-slate-800 border border-slate-800 text-white font-medium py-3 rounded-xl transition-all flex items-center justify-center gap-3 text-sm"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.2 9 5 12 5z"/>
            <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"/>
            <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 10.8 0 12s.7 2.3 1.9 4.7l3.7-1.9z"/>
            <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.2-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z"/>
          </svg>
          Google Account
        </button>

        <p className="mt-8 text-center text-slate-400 text-sm">
          Don't have an account yet?{' '}
          <button
            onClick={() => onNavigate('/signup')}
            className="text-cyan-400 font-semibold hover:underline inline-flex items-center gap-1"
          >
            Create Account <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </p>
      </div>

      {/* Forgot Password Modal */}
      {isForgotPasswordOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative space-y-5 text-left">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">Account Recovery</span>
                <h3 className="text-xl font-bold text-white">Reset Password</h3>
              </div>
              <button
                onClick={() => setIsForgotPasswordOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Enter your registered email address below. We will send you an official Firebase link to safely reset your password.
            </p>

            {forgotStatus && (
              <div
                className={`p-4 rounded-xl text-xs flex items-start gap-2.5 ${
                  forgotStatus.type === 'success'
                    ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
                    : 'bg-red-500/10 border border-red-500/30 text-red-300'
                }`}
              >
                {forgotStatus.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                )}
                <span>{forgotStatus.message}</span>
              </div>
            )}

            <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Your Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 text-xs"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsForgotPasswordOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="px-5 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 text-xs font-black rounded-xl disabled:opacity-50"
                >
                  {forgotLoading ? 'Sending Email...' : 'Send Password Reset Link'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

