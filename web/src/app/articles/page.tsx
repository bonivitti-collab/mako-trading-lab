import Link from "next/link";
import { ARTICLES_DATA } from "@/lib/articles";
import { BookOpen, Clock, ArrowRight } from "lucide-react";

export default function ArticlesPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-mako-blue text-xs font-mono font-bold">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Quantitative Research & Strategy Deep Dives</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-950">Mako Research & Strategy Articles</h1>
        <p className="text-base text-slate-600 leading-relaxed">
          Deep dives into prop-firm survival engineering, smart money execution mechanics, and multi-symbol volatility architectures. Click any article to read the full breakdown.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {ARTICLES_DATA.map((art) => (
          <Link 
            key={art.slug}
            href={`/articles/${art.slug}`}
            className="rounded-3xl border border-slate-300 bg-white p-7 flex flex-col justify-between space-y-5 white-card group"
          >
            <div className="space-y-3.5">
              <div className="flex items-center justify-between text-xs font-mono text-slate-500">
                <span className="px-2.5 py-0.5 rounded-md bg-blue-50 text-mako-blue font-bold border border-blue-200">
                  {art.category}
                </span>
                <span className="flex items-center gap-1 font-semibold">
                  <Clock className="w-3.5 h-3.5" />
                  {art.readTime}
                </span>
              </div>

              <h2 className="text-xl font-bold text-slate-900 group-hover:text-mako-blue transition-colors leading-snug">
                {art.title}
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                {art.desc}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-xs font-semibold text-mako-blue">
              <span className="text-slate-400 font-mono text-[11px] font-normal">{art.date}</span>
              <span className="flex items-center gap-1.5 group-hover:translate-x-1 transition-transform">
                <span>Read Full Article</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
