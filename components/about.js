const blocks = [
  {
    title: "WHO WE ARE",
    body: "BurmSiam is an independent automotive media brand driven by a passion for automobiles, motorcycles, motorsport, and automotive culture. Through creative storytelling and informative content, we bring the stories behind the machines to enthusiasts worldwide.",
  },
  {
    title: "OUR VISION",
    body: "To unite automotive enthusiasts across cultures and generations through a shared passion for the automotive world.",
  },
  {
    title: "OUR MISSION",
    body: "To educate, entertain, and inspire through engaging automotive storytelling, history, engineering knowledge, and creative digital media.",
  },
];

export function About() {
  return (
    <section id="aboutus" className="about">
      <div className="about-inner">
        {blocks.map((block) => (
          <article key={block.title}>
            <h2>{block.title}</h2>
            <p>{block.body}</p>
          </article>
        ))}
        <article>
          <h2>OUR CORE VALUE</h2>
          <p className="values">Passion · Authenticity · Creativity · Knowledge · Community</p>
        </article>
      </div>
    </section>
  );
}
