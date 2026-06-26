import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { CheckCircle2 } from 'lucide-react';
import { apiFetch } from '../api/apiFetch';

const ContactForm = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [serverError, setServerError] = useState(null);

  const { 
    register, 
    handleSubmit, 
    reset, 
    formState: { errors, isSubmitting } 
  } = useForm();

  const onSubmit = async (data) => {
    setServerError(null);
    try {
      
      await apiFetch('/contact', {
        method: 'POST',
        body: JSON.stringify(data),
      });

      setIsSubmitted(true);
      reset();
    } catch (err) {
     
      setServerError(err.message);
    }
  };

  const inputClass = "w-full px-4 py-3 bg-[var(--bg-color)] border-b-2 border-[#333] text-[var(--text-main)] focus:border-[var(--primary-color)] focus:outline-none transition-colors";
  const labelClass = "text-[10px] uppercase tracking-[0.3em] font-mono text-[var(--primary-color)] mb-2 block";
  const errorClass = "text-[10px] text-red-500 font-mono mt-2";

  return (
    <section className="w-full bg-[var(--bg-color)] py-20 px-6" aria-labelledby="contact-title">
      <div className="max-w-2xl mx-auto">
        
        <div className="mb-12 border-l-2 border-[var(--primary-color)] pl-6">
          <h2 id="contact-title" className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mb-4">
            <span className="text-[var(--primary-color)]">CONTACT</span>
          </h2>
          <p className="text-sm font-mono  text-[var(--text-main)]/100 uppercase tracking-widest">
            Prêt pour une nouvelle implémentation ?
          </p>
        </div>

        {isSubmitted ? (
          <div role="status" aria-live="polite" className="p-8 border border-[var(--primary-color)] bg-[var(--primary-color)]/5 text-[var(--primary-color)] text-center space-y-4">
            <CheckCircle2 className="w-12 h-12 mx-auto" aria-hidden="true" />
            <h3 className="font-mono uppercase tracking-widest">Transmission réussie</h3>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8" noValidate>
            
            {serverError && (
              <div role="alert" className="p-4 bg-red-900/20 border border-red-500 text-red-400 text-xs font-mono uppercase tracking-widest">
                {serverError}
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <label htmlFor="name" className={labelClass}>Nom</label>
                <input 
                  id="name" 
                  autoComplete="name"
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? "name-error" : undefined}
                  {...register("name", { required: "Le nom est requis" })} 
                  className={inputClass} 
                />
                {errors.name && <p id="name-error" className={errorClass}>{errors.name.message}</p>}
              </div>
              
              <div>
                <label htmlFor="email" className={labelClass}>Email</label>
                <input 
                  id="email" 
                  type="email" 
                  autoComplete="email"
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "email-error" : undefined}
                  {...register("email", { 
                    required: "L'email est requis",
                    pattern: { value: /^\S+@\S+\.\S+$/, message: "Email invalide" }
                  })} 
                  className={inputClass} 
                />
                {errors.email && <p id="email-error" className={errorClass}>{errors.email.message}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="message" className={labelClass}>Message</label>
              <textarea 
                id="message" 
                aria-invalid={!!errors.message}
                aria-describedby={errors.message ? "message-error" : undefined}
                rows="5" 
                {...register("message", { 
                  required: "Le message est requis",
                  minLength: { value: 10, message: "Minimum 10 caractères requis" }
                })} 
                className={inputClass} 
              />
              {errors.message && <p id="message-error" className={errorClass}>{errors.message.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full md:w-auto px-8 py-4 bg-[var(--primary-color)] text-[var(--bg-color)] font-black uppercase tracking-[0.2em] hover:bg-[var(--accent-color)] transition-all disabled:opacity-50"
            >
              {isSubmitting ? "ENVOI EN COURS..." : "ENVOYER"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
};

export default ContactForm;