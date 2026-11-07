import { Photo } from "./photo";

export function Hero({ slogan, youtubeId, background }) {
  const embed = youtubeId
    ? `https://www.youtube-nocookie.com/embed/${youtubeId}`
    : "";

  return (
    <section id="home" className="hero">
      <Photo
        src={background.src}
        srcSet={background.srcSet}
        sizes="100vw"
        alt=""
        className="hero-bg"
        eager
      />
      <div className="hero-shade" />
      <div className="hero-inner">
        <h1 className="slogan">{slogan}</h1>
        <div className="player-block">
          <p className="episode-label">Recent Episode</p>
          <div className="player">
            {embed ? (
              <iframe
                src={embed}
                title="Recent episode"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
              />
            ) : (
              <p className="player-note">The latest film will play here.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
