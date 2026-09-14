export default function MentionsLegalePage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold mb-10">Mentions légales</h1>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-2">Éditrice du site</h2>
        <p>
          Yonna Merlini<br />
          Contact : via le formulaire de contact du site<br />
          Site : https://www.yonnamerlini.com
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-2">Hébergement</h2>
        <p>
          Front-end et API : Render (Render Services, Inc., 525 Brannan Street,
          San Francisco, CA 94107, États-Unis).<br />
          Base de données : Aiven (Aiven Oy, Helsinki, Finlande).
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-2">Données personnelles (RGPD)</h2>
        <p>
          Le formulaire de contact collecte votre nom, votre adresse e-mail et
          votre message, dans la seule finalité de répondre à votre demande.
          Ces données sont transmises via le service d'envoi d'e-mails Mailjet
          (sous-traitant) et ne sont ni stockées en base de données, ni cédées
          à des tiers, ni utilisées à des fins commerciales.
        </p>
        <p>
          Conformément au RGPD, vous disposez d'un droit d'accès, de
          rectification et de suppression de vos données. Pour l'exercer,
          utilisez le formulaire de contact du site.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-2">Cookies</h2>
        <p>
          Ce site n'utilise aucun cookie de suivi ou publicitaire. Seul un
          cookie technique strictement nécessaire à la connexion de l'espace
          d'administration est utilisé ; il ne concerne pas les visiteurs et ne
          requiert pas de bandeau de consentement.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-2">Propriété intellectuelle</h2>
        <p>
          L'ensemble des contenus du site (textes, photographies, réalisations)
          est la propriété de Yonna Merlini. Toute reproduction sans
          autorisation est interdite.
        </p>
      </section>
    </div>
  );
}