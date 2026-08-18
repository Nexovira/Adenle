import React, { useState, useEffect } from 'react';
import { TechService, ServicePackage, CurrencyCode } from '../types';
import { formatCurrency } from '../lib/currency';
import { 
  Code2, 
  CheckCircle2, 
  Star, 
  Clock, 
  ShieldCheck, 
  Send, 
  Sparkles, 
  UserCheck, 
  X,
  Layers,
  Lock,
  Award,
  RefreshCw,
  Trash2
} from 'lucide-react';
import { getTechServicesFromFirestore, createEscrowServiceOrderInFirestore, deleteTechServiceFromFirestore } from '../lib/firestoreService';
import { useAuth } from '../context/AuthContext';

interface TechServicesViewProps {
  currentCurrency: CurrencyCode;
}

export const TechServicesView: React.FC<TechServicesViewProps> = ({ currentCurrency }) => {
  const { isAdmin } = useAuth();
  const [services, setServices] = useState<TechService[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedService, setSelectedService] = useState<TechService | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<ServicePackage | null>(null);
  const [requestSent, setRequestSent] = useState(false);
  const [clientRequirement, setClientRequirement] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientName, setClientName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [deleteMsg, setDeleteMsg] = useState('');

  const categories = ['All', 'Software & Web', 'UI/UX Design', 'AI & Data', 'Branding & Graphics', 'App Development'];

  const loadServices = async () => {
    setLoading(true);
    try {
      const data = await getTechServicesFromFirestore();
      setServices(data);
    } catch (err) {
      console.error('Error loading services:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteService = async (serviceId: string) => {
    if (!window.confirm('Are you sure you want to delete this service/expert from the marketplace?')) return;
    try {
      setServices((prev) => prev.filter((s) => s.id !== serviceId));
      await deleteTechServiceFromFirestore(serviceId);
      setDeleteMsg('Service deleted successfully.');
      setTimeout(() => setDeleteMsg(''), 3000);
    } catch (err) {
      console.error('Failed to delete tech service:', err);
      // reload if firestore delete failed
      await loadServices();
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const filteredServices = services.filter(
    (s) => selectedCategory === 'All' || s.category === selectedCategory
  );

  const handleOpenBooking = (service: TechService, pkg: ServicePackage) => {
    setSelectedService(service);
    setSelectedPackage(pkg);
    setRequestSent(false);
    setClientRequirement('');
  };

  const handleConfirmRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService || !selectedPackage) return;
    setSubmitting(true);
    try {
      await createEscrowServiceOrderInFirestore({
        serviceId: selectedService.id,
        serviceTitle: selectedService.title,
        providerName: selectedService.providerName,
        packageName: selectedPackage.name,
        packagePriceUSD: selectedPackage.price,
        currency: currentCurrency,
        clientName: clientName || 'Valued Client',
        clientEmail: clientEmail || '',
        clientRequirement,
        escrowGuaranteed: true
      });
      setRequestSent(true);
    } catch (err) {
      console.error('Failed to submit escrow order:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-left space-y-8">
      
      {/* Header Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-blue-950 via-slate-900 to-slate-950 border border-blue-900/40 text-white relative overflow-hidden">
        <div className="max-w-2xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-500/30">
            <Code2 className="w-3.5 h-3.5" />
            <span>NEXOVIRA Tech & Digital Services Marketplace</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black">Build, Grow & Transform Your Digital Products</h1>
          <p className="text-xs text-blue-300 font-semibold italic">"Innovation begins with vision. Smart living, better every day."</p>
          <p className="text-xs sm:text-sm text-slate-300">
            Hire verified web developers, UI/UX designers, AI automation engineers, and branding specialists. Guaranteed escrow delivery.
          </p>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap items-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
              selectedCategory === cat
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-blue-500'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Services Grid or Coming Soon State */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 flex items-center justify-center gap-2">
          <RefreshCw className="w-5 h-5 animate-spin text-blue-500" />
          <span>Syncing Tech Services catalog from Firestore...</span>
        </div>
      ) : services.length === 0 || filteredServices.length === 0 ? (
        <div className="p-8 sm:p-12 text-center rounded-3xl bg-slate-900 border border-slate-800 text-white space-y-6 shadow-2xl relative overflow-hidden">
          <div className="w-16 h-16 rounded-3xl bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center mx-auto shadow-inner">
            <Code2 className="w-8 h-8" />
          </div>

          <div className="max-w-xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold border border-blue-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Official Feature Announcement</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">NEXOVIRA Tech Services — Coming Soon</h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              NEXOVIRA Tech Services are currently being prepared and will be available in the future. Our team is establishing guaranteed escrow contracts, verified engineering talent, and structured packages for full-stack web engineering, custom AI agent integrations, UI/UX design, and technology consulting.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto pt-2 text-left">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-1">
              <div className="text-xs font-bold text-blue-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                <span>Guaranteed Escrow</span>
              </div>
              <p className="text-[11px] text-slate-400">Payments held safely in escrow and released only upon milestone confirmation.</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-1">
              <div className="text-xs font-bold text-blue-400 flex items-center gap-1.5">
                <UserCheck className="w-4 h-4" />
                <span>Admin-Verified Talent</span>
              </div>
              <p className="text-[11px] text-slate-400">Strictly vetted specialists across web, mobile, AI, and design architectures.</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-1">
              <div className="text-xs font-bold text-blue-400 flex items-center gap-1.5">
                <Lock className="w-4 h-4" />
                <span>Zero Fake Listings</span>
              </div>
              <p className="text-[11px] text-slate-400">Only verified, published services will be available when officially launched.</p>
            </div>
          </div>

          {/* Project Inquiry / Early Notification Form */}
          <div className="max-w-lg mx-auto pt-4 border-t border-slate-800">
            {requestSent ? (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Thank you! Your inquiry has been logged. We will notify you when Tech Services officially launch.</span>
              </div>
            ) : (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  setSubmitting(true);
                  try {
                    await createEscrowServiceOrderInFirestore({
                      serviceTitle: 'Early Tech Service Inquiry',
                      clientName: clientName || 'Interested Client',
                      clientEmail,
                      clientRequirement: clientRequirement || 'Requested notification for Tech Services launch',
                      status: 'Launch Inquiry'
                    });
                    setRequestSent(true);
                  } catch (err) {
                    console.error('Failed to submit inquiry:', err);
                  } finally {
                    setSubmitting(false);
                  }
                }}
                className="space-y-3 text-left"
              >
                <div className="text-xs font-bold text-slate-300 text-center">Have a project requirement? Submit an inquiry for early launch review:</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Your Name"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                  />
                  <input
                    type="email"
                    required
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    placeholder="Your Email Address"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <textarea
                  rows={2}
                  value={clientRequirement}
                  onChange={(e) => setClientRequirement(e.target.value)}
                  placeholder="Describe your tech project needs (optional)..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{submitting ? 'Submitting...' : 'Submit Project Brief / Notify Me'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-lg hover:shadow-2xl transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-16/10 overflow-hidden bg-slate-800">
                  <img
                    src={service.image}
                    alt={service.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-3 right-3 bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow">
                    {service.category}
                  </span>

                  {/* Delete Action */}
                  {isAdmin && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteService(service.id);
                      }}
                      className="absolute top-3 left-3 bg-red-600/90 hover:bg-red-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow flex items-center gap-1 transition-colors cursor-pointer z-10"
                      title="Delete Service"
                      aria-label="Remove Service"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  )}
                  
                  {/* Escrow Guarantee Pill */}
                  <div className="absolute bottom-3 left-3 bg-emerald-950/90 border border-emerald-500/40 text-emerald-400 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 backdrop-blur-md">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Guaranteed Escrow Delivery</span>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={service.providerAvatar}
                      alt={service.providerName}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-full object-cover border border-blue-500/40"
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1">
                        <span>{service.providerName}</span>
                        {service.providerVerified && <UserCheck className="w-3.5 h-3.5 text-blue-500 shrink-0" />}
                      </div>
                      <div className="text-[11px] text-slate-500">{service.location}</div>
                    </div>
                  </div>

                  <h3 className="text-lg font-black text-slate-900 dark:text-white leading-snug">
                    {service.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {service.description}
                  </p>

                  <div className="space-y-1.5 pt-2">
                    {service.keyFeatures.slice(0, 3).map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Packages Selector Footer */}
              <div className="p-6 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                  <span>Select Tier:</span>
                  <span className="text-blue-500 font-mono">From {formatCurrency(service.startingPrice, currentCurrency)}</span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {service.packages.map((pkg) => (
                    <button
                      key={pkg.name}
                      onClick={() => handleOpenBooking(service, pkg)}
                      className="p-2.5 rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-500 text-left transition-colors group"
                    >
                      <div className="text-[10px] font-bold text-slate-500 group-hover:text-blue-400 uppercase">{pkg.name}</div>
                      <div className="text-xs font-black text-slate-900 dark:text-white font-mono mt-0.5">
                        {formatCurrency(pkg.price, currentCurrency)}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Package Request Modal */}
      {selectedService && selectedPackage && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-xl w-full p-6 shadow-2xl relative space-y-6 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => { setSelectedService(null); setSelectedPackage(null); }}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-100 dark:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            {requestSent ? (
              <div className="py-8 text-center space-y-4">
                <div className="w-16 h-16 bg-blue-500/20 text-blue-500 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">Escrow Hire Proposal Submitted!</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                  {selectedService.providerName} has received your requirements for the <span className="font-bold text-blue-400">{selectedPackage.name} Package ({formatCurrency(selectedPackage.price, currentCurrency)})</span>.
                  Funds will be safely held in NEXOVIRA Escrow until you inspect & approve milestone delivery.
                </p>
                <button
                  onClick={() => { setSelectedService(null); setSelectedPackage(null); }}
                  className="px-6 py-2.5 bg-blue-600 text-white font-bold text-xs rounded-xl"
                >
                  Close & Return
                </button>
              </div>
            ) : (
              <form onSubmit={handleConfirmRequest} className="space-y-4">
                <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
                  <span className="text-[10px] font-bold text-blue-500 uppercase tracking-wide">Guaranteed Escrow Hire Order</span>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">{selectedService.title}</h3>
                  <div className="text-xs text-slate-500 font-medium mt-1">
                    Package: <span className="font-bold text-slate-900 dark:text-white">{selectedPackage.name}</span> • Price: <span className="font-bold text-blue-500 font-mono">{formatCurrency(selectedPackage.price, currentCurrency)}</span> • Delivery: {selectedPackage.deliveryDays} Days
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-300">Your Full Name:</label>
                    <input
                      type="text"
                      required
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="e.g. Samuel Okonkwo"
                      className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-300">Contact Email:</label>
                    <input
                      type="email"
                      required
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      placeholder="name@company.com"
                      className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">Describe Your Project Requirements:</label>
                  <textarea
                    rows={4}
                    required
                    value={clientRequirement}
                    onChange={(e) => setClientRequirement(e.target.value)}
                    placeholder="Provide details about your project goals, references, timelines, or specifications..."
                    className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-xs text-slate-900 dark:text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs space-y-1 text-emerald-200">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-400">
                    <ShieldCheck className="w-4 h-4" />
                    <span>NEXOVIRA Guaranteed Escrow Protection</span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    Your payment is safely locked in escrow and only released to the verified specialist when you confirm satisfaction.
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    <span>{submitting ? 'Submitting Escrow Order...' : 'Submit Service Proposal with Escrow'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
