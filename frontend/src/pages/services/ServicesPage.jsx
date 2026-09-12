import React, { useState, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import ServicesHero from './components/ServicesHero';
import FormProgress from './components/FormProgress';
import AboutYouStep from './components/AboutYouStep';
import YourEventStep from './components/YourEventStep';
import YourVisionStep from './components/YourVisionStep';
import ConfirmationScreen from './components/ConfirmationScreen';

export default function ServicesPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inquiryId, setInquiryId] = useState('');
  const [submissionDate, setSubmissionDate] = useState('');

  const formSectionRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    countryCode: '+91',
    eventType: 'Wedding',
    location: '',
    venue: '',
    eventDate: '',
    days: '2 Days',
    services: ['Photography', 'Cinematography'],
    budget: '₹1L – ₹2L',
    message: '',
    source: 'Instagram',
  });

  const updateFormData = (fields) => {
    setFormData((prev) => ({ ...prev, ...fields }));
  };

  const scrollToForm = () => {
    if (formSectionRef.current) {
      const topOffset = formSectionRef.current.getBoundingClientRect().top + window.scrollY - 90;
      window.scrollTo({ top: topOffset, behavior: 'smooth' });
    }
  };

  const handleNextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 3));
    scrollToForm();
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    scrollToForm();
  };

  const handleStepClick = (stepNumber) => {
    // Only allow navigating backwards or to visited steps
    if (stepNumber < currentStep) {
      setCurrentStep(stepNumber);
      scrollToForm();
    }
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);

    const generatedId = `TF-${Math.floor(1000 + Math.random() * 9000)}`;
    const formattedDate = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    try {
      // POST to backend inquiries endpoint as specified
      await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inquiryId: generatedId,
          ...formData,
          createdAt: new Date().toISOString(),
        }),
      }).catch((err) => {
        // Gracefully catch offline / backend not running in pure frontend mode
        console.info('Backend API note:', err.message);
      });
    } catch (e) {
      console.info('Submitting client-side:', e);
    } finally {
      setIsSubmitting(false);
      setInquiryId(generatedId);
      setSubmissionDate(formattedDate);
      setCurrentStep(4); // Move to Confirmation Screen
      scrollToForm();
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F1EA] text-[#1E1B18] selection:bg-[#CBB9A4]/40 selection:text-[#1E1B18]">
      
      {/* 1. Services Hero: Asymmetric editorial layout with printed couple photograph */}
      <ServicesHero onStartBooking={scrollToForm} />

      {/* 2. Form Anchor & Seamless Transition */}
      <section
        id="booking-form"
        ref={formSectionRef}
        className="relative pt-12 md:pt-16"
      >
        {/* Step Breadcrumb Header (Only shown during the 3 steps) */}
        {currentStep <= 3 && (
          <FormProgress
            currentStep={currentStep}
            onStepClick={handleStepClick}
            onPrevStep={handlePrevStep}
          />
        )}

        {/* Dynamic 3-Step Transitions with Framer Motion */}
        <div className="relative overflow-hidden min-h-[560px]">
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <AboutYouStep
                key="step-01"
                formData={formData}
                updateFormData={updateFormData}
                onNextStep={handleNextStep}
              />
            )}

            {currentStep === 2 && (
              <YourEventStep
                key="step-02"
                formData={formData}
                updateFormData={updateFormData}
                onNextStep={handleNextStep}
              />
            )}

            {currentStep === 3 && (
              <YourVisionStep
                key="step-03"
                formData={formData}
                updateFormData={updateFormData}
                onSubmit={handleFinalSubmit}
                isSubmitting={isSubmitting}
              />
            )}

            {currentStep === 4 && (
              <ConfirmationScreen
                key="step-confirmation"
                formData={formData}
                inquiryId={inquiryId}
                submissionDate={submissionDate}
              />
            )}
          </AnimatePresence>
        </div>
      </section>

    </div>
  );
}
