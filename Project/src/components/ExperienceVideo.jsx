import React from 'react';

// Official Tourism Malaysia promotional film ("Truly Wondrous Nature &
// Rainforest"). youtube-nocookie.com is the privacy-enhanced embed domain.
// Swap VIDEO_ID for your own promotional footage if desired.
const VIDEO_ID = 't57nDjO1QSg';

/**
 * Embedded promotional video — the "accessible multimedia" enrichment for the
 * marketing section. The iframe has a descriptive title for screen readers and
 * a visible fallback link in case embedding is blocked.
 */
export default function ExperienceVideo() {
  return (
    <section aria-labelledby="experience-heading">
      <div className="text-center max-w-2xl mx-auto mb-8">
        <h2 id="experience-heading" className="text-3xl font-bold text-stone-900 mb-2">Experience Wild Malaysia</h2>
        <p className="text-stone-600">From misty rainforest canopies to turtle nesting shores — see the places your booking helps protect.</p>
      </div>
      <div className="relative w-full max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-xl border border-stone-200" style={{ aspectRatio: '16 / 9' }}>
        <iframe
          className="absolute inset-0 w-full h-full"
          src={`https://www.youtube-nocookie.com/embed/${VIDEO_ID}`}
          title="Truly Wondrous Nature & Rainforest — Tourism Malaysia"
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
      <p className="text-center text-sm text-stone-400 mt-3">
        Video not loading?{' '}
        <a href={`https://www.youtube.com/watch?v=${VIDEO_ID}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
          Watch it on YouTube
        </a>.
      </p>
    </section>
  );
}
