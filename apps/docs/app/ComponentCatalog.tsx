"use client";
import { useState } from "react";
import Link from "next/link";

type Category = {
  slug: string;
  title: string;
  motif: string;
  description: string;
  items: { name: string; tier: string }[];
};
export function ComponentCatalog({ categories }: { categories: Category[] }) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState("all");
  const visible = categories
    .filter((category) => selected === "all" || selected === category.slug)
    .map((category) => ({
      ...category,
      items: category.items.filter((item) =>
        `${item.name} ${category.title} ${category.slug}`
          .toLowerCase()
          .includes(query.trim().toLowerCase()),
      ),
    }))
    .filter((category) => category.items.length);
  const count = visible.reduce((total, category) => total + category.items.length, 0);
  return (
    <section className="section catalog-section" id="catalog" aria-labelledby="catalog-title">
      <div className="showcase-heading">
        <div>
          <p className="eyebrow">THE LIBRARY / 12 COLLECTIONS</p>
          <h2 id="catalog-title">Find your next interaction.</h2>
        </div>
        <p>
          All 153 components, in one place.
          <br />
          Choose a collection to try its live demos.
        </p>
      </div>
      <div className="catalog-controls">
        <label htmlFor="catalog-search">
          Search components
          <input
            id="catalog-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Try FadeUp, carousel, or text…"
          />
        </label>
        <label htmlFor="catalog-collection">
          Collection
          <select
            id="catalog-collection"
            value={selected}
            onChange={(event) => setSelected(event.target.value)}
          >
            <option value="all">All collections</option>
            {categories.map((category) => (
              <option key={category.slug} value={category.slug}>
                {category.title}
              </option>
            ))}
          </select>
        </label>
        <p role="status">{count} components</p>
      </div>
      <div className="collection-grid">
        {visible.map((category, index) => (
          <article className="collection-card" key={category.slug}>
            <Link
              href={`/${category.slug}`}
              className={`collection-art art-${category.motif}`}
              aria-label={`Open ${category.title} live demos`}
            >
              <span className="art-index" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="art-objects" aria-hidden="true">
                {category.motif === "type" ? (
                  <span className="art-word">Aa↗</span>
                ) : category.motif === "press" ? (
                  <span className="art-button">
                    Go beyond <span>↗</span>
                  </span>
                ) : (
                  [0, 1, 2, 3].map((item) => <span className="art-object" key={item} />)
                )}
              </div>
              <span className="art-open" aria-hidden="true">
                ↗
              </span>
            </Link>
            <div className="collection-copy">
              <div className="collection-title">
                <h3>
                  <Link href={`/${category.slug}`}>{category.title}</Link>
                </h3>
                <span>{category.items.length}</span>
              </div>
              <p>{category.description}</p>
              <details>
                <summary>Browse component names</summary>
                <ul>
                  {category.items.map((item) => (
                    <li key={item.name}>
                      <Link href={`/${category.slug}`}>
                        {item.name}
                        <span>{item.tier === "experimental" ? "LAB" : "↗"}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </details>
            </div>
          </article>
        ))}
      </div>
      {count === 0 && (
        <div className="catalog-empty">
          <h3>No matching components.</h3>
          <p>Try another name or choose all collections.</p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setSelected("all");
            }}
          >
            Clear filters
          </button>
        </div>
      )}
    </section>
  );
}
