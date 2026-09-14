import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { apiFetch } from '../api/apiFetch';

const ContactMinimal = () => {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [serverError, setServerError] = useState('');
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

    const onSubmit = async (data) => {
        setServerError('');
        try {
            await apiFetch('api/contact', {
                method: 'POST',
                body: JSON.stringify(data),
            });
            setIsSubmitted(true);
        } catch (error) {
            console.error(error);
            setServerError(error.message || "Impossible de contacter le serveur. Réessayez dans un instant.");
        }
    };

    // Champs : lignes fines papier sur fond encre, accent brique
    const inputClasses = "w-full bg-transparent border-b border-paper/30 pb-3 outline-none focus:border-brick transition-all duration-300 placeholder:text-paper/40 font-mono text-sm uppercase tracking-widest text-paper";
    const errorClasses = "block mt-2 font-mono text-[10px] uppercase tracking-widest text-brick";

    return (
        <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-start">
                <div className="space-y-6">
                    <p className="font-mono text-sm text-paper/70 uppercase tracking-widest leading-relaxed">
                        N'hésitez pas à me solliciter pour une collaboration,
                        une question technique ou simplement pour échanger.
                    </p>
                    
                </div>

                <div className="w-full">
                    {isSubmitted ? (
                        <p className="font-mono text-sm uppercase tracking-widest text-brick">
                            // Message transmis. Réponse sous 48 h. 
                        </p>
                    ) : (
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8" noValidate>

                            {/* NOM */}
                            <div>
                                <label htmlFor="name" className="sr-only">Nom</label>
                                <input
                                    {...register("name", { required: "Votre nom est requis" })}
                                    id="name"
                                    placeholder="Nom"
                                    autoComplete="name"
                                    className={inputClasses}
                                    aria-invalid={errors.name ? "true" : "false"}
                                />
                                {errors.name && <span className={errorClasses}>{errors.name.message}</span>}
                            </div>

                            {/* EMAIL */}
                            <div>
                                <label htmlFor="email" className="sr-only">Email</label>
                                <input
                                    {...register("email", {
                                        required: "Votre email est requis",
                                        pattern: {
                                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                            message: "Format d'email invalide",
                                        },
                                    })}
                                    id="email"
                                    type="email"
                                    placeholder="Email"
                                    autoComplete="email"
                                    className={inputClasses}
                                    aria-invalid={errors.email ? "true" : "false"}
                                />
                                {errors.email && <span className={errorClasses}>{errors.email.message}</span>}
                            </div>

                            {/* MESSAGE */}
                            <div>
                                <label htmlFor="message" className="sr-only">Message</label>
                                <textarea
                                    {...register("message", {
                                        required: "Un petit message est requis",
                                        minLength: { value: 10, message: "10 caractères minimum" },
                                    })}
                                    id="message"
                                    placeholder="Message"
                                    rows="3"
                                    className={inputClasses}
                                    aria-invalid={errors.message ? "true" : "false"}
                                ></textarea>
                                {errors.message && <span className={errorClasses}>{errors.message.message}</span>}
                            </div>

                            {/* Erreur serveur (ex: API down) */}
                            {serverError && (
                                <p className="font-mono text-[11px] uppercase tracking-widest text-brick" role="alert">
                                    ⚠ {serverError}
                                </p>
                            )}

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="font-mono text-xs uppercase tracking-[0.3em] text-paper hover:text-brick transition-colors duration-300 block font-bold cursor-pointer disabled:opacity-50"
                                aria-label="Envoyer le formulaire de contact"
                            >
                                {isSubmitting ? "Envoi en cours…" : ">> Envoyer"}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ContactMinimal;