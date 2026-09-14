const ITEMS = ['Développement web', 'Photographie', 'Vidéo', 'Drone', 'Lyon'];

const Marquee = () => (
  <div className="overflow-hidden border-y border-ink/15 bg-cream py-5" aria-hidden>
    <div className="animate-marquee flex w-max">
      {[0, 1].map((dup) => (
        <div key={dup} className="flex shrink-0 items-center">
          {ITEMS.map((item, i) => (
            <span key={i} className="flex items-center font-display text-2xl md:text-4xl font-light whitespace-nowrap">
              <span className="px-8">{item}</span>
              <span className="text-brick text-xl md:text-2xl">✳</span>
            </span>
          ))}
        </div>
      ))}
    </div>
  </div>
);

export default Marquee;