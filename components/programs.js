import { Photo } from "./photo";

function Card({ item }) {
  return (
    <article className="program-card">
      <Photo
        src={item.image.src}
        srcSet={item.image.srcSet}
        sizes="(max-width: 860px) 50vw, 22vw"
        alt={item.name}
        className="program-photo"
      />
    </article>
  );
}

export function Programs({ items }) {
  return (
    <section id="programs" className="programs">
      <div className="programs-inner">
        <h2>OUR PROGRAM</h2>
        <div className="program-list" tabIndex={0} aria-label="Our programs">
          {items.map((item, index) => (
            <Card key={`${item.name}-${index}`} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
