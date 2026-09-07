'use client';

import React, { useState } from 'react';
import { 
  RegistrationType, 
  RegistrationFormData, 
  TeamMember,
  RegistrationSubmissionResult 
} from '@/types/registration';
import { SYMPOSIUM_EVENTS, DEPARTMENTS } from '@/data/events';
import { EventCard } from './EventCard';
import { TeamSection } from './TeamSection';
import { PaymentSection } from './PaymentSection';
import { SuccessModal } from './SuccessModal';
import { Toast } from './Toast';
import { 
  User, 
  Mail, 
  Phone, 
  Building2, 
  Sparkles, 
  Loader2, 
  AlertCircle, 
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Layers,
  Cpu,
  Trophy
} from 'lucide-react';

interface RegistrationFormProps {
  type: RegistrationType;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({ type }) => {
  const isInternal = type === 'internal';
  const pricePerHead = isInternal ? 150 : 200;
  const eventDate = isInternal ? '24-09-2026' : '25-09-2026';
  const dayTitle = isInternal ? 'DAY 1: 24 SEPTEMBER 2026' : 'DAY 2: 25 SEPTEMBER 2026';

  // Separate Technical and Non-Technical events
  const technicalEvents = SYMPOSIUM_EVENTS.filter((e) => e.category === 'Technical');
  const nonTechnicalEvents = SYMPOSIUM_EVENTS.filter((e) => e.category === 'Non-Technical');

  // Form State
  const [formData, setFormData] = useState<RegistrationFormData>({
    fullName: '',
    email: '',
    phone: '',
    department: '',
    collegeName: isInternal ? 'The Kavery Engineering College (Autonomous)' : '',
    selectedEvents: [],
    isTeam: false,
    teamMembers: [],
    transactionId: '',
    paymentScreenshot: null,
    paymentScreenshotPreview: null,
  });

  // UI state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<RegistrationSubmissionResult | null>(null);

  // Field change handler
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Check currently selected event in category
  const selectedTechEvent = SYMPOSIUM_EVENTS.find(
    (e) => e.category === 'Technical' && formData.selectedEvents.includes(e.id)
  );
  const selectedNonTechEvent = SYMPOSIUM_EVENTS.find(
    (e) => e.category === 'Non-Technical' && formData.selectedEvents.includes(e.id)
  );

  // Strict Event Selection: 1 Technical AND 1 Non-Technical
  const handleToggleEvent = (eventId: string) => {
    const targetEvent = SYMPOSIUM_EVENTS.find((e) => e.id === eventId);
    if (!targetEvent) return;

    const isCurrentlySelected = formData.selectedEvents.includes(eventId);

    if (isCurrentlySelected) {
      // Unselect
      setFormData((prev) => ({
        ...prev,
        selectedEvents: prev.selectedEvents.filter((id) => id !== eventId),
      }));
    } else {
      // Trying to select targetEvent
      if (targetEvent.category === 'Technical') {
        if (selectedTechEvent) {
          setToastMessage(
            `⚠️ You can only choose 1 Technical Event! (Currently selected: "${selectedTechEvent.name}"). Unselect it first to choose "${targetEvent.name}".`
          );
          return;
        }
      } else if (targetEvent.category === 'Non-Technical') {
        if (selectedNonTechEvent) {
          setToastMessage(
            `⚠️ You can only choose 1 Non-Technical Event! (Currently selected: "${selectedNonTechEvent.name}"). Unselect it first to choose "${targetEvent.name}".`
          );
          return;
        }
      }

      setFormData((prev) => ({
        ...prev,
        selectedEvents: [...prev.selectedEvents, eventId],
      }));
    }
  };

  // Team Logic handlers
  const handleToggleTeam = (enabled: boolean) => {
    setFormData((prev) => ({
      ...prev,
      isTeam: enabled,
      teamMembers: enabled && prev.teamMembers.length === 0 ? [{ id: Date.now().toString(), name: '' }] : prev.teamMembers,
    }));
  };

  const handleAddTeamMember = () => {
    if (formData.teamMembers.length >= 4) return;
    setFormData((prev) => ({
      ...prev,
      teamMembers: [...prev.teamMembers, { id: Date.now().toString(), name: '' }],
    }));
  };

  const handleRemoveTeamMember = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      teamMembers: prev.teamMembers.filter((m) => m.id !== id),
    }));
  };

  const handleUpdateMemberName = (id: string, name: string) => {
    setFormData((prev) => ({
      ...prev,
      teamMembers: prev.teamMembers.map((m) => (m.id === id ? { ...m, name } : m)),
    }));
  };

  // Payment Screenshot handler
  const handleFileSelect = (file: File | null, preview: string | null) => {
    setFormData((prev) => ({
      ...prev,
      paymentScreenshot: file,
      paymentScreenshotPreview: preview,
    }));
  };

  // Validation
  const validateForm = () => {
    if (!formData.fullName.trim()) return 'Please enter your Full Name.';
    if (!formData.email.trim() || !formData.email.includes('@')) return 'Please enter a valid Email address.';
    if (!formData.phone.trim() || formData.phone.replace(/\D/g, '').length < 10) return 'Please enter a valid 10-digit Phone/WhatsApp number.';
    if (!formData.department.trim()) return 'Please select your Department.';
    if (!isInternal && !formData.collegeName.trim()) return 'Please enter your College Name.';
    
    if (formData.selectedEvents.length === 0) {
      return 'Please choose your events (1 Technical and 1 Non-Technical).';
    }
    if (!selectedTechEvent) {
      return 'Please choose 1 Technical Event.';
    }
    if (!selectedNonTechEvent) {
      return 'Please choose 1 Non-Technical Event.';
    }

    if (formData.isTeam) {
      for (let i = 0; i < formData.teamMembers.length; i++) {
        if (!formData.teamMembers[i].name.trim()) {
          return `Please provide a name for Team Member #${i + 2}, or remove the empty slot.`;
        }
      }
    }

    // Payment validation for both Internal (₹150) and External (₹200)
    if (!formData.transactionId?.trim()) {
      return 'Please enter the UPI Transaction ID / UTR Number.';
    }
    if (!formData.paymentScreenshot) {
      return 'Please upload your payment screenshot proof.';
    }

    return null;
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setHasAttemptedSubmit(true);

    const validationError = validateForm();
    if (validationError) {
      setToastMessage(validationError);
      return;
    }

    setIsSubmitting(true);

    try {
      const selectedEventNames = formData.selectedEvents.map(
        (id) => SYMPOSIUM_EVENTS.find((e) => e.id === id)?.name || id
      );

      const payload = new FormData();
      payload.append('fullName', formData.fullName);
      payload.append('email', formData.email);
      payload.append('phone', formData.phone);
      payload.append('department', formData.department);
      payload.append('collegeName', formData.collegeName);
      payload.append('type', type);
      payload.append('events', JSON.stringify(selectedEventNames));
      payload.append('isTeam', String(formData.isTeam));
      payload.append('teamMembers', JSON.stringify(formData.teamMembers.map((m) => m.name)));

      if (formData.transactionId) {
        payload.append('transactionId', formData.transactionId);
      }
      if (formData.paymentScreenshot) {
        payload.append('paymentScreenshot', formData.paymentScreenshot);
      }

      const response = await fetch('/api/register', {
        method: 'POST',
        body: payload,
      });

      const resData = await response.json();

      if (!response.ok) {
        throw new Error(resData.error || 'Failed to submit registration.');
      }

      const totalMembersCount = 1 + formData.teamMembers.length;
      const calculatedAmount = totalMembersCount * pricePerHead;

      const result: RegistrationSubmissionResult = {
        success: true,
        registrationId: resData.registrationId,
        timestamp: resData.timestamp,
        data: {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          department: formData.department,
          collegeName: formData.collegeName,
          type: type,
          events: selectedEventNames,
          isTeam: formData.isTeam,
          teamMembers: formData.teamMembers.map((m) => m.name),
          amountPaid: calculatedAmount,
          transactionId: formData.transactionId,
        },
      };

      setSubmissionResult(result);
    } catch (error: any) {
      console.error(error);
      setToastMessage(error.message || 'An error occurred during submission. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      department: '',
      collegeName: isInternal ? 'The Kavery Engineering College (Autonomous)' : '',
      selectedEvents: [],
      isTeam: false,
      teamMembers: [],
      transactionId: '',
      paymentScreenshot: null,
      paymentScreenshotPreview: null,
    });
    setHasAttemptedSubmit(false);
    setSubmissionResult(null);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Toast Warning notification */}
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />

      {/* Success Modal upon submission */}
      {submissionResult && (
        <SuccessModal result={submissionResult} onReset={resetForm} />
      )}

      {/* Main Registration Form Card */}
      <form
        onSubmit={handleSubmit}
        noValidate
        className="glass-panel p-6 sm:p-10 rounded-3xl border border-slate-800/90 shadow-2xl relative space-y-10"
      >
        {/* Visual Badge for Form Type */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
                isInternal
                  ? 'border-pink-500/50 bg-pink-950/40 text-pink-300'
                  : 'border-cyan-500/50 bg-cyan-950/40 text-cyan-300'
              }`}
            >
              {isInternal ? (
                <>
                  <ShieldCheck className="w-3.5 h-3.5 text-pink-400" />
                  <span>Day 1 • Inter College (TKEC Students Only)</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Day 2 • External Colleges & Universities</span>
                </>
              )}
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white mt-2">
              {isInternal
                ? 'The Kavery Engineering College — Inter College Registration'
                : 'External College Delegate Registration — Zentrix 2K26'}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              {isInternal
                ? 'Organized by Dept of CSE, IT, AI&DS for The Kavery Engineering College students.'
                : 'National Level Technical Symposium for students of other engineering colleges.'}
            </p>
          </div>

          <div className="text-right">
            <span className="text-[11px] text-slate-400 block uppercase tracking-wider">Event Date</span>
            <p className={`text-base font-black font-mono ${isInternal ? 'text-pink-400' : 'text-cyan-400'}`}>
              {eventDate}
            </p>
            <span className="text-[10px] text-slate-500">Fee: ₹{pricePerHead}/- per head</span>
          </div>
        </div>

        {/* SECTION 1: Personal & Academic Details */}
        <div className="space-y-6">
          <div className={`flex items-center gap-2 text-sm font-bold uppercase tracking-wider ${isInternal ? 'text-pink-400' : 'text-cyan-400'}`}>
            <User className="w-4 h-4" />
            <span>1. Participant Information</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Full Name <span className="text-pink-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  required
                  placeholder="e.g., Arjun Ramanathan"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-xl bg-slate-950/70 border text-white text-sm placeholder:text-slate-500 focus:outline-none transition ${
                    hasAttemptedSubmit && !formData.fullName.trim()
                      ? 'border-red-500 ring-1 ring-red-500/50'
                      : isInternal
                      ? 'border-slate-800 focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20'
                      : 'border-slate-800 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20'
                  }`}
                />
              </div>
              {hasAttemptedSubmit && !formData.fullName.trim() && (
                <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> Full name is required.
                </p>
              )}
            </div>

            {/* Email Address */}
            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Email Address <span className="text-pink-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  placeholder="e.g., arjun@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-xl bg-slate-950/70 border text-white text-sm placeholder:text-slate-500 focus:outline-none transition ${
                    hasAttemptedSubmit && (!formData.email.trim() || !formData.email.includes('@'))
                      ? 'border-red-500 ring-1 ring-red-500/50'
                      : isInternal
                      ? 'border-slate-800 focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20'
                      : 'border-slate-800 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20'
                  }`}
                />
              </div>
              {hasAttemptedSubmit && (!formData.email.trim() || !formData.email.includes('@')) && (
                <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> Valid email is required.
                </p>
              )}
            </div>

            {/* WhatsApp / Phone Number */}
            <div>
              <label htmlFor="phone" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Phone Number (WhatsApp) <span className="text-pink-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  maxLength={13}
                  placeholder="e.g., 9842712345"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-xl bg-slate-950/70 border text-white text-sm placeholder:text-slate-500 focus:outline-none transition ${
                    hasAttemptedSubmit && formData.phone.replace(/\D/g, '').length < 10
                      ? 'border-red-500 ring-1 ring-red-500/50'
                      : isInternal
                      ? 'border-slate-800 focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20'
                      : 'border-slate-800 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20'
                  }`}
                />
              </div>
              {hasAttemptedSubmit && formData.phone.replace(/\D/g, '').length < 10 && (
                <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> Enter a valid 10-digit WhatsApp phone number.
                </p>
              )}
            </div>

            {/* Department */}
            <div>
              <label htmlFor="department" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Department / Branch <span className="text-pink-500">*</span>
              </label>
              <div className="relative">
                <select
                  id="department"
                  name="department"
                  required
                  value={formData.department}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-xl bg-slate-950/70 border text-white text-sm focus:outline-none transition appearance-none cursor-pointer ${
                    hasAttemptedSubmit && !formData.department
                      ? 'border-red-500 ring-1 ring-red-500/50'
                      : isInternal
                      ? 'border-slate-800 focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20'
                      : 'border-slate-800 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20'
                  }`}
                >
                  <option value="" disabled className="bg-slate-900 text-slate-400">
                    Select your department
                  </option>
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept} className="bg-slate-900 text-white">
                      {dept}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  ▼
                </div>
              </div>
              {hasAttemptedSubmit && !formData.department && (
                <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> Please select your department.
                </p>
              )}
            </div>

            {/* College Name */}
            {isInternal ? (
              <div className="sm:col-span-2 p-3.5 rounded-xl bg-pink-950/20 border border-pink-500/30 flex items-center gap-3">
                <input
                  type="hidden"
                  name="collegeName"
                  value="The Kavery Engineering College (Autonomous)"
                />
                <Building2 className="w-5 h-5 text-pink-400 shrink-0" />
                <div className="text-xs">
                  <span className="text-slate-400">Institution: </span>
                  <strong className="text-pink-300 font-semibold">
                    The Kavery Engineering College (Autonomous) — Day 1 Internal
                  </strong>
                </div>
              </div>
            ) : (
              <div className="sm:col-span-2">
                <label htmlFor="collegeName" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  College / University Name <span className="text-pink-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="collegeName"
                    name="collegeName"
                    required
                    placeholder="e.g., Government College of Engineering, Salem"
                    value={formData.collegeName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-xl bg-slate-950/70 border text-white text-sm placeholder:text-slate-500 focus:outline-none transition ${
                      hasAttemptedSubmit && !formData.collegeName.trim()
                        ? 'border-red-500 ring-1 ring-red-500/50'
                        : 'border-slate-800 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20'
                    }`}
                  />
                </div>
                {hasAttemptedSubmit && !formData.collegeName.trim() && (
                  <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> College name is required.
                  </p>
                )}
              </div>
            )}

          </div>
        </div>

        {/* SECTION 2: Events Selection (Choose 1 Technical & 1 Non-Technical) */}
        <div className="space-y-6 pt-4 border-t border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className={`flex items-center gap-2 text-sm font-bold uppercase tracking-wider ${isInternal ? 'text-pink-400' : 'text-cyan-400'}`}>
              <Sparkles className="w-4 h-4" />
              <span>2. Choose Your Events (1 Technical & 1 Non-Technical)</span>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className={`px-2.5 py-1 rounded-full border text-[11px] font-bold ${
                selectedTechEvent 
                  ? 'bg-cyan-950/80 border-cyan-500/60 text-cyan-300' 
                  : 'bg-slate-900 border-slate-700 text-slate-400'
              }`}>
                Tech: {selectedTechEvent ? selectedTechEvent.name : '0/1'}
              </span>
              <span className={`px-2.5 py-1 rounded-full border text-[11px] font-bold ${
                selectedNonTechEvent 
                  ? 'bg-purple-950/80 border-purple-500/60 text-purple-300' 
                  : 'bg-slate-900 border-slate-700 text-slate-400'
              }`}>
                Non-Tech: {selectedNonTechEvent ? selectedNonTechEvent.name : '0/1'}
              </span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>
              <strong>Rule:</strong> You must choose <strong>1 Technical Event</strong> and <strong>1 Non-Technical Event</strong> (Total 2 events).
            </span>
          </div>

          {/* Group 1: Technical Events (4 Events) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                <Cpu className="w-4 h-4" /> Technical Arena (Choose 1 Event)
              </span>
              {selectedTechEvent && (
                <span className="text-[11px] text-cyan-300 font-mono font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /> {selectedTechEvent.name} Selected
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {technicalEvents.map((event) => {
                const isSelected = formData.selectedEvents.includes(event.id);
                // Disabled if user already chose a tech event and this is not the one
                const isDisabled = Boolean(selectedTechEvent && !isSelected);

                return (
                  <EventCard
                    key={event.id}
                    event={event}
                    isSelected={isSelected}
                    isDisabled={isDisabled}
                    onToggle={handleToggleEvent}
                  />
                );
              })}
            </div>
          </div>

          {/* Group 2: Non-Technical Events (4 Events) */}
          <div className="space-y-3 pt-4 border-t border-slate-800/80">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-pink-400 flex items-center gap-1.5">
                <Trophy className="w-4 h-4" /> Non-Technical Arena (Choose 1 Event)
              </span>
              {selectedNonTechEvent && (
                <span className="text-[11px] text-pink-300 font-mono font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-pink-400" /> {selectedNonTechEvent.name} Selected
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {nonTechnicalEvents.map((event) => {
                const isSelected = formData.selectedEvents.includes(event.id);
                // Disabled if user already chose a non-tech event and this is not the one
                const isDisabled = Boolean(selectedNonTechEvent && !isSelected);

                return (
                  <EventCard
                    key={event.id}
                    event={event}
                    isSelected={isSelected}
                    isDisabled={isDisabled}
                    onToggle={handleToggleEvent}
                  />
                );
              })}
            </div>
          </div>

          {hasAttemptedSubmit && (!selectedTechEvent || !selectedNonTechEvent) && (
            <p className="text-xs text-red-400 mt-2 flex items-center gap-1 font-medium">
              <AlertCircle className="w-3.5 h-3.5" /> Please select 1 Technical event and 1 Non-Technical event.
            </p>
          )}
        </div>

        {/* SECTION 3: Team Participation Toggle & Dynamic Fields */}
        <div className="pt-4 border-t border-slate-800">
          <TeamSection
            isTeam={formData.isTeam}
            onToggleTeam={handleToggleTeam}
            teamMembers={formData.teamMembers}
            onAddMember={handleAddTeamMember}
            onRemoveMember={handleRemoveTeamMember}
            onUpdateMemberName={handleUpdateMemberName}
            isExternal={!isInternal}
            pricePerHead={pricePerHead}
          />
        </div>

        {/* SECTION 4: Payment Section (Rendered for BOTH Internal ₹150 and External ₹200) */}
        <div className="pt-4 border-t border-slate-800">
          <PaymentSection
            type={type}
            pricePerHead={pricePerHead}
            totalMembers={1 + formData.teamMembers.length}
            transactionId={formData.transactionId || ''}
            onTransactionIdChange={(val) =>
              setFormData((prev) => ({ ...prev, transactionId: val }))
            }
            screenshotFile={formData.paymentScreenshot || null}
            screenshotPreview={formData.paymentScreenshotPreview || null}
            onFileSelect={handleFileSelect}
            isSubmittedAttempt={hasAttemptedSubmit}
          />
        </div>

        {/* SUBMIT ACTION BUTTON */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-400 text-center sm:text-left">
            By submitting, you confirm participation in <strong>ZENTRIX 2K26 ({eventDate})</strong>.
          </div>

          <button
            type="submit"
            id="submit-registration-btn"
            disabled={isSubmitting}
            className={`w-full sm:w-auto min-w-[240px] px-8 py-4 rounded-2xl text-sm font-extrabold uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all duration-300 ${
              isSubmitting
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                : isInternal
                ? 'bg-gradient-to-r from-pink-600 via-purple-600 to-cyan-500 hover:from-pink-500 hover:to-cyan-400 text-white shadow-[0_0_30px_rgba(255,0,127,0.4)] hover:scale-[1.02] active:scale-[0.98]'
                : 'bg-gradient-to-r from-cyan-500 via-purple-600 to-pink-500 hover:from-cyan-400 hover:to-pink-400 text-white shadow-[0_0_30px_rgba(0,240,255,0.4)] hover:scale-[1.02] active:scale-[0.98]'
            }`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Confirming & Saving Pass...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>
                  {isInternal 
                    ? `Submit Internal Registration (₹${(1 + formData.teamMembers.length) * pricePerHead})`
                    : `Submit External Registration (₹${(1 + formData.teamMembers.length) * pricePerHead})`}
                </span>
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
};
