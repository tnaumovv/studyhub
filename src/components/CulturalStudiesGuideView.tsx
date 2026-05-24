import { useCallback, useEffect, useRef, useState } from "react";
import { culturalStudiesGuide } from "../data/culturalStudiesGuide";
import type { GuideBlock, GuideSection } from "../data/culturalStudiesGuideTypes";

function GuideBlockView({ block }: { block: GuideBlock }) {
  switch (block.type) {
    case "paragraph":
      return <p className="cs-guide__p">{block.text}</p>;
    case "list":
      if (block.ordered) {
        return (
          <ol className="cs-guide__list">
            {block.items.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ol>
        );
      }
      return (
        <ul className="cs-guide__list">
          {block.items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      );
    case "table":
      return (
        <div className="cs-guide__table-wrap">
          <table className="cs-guide__table">
            <thead>
              <tr>
                {block.headers.map((h, i) => (
                  <th key={i}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, ri) => (
                <tr key={ri}>
                  {row.map((cell, ci) => (
                    <td key={ci}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "callout": {
      const variant = block.variant ?? "tip";
      return (
        <aside className={`cs-guide__callout cs-guide__callout--${variant}`}>
          {block.title ? <strong className="cs-guide__callout-title">{block.title}</strong> : null}
          <p>{block.text}</p>
        </aside>
      );
    }
    case "terms":
      return (
        <dl className="cs-guide__terms">
          {block.items.map((item, i) => (
            <div key={i} className="cs-guide__term">
              <dt>{item.term}</dt>
              <dd>{item.definition}</dd>
            </div>
          ))}
        </dl>
      );
    case "heading":
      if (block.level === 3) {
        return <h4 className="cs-guide__h3">{block.text}</h4>;
      }
      return <h5 className="cs-guide__h4">{block.text}</h5>;
    default:
      return null;
  }
}

function SectionArticle({
  section,
  sectionRef,
}: {
  section: GuideSection;
  sectionRef: (el: HTMLElement | null) => void;
}) {
  return (
    <article
      id={section.id}
      ref={sectionRef}
      className="cs-guide__section"
      aria-labelledby={`${section.id}-title`}
    >
      <header className="cs-guide__section-head">
        <span className="cs-guide__section-num">Lecture {section.number}</span>
        <h2 id={`${section.id}-title`} className="cs-guide__section-title">
          {section.title}
        </h2>
        <p className="cs-guide__section-sub">{section.subtitle}</p>
      </header>
      <div className="cs-guide__section-body">
        {section.blocks.map((block, i) => (
          <GuideBlockView key={i} block={block} />
        ))}
      </div>
    </article>
  );
}

export function CulturalStudiesGuideView() {
  const { title, subtitle, description, sections, quickReference } =
    culturalStudiesGuide;
  const [activeId, setActiveId] = useState(sections[0]?.id ?? "");
  const [tocOpen, setTocOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Map<string, HTMLElement>>(new Map());

  const setSectionRef = useCallback((id: string) => {
    return (el: HTMLElement | null) => {
      if (el) sectionRefs.current.set(id, el);
      else sectionRefs.current.delete(id);
    };
  }, []);

  useEffect(() => {
    const root = scrollRef.current;
    if (!root) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target.id) {
          setActiveId(visible[0].target.id);
        }
      },
      { root, rootMargin: "-20% 0px -55% 0px", threshold: [0, 0.15, 0.4] },
    );

    sectionRefs.current.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    const el = sectionRefs.current.get(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveId(id);
    }
    setTocOpen(false);
  };

  const scrollTop = () => {
    scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    setTocOpen(false);
  };

  const activeIndex = sections.findIndex((s) => s.id === activeId);

  return (
    <div className="cs-guide">
      <div className="cs-guide__scroll" ref={scrollRef}>
        <header className="cs-guide__hero">
          <p className="cs-guide__eyebrow">Final exam preparation</p>
          <h1 className="cs-guide__title">{title}</h1>
          <p className="cs-guide__subtitle">{subtitle}</p>
          <p className="cs-guide__desc">{description}</p>
          <nav className="cs-guide__hero-nav" aria-label="Lecture overview">
            {sections.map((s) => (
              <button
                key={s.id}
                type="button"
                className="cs-guide__hero-chip"
                onClick={() => scrollTo(s.id)}
              >
                {s.number}
              </button>
            ))}
          </nav>
        </header>

        <div className="cs-guide__content">
          {sections.map((section) => (
            <SectionArticle
              key={section.id}
              section={section}
              sectionRef={setSectionRef(section.id)}
            />
          ))}

          <section id="quick-reference" className="cs-guide__section cs-guide__section--ref">
            <header className="cs-guide__section-head">
              <span className="cs-guide__section-num">Reference</span>
              <h2 className="cs-guide__section-title">Key Thinkers & Concepts</h2>
            </header>
            <div className="cs-guide__table-wrap">
              <table className="cs-guide__table cs-guide__table--scholars">
                <thead>
                  <tr>
                    <th>Scholar</th>
                    <th>Field</th>
                    <th>Contribution</th>
                  </tr>
                </thead>
                <tbody>
                  {quickReference.map((row, i) => (
                    <tr key={i}>
                      <td>{row.scholar}</td>
                      <td>{row.field}</td>
                      <td>{row.contribution}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="cs-guide__goodluck">Good luck on your final exam!</p>
          </section>
        </div>
      </div>

      <aside className="cs-guide__toc" aria-label="Table of contents">
        <div className="cs-guide__toc-inner">
          <span className="cs-guide__toc-label">Contents</span>
          <ol className="cs-guide__toc-list">
            {sections.map((s) => (
              <li key={s.id}>
                <button
                  type="button"
                  className={`cs-guide__toc-item ${activeId === s.id ? "cs-guide__toc-item--active" : ""}`}
                  onClick={() => scrollTo(s.id)}
                >
                  <span className="cs-guide__toc-num">{s.number}</span>
                  <span className="cs-guide__toc-text">{s.title}</span>
                </button>
              </li>
            ))}
          </ol>
        </div>
      </aside>

      <div className="cs-guide__mobile-bar">
        <button
          type="button"
          className="cs-guide__mobile-btn cs-guide__mobile-btn--menu"
          onClick={() => setTocOpen((o) => !o)}
          aria-expanded={tocOpen}
          aria-label="Open table of contents"
        >
          <span className="cs-guide__mobile-icon" aria-hidden>
            ☰
          </span>
          <span>Lectures</span>
        </button>
        <div className="cs-guide__mobile-progress" aria-hidden>
          {activeIndex >= 0 ? activeIndex + 1 : 1} / {sections.length}
        </div>
        <button
          type="button"
          className="cs-guide__mobile-btn"
          onClick={() => {
            const prev = sections[activeIndex - 1];
            if (prev) scrollTo(prev.id);
          }}
          disabled={activeIndex <= 0}
          aria-label="Previous lecture"
        >
          ‹
        </button>
        <button
          type="button"
          className="cs-guide__mobile-btn"
          onClick={() => {
            const next = sections[activeIndex + 1];
            if (next) scrollTo(next.id);
            else scrollTop();
          }}
          aria-label="Next lecture"
        >
          ›
        </button>
        <button
          type="button"
          className="cs-guide__mobile-btn"
          onClick={scrollTop}
          aria-label="Scroll to top"
        >
          ↑
        </button>
      </div>

      {tocOpen ? (
        <>
          <button
            type="button"
            className="cs-guide__sheet-backdrop"
            aria-label="Close menu"
            onClick={() => setTocOpen(false)}
          />
          <div className="cs-guide__sheet" role="dialog" aria-label="Lecture list">
            <div className="cs-guide__sheet-head">
              <h3>All lectures</h3>
              <button
                type="button"
                className="btn btn--ghost btn--small"
                onClick={() => setTocOpen(false)}
              >
                Close
              </button>
            </div>
            <ol className="cs-guide__sheet-list">
              {sections.map((s) => (
                <li key={s.id}>
                  <button type="button" onClick={() => scrollTo(s.id)}>
                    <span className="cs-guide__sheet-num">{s.number}</span>
                    <span>
                      <strong>{s.title}</strong>
                      <small>{s.subtitle}</small>
                    </span>
                  </button>
                </li>
              ))}
            </ol>
          </div>
        </>
      ) : null}
    </div>
  );
}
