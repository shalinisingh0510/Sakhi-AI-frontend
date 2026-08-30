import { type Citation } from "@/lib/api";

export function CitationCard({ citation }: { citation: Citation }) {
  if (citation.url) {
    return (
      <a 
        href={citation.url} 
        target="_blank" 
        rel="noopener noreferrer"
        className="block rounded-lg border border-peach/50 bg-peach/10 p-3 transition-colors hover:bg-peach/20 hover:border-peach"
      >
        <p className="text-xs font-semibold text-berry">{citation.source}</p>
        {citation.text && <p className="mt-1 text-xs text-ink/70 line-clamp-2">{citation.text}</p>}
      </a>
    );
  }

  return (
    <div className="block rounded-lg border border-peach/50 bg-peach/10 p-3">
      <p className="text-xs font-semibold text-berry">{citation.source}</p>
      {citation.text && <p className="mt-1 text-xs text-ink/70 line-clamp-2">{citation.text}</p>}
    </div>
  );
}

