import { notFound } from "next/navigation";
import Link from "next/link";
import { ARTICLES_DATA } from "@/lib/articles";
import { Clock, Calendar, ArrowLeft, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";
import type { Metadata } from "next";

export async function generateStaticParams() {
  return ARTICLES_DATA.map((art) => ({
    slug: art.slug,
  }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const article = ARTICLES_DATA.find((a) => a.slug === params.slug);
  if (!article) return { title: "Article Not Found" };

  return {
    title: `${article.title} | Mako Trading Lab`,
    description: article.desc,
    openGraph: {
      title: article.title,
      description: article.desc,
      type: "article",
      publishedTime: article.date,
    }
  };
}

export default function ArticleDetailPage({ params }: { params: { slug: string } }) {
  const article = ARTICLES_DATA.find((a) => a.slug === params.slug);

  if (!article) {
    notFound();
  }

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <Link 
        href="/articles" 
        className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-slate-500 hover:text-mako-blue transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Strategy Research Articles</span>
      </Link>

      <header className="space-y-4">
        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="px-3 py-1 rounded-full bg-blue-50 text-mako-blue font-bold border border-blue-200">
            {article.category}
          </span>
          <span className="text-slate-400">•</span>
          <span className="text-slate-500 font-semibold flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {article.readTime}
          </span>
          <span className="text-slate-400">•</span>
          <span className="text-slate-500">{article.date}</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-slate-950 leading-[1.18] tracking-tight">
          {article.title}
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-medium pt-2">
          {article.desc}
        </p>
      </header>

      {/* Intro */}
      <div className="p-6 rounded-2xl bg-blue-50/60 border border-blue-200 text-sm sm:text-base text-slate-800 leading-relaxed font-normal">
        {article.content.intro}
      </div>

      {/* Sections */}
      <div className="space-y-8 text-slate-800 leading-relaxed">
        {article.content.sections.map((sec, idx) => (
          <section key={idx} className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-950">
              {sec.heading}
            </h2>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
              {sec.body}
            </p>
            {sec.takeaway && (
              <div className="p-4 rounded-xl bg-slate-100 border border-slate-300 flex items-start gap-2.5 text-xs sm:text-sm text-slate-800 font-medium">
                <CheckCircle2 className="w-4 h-4 text-mako-blue flex-shrink-0 mt-0.5" />
                <span><strong>Key Rule:</strong> {sec.takeaway}</span>
              </div>
            )}
          </section>
        ))}
      </div>

      {/* Conclusion */}
      <div className="p-6 rounded-2xl bg-slate-900 text-white space-y-4 shadow-xl">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-mako-cyan uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4" />
          <span>Mako Engineering Summary</span>
        </div>
        <p className="text-sm leading-relaxed text-slate-300">
          {article.content.conclusion}
        </p>
        <div className="pt-2">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-mako-blue hover:bg-blue-600 text-white font-bold text-xs shadow-md transition-all"
          >
            <span>Explore 500+ Verified MT5 Tools</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
