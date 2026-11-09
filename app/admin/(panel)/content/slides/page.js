import { PreviewSave } from "../../../../../components/admin/preview-save";
import { site } from "../../../../../content/site";

export const metadata = {
  title: "Latest Explore slideshow · BurmSiamAuto",
};

export default function SlidesPage() {
  return (
      <section className="admin-card">
        <h1>Change slideshow Latest Explore</h1>
        <p className="admin-lead">The four photos in Explore the Latest. This section is still hidden on the public site.</p>
        <PreviewSave>
          {site.slides.map((slide, index) => (
            <fieldset key={slide.title} className="admin-set">
              <legend>Slide {index + 1}</legend>
              <label>
                <span>Title</span>
                <input name={`title-${index}`} defaultValue={slide.title} />
              </label>
              <label>
                <span>Photo link</span>
                <input name={`image-${index}`} defaultValue={slide.image} />
              </label>
              <label>
                <span>Opens this link</span>
                <input name={`href-${index}`} defaultValue={slide.href} placeholder="Optional" />
              </label>
            </fieldset>
          ))}
        </PreviewSave>
      </section>
  );
}
