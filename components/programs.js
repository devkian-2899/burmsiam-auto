import Link from "next/link";
import { Photo } from "./photo";

function Card({ item }) {
  return (
    <Link className="program-card" href={item.href}>
      <Photo
        src={item.image.src}
        srcSet={item.image.srcSet}
        sizes="(max-width: 860px) 50vw, 22vw"
        alt={item.name}
        className="program-photo"
      />
    </Link>
  );
}

export function Programs({ items }) {
  return (
    <section id="programs" className="programs">
      <div className="programs-inner">
        <div className="programs-head">
          <h2>OUR PROGRAM</h2>
          <Link className="programs-all-link" href="/all-episodes">
            View all episodes
          </Link>
        </div>
        {items.length === 0 ? <p className="program-empty">No programs yet.</p> : (
          <div className="program-list" tabIndex={0} aria-label="Our programs">
            {items.map((item, index) => (
              <Card key={`${item.name}-${index}`} item={item} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
