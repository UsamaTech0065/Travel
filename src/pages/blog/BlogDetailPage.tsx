import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Share2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SafeImage } from '../../components/common/SafeImage';
import { formatDate } from '../../utils/format';
import { PackageCard } from '../../components/cards/PackageCard';
import { BlogCard } from '../../components/cards/BlogCard';

export const BlogDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { blogPosts, packages, addBlogComment, user, showToast } = useApp();

  const currentIdx = blogPosts.findIndex((p) => p.slug === slug);
  const post = currentIdx >= 0 ? blogPosts[currentIdx] : blogPosts[0];
  const prevPost = currentIdx > 0 ? blogPosts[currentIdx - 1] : null;
  const nextPost = currentIdx >= 0 && currentIdx < blogPosts.length - 1 ? blogPosts[currentIdx + 1] : null;

  const [commentAuthor, setCommentAuthor] = useState(user?.name || '');
  const [commentBody, setCommentBody] = useState('');

  const relatedPackages = packages.filter((p) => post.relatedPackageIds.includes(p.id));
  const relatedArticles = blogPosts.filter((p) => p.id !== post.id).slice(0, 3);

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentBody.trim()) return;
    addBlogComment(post.id, commentAuthor.trim() || 'Reader', commentBody.trim());
    setCommentBody('');
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href).catch(() => {});
    showToast('Article link copied', 'Share this guide with fellow travelers.');
  };

  return (
    <div className="pt-24 pb-16 bg-[#F8FAFC] min-h-screen">
      <article className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <header className="space-y-4">
          <Link to="/blog" className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#168AAD] hover:underline">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Journal
          </Link>
          <p className="text-xs font-medium text-slate-500">
            {post.category} · {post.destination} · {formatDate(post.publishDate)} · {post.readingTime} · {post.views.toLocaleString()} views
          </p>
          <h1 className="font-serif text-3xl sm:text-5xl font-semibold text-[#102A43] leading-tight">
            {post.title}
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">{post.excerpt}</p>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-200">
            <div className="flex items-center gap-3">
              <SafeImage src={post.author.avatar} alt={post.author.name} className="w-11 h-11 rounded-full object-cover" />
              <div>
                <p className="text-sm font-semibold text-[#102A43]">{post.author.name}</p>
                <p className="text-xs text-slate-500">{post.author.role}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-[#102A43] hover:bg-slate-50"
            >
              <Share2 className="w-3.5 h-3.5" /> Share Article
            </button>
          </div>
        </header>

        {/* Featured Image */}
        <div className="aspect-[16/9] rounded-2xl overflow-hidden bg-slate-100">
          <SafeImage src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
        </div>

        {/* TOC + Body */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <aside className="lg:col-span-4 rounded-2xl border border-slate-200 bg-white p-5 lg:sticky lg:top-24 space-y-3">
            <h2 className="text-xs font-semibold text-[#102A43]">In This Guide</h2>
            <ul className="space-y-2 text-xs text-slate-600">
              {post.sections.map((sec) => (
                <li key={sec.id}>
                  <a href={`#${sec.id}`} className="hover:text-[#168AAD] transition-colors">
                    {sec.heading}
                  </a>
                </li>
              ))}
            </ul>
            <div className="pt-3 border-t border-slate-100 text-xs text-slate-500">
              Topics: {post.tags.join(' · ')}
            </div>
          </aside>

          <div className="lg:col-span-8 space-y-8">
            {post.sections.map((sec) => (
              <section key={sec.id} id={sec.id} className="space-y-4">
                <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#102A43]">
                  {sec.heading}
                </h2>
                {sec.paragraphs.map((p, i) => (
                  <p key={i} className="text-slate-700 leading-relaxed text-base">
                    {p}
                  </p>
                ))}
                {sec.quote && (
                  <blockquote className="rounded-xl border border-slate-200 bg-white p-6 font-serif italic text-lg text-[#102A43]">
                    “{sec.quote}”
                  </blockquote>
                )}
                {sec.image && (
                  <div className="aspect-[16/10] rounded-xl overflow-hidden bg-slate-100 my-4">
                    <SafeImage src={sec.image} alt={sec.heading} className="w-full h-full object-cover" />
                  </div>
                )}
                {sec.tip && (
                  <div className="rounded-xl border border-[#168AAD]/30 bg-[#168AAD]/5 p-4 text-sm text-[#102A43]">
                    <strong>Expedition Tip:</strong> {sec.tip}
                  </div>
                )}
              </section>
            ))}

            {/* Author Bio */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 flex items-start gap-4">
              <SafeImage src={post.author.avatar} alt={post.author.name} className="w-14 h-14 rounded-full object-cover shrink-0" />
              <div>
                <p className="font-semibold text-[#102A43]">{post.author.name}</p>
                <p className="text-xs text-[#168AAD] mb-1.5">{post.author.role}</p>
                <p className="text-xs text-slate-600 leading-relaxed">{post.author.bio}</p>
              </div>
            </div>

            {/* Prev / Next Navigation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-200">
              {prevPost ? (
                <Link to={`/blog/${prevPost.slug}`} className="rounded-xl border border-slate-200 bg-white p-4 hover:border-[#168AAD]">
                  <p className="text-xs text-slate-500">← Previous Guide</p>
                  <p className="text-sm font-semibold text-[#102A43] mt-1">{prevPost.title}</p>
                </Link>
              ) : (
                <div />
              )}
              {nextPost && (
                <Link to={`/blog/${nextPost.slug}`} className="rounded-xl border border-slate-200 bg-white p-4 text-right hover:border-[#168AAD]">
                  <p className="text-xs text-slate-500">Next Guide →</p>
                  <p className="text-sm font-semibold text-[#102A43] mt-1">{nextPost.title}</p>
                </Link>
              )}
            </div>

            {/* Comments */}
            <div className="space-y-5 pt-4 border-t border-slate-200">
              <h3 className="font-serif text-2xl font-semibold text-[#102A43]">
                Traveler Discussion ({post.comments.length})
              </h3>
              <div className="space-y-3">
                {post.comments.map((c) => (
                  <div key={c.id} className="rounded-xl border border-slate-200 bg-white p-4">
                    <p className="text-xs font-semibold text-[#102A43]">
                      {c.author} · <span className="font-normal text-slate-500">{formatDate(c.date)}</span>
                    </p>
                    <p className="text-sm text-slate-600 mt-1">{c.content}</p>
                  </div>
                ))}
              </div>

              <form onSubmit={handleCommentSubmit} className="rounded-2xl border border-slate-200 bg-white p-5 space-y-3">
                <h4 className="text-xs font-semibold text-[#102A43]">Leave a Question or Note</h4>
                <input
                  type="text"
                  value={commentAuthor}
                  onChange={(e) => setCommentAuthor(e.target.value)}
                  placeholder="Your name"
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm"
                />
                <textarea
                  rows={3}
                  required
                  value={commentBody}
                  onChange={(e) => setCommentBody(e.target.value)}
                  placeholder="Ask about road conditions, packing, or seasonal tips..."
                  className="w-full rounded-xl border border-slate-200 p-3 text-sm"
                />
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#102A43] text-white text-xs font-semibold hover:bg-[#168AAD]"
                >
                  Post Comment
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Related Packages & Articles */}
        {relatedPackages.length > 0 && (
          <div className="pt-8 border-t border-slate-200">
            <h2 className="font-serif text-2xl font-semibold text-[#102A43] mb-5">Featured Itineraries in This Guide</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedPackages.map((p) => (
                <PackageCard key={p.id} pkg={p} />
              ))}
            </div>
          </div>
        )}

        <div className="pt-8 border-t border-slate-200">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-serif text-2xl font-semibold text-[#102A43]">More Field Guides</h2>
            <Link to="/blog" className="inline-flex items-center gap-1 text-xs font-semibold text-[#168AAD]">
              All Articles <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedArticles.map((b) => (
              <BlogCard key={b.id} post={b} />
            ))}
          </div>
        </div>
      </article>
    </div>
  );
};
