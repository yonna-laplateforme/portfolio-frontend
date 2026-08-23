import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { apiFetch } from '../api/apiFetch';

const ContactMinimal = () => {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const { register, handleSubmit, formState: { isSubmitting } } = useForm();
    

   const onSubmit = async (data) => {
    try {
        await apiFetch('api/contact', {
            method: 'POST',
            body: JSON.stringify(data),
        });
        setIsSubmitted(true);
    } catch (error) {
        console.error(error);
        alert(error.message || "Impossible de contacter le serveur.");
    }
};
const inputClasses = "w-full bg-transparent border-b-2 border-zinc-500 pb-2 outline-none focus:border-primary transition-all placeholder:text-zinc-600 font-mono text-sm uppercase";
    return (
        <div className="py-24 px-6 max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-16 items-center">
                <div className="space-y-6">
                    <p className="font-mono text-sm text-secondary uppercase tracking-widest leading-relaxed">
                        N'hésitez pas à me solliciter pour une collaboration,
                        une question technique ou simplement pour échanger.
                    </p>
                </div>

                <div className="w-full">
                    {isSubmitted ? (
                        <p className="font-mono text-sm uppercase tracking-widest text-primary">// MESSAGE TRANSMIS.</p>
                    ) : (
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                            
                            {/* NOM */}
                            <div>
                                <label htmlFor="name" className="sr-only">Nom</label>
                                <input
                                    {...register("name", { required: true })}
                                    id="name"
                                    placeholder="NOM"
                                        autoComplete="name"
                                        className={inputClasses}
                                    
                                />
                            </div>

                            {/* EMAIL */}
                            <div>
                                <label htmlFor="email" className="sr-only">Email</label>
                                <input
                                    {...register("email", { required: true })}
                                    id="email"
                                    type="email"
                                    placeholder="EMAIL"
                                    autoComplete="email"
                                    className={inputClasses}
                                />
                            </div>

                            {/* MESSAGE */}
                            <div>
                                <label htmlFor="message" className="sr-only">Message</label>
                                <textarea
                                    {...register("message", { required: true })}
                                    id="message"
                                    placeholder="MESSAGE"
                                    rows="3"
                                    className={inputClasses}
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="font-mono text-xs uppercase tracking-[0.3em] hover:text-accent transition-colors block font-bold cursor-pointer"
                                aria-label="Envoyer le formulaire de contact"
                            >
                               {isSubmitting ? "ENVOI EN COURS..." : ">> ENVOYER"}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};
export default ContactMinimal;