import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { BlogPost } from '../../types';
import { formatDate } from '../../utils/format';
import { SafeImage } from '../common/SafeImage';

export const BlogCard: React.FC<{ post: BlogPost }> = ({ post }) => {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-shadow hover:shadow-md h-full">
      <Link to={`/blog/${post.slug}`} className="aspect-[4/3] overflow-hidden bg-slate-100">
        <SafeImage
          src={post.coverImage}
          alt={post.title}
          fallbackTitle={post.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </Link>
      <div className="flex flex-1 flex-col justify-between p-5">
        <div>
          <p className="text-xs font-medium text-[#168AAD] mb-1.5">
            {post.category} · {formatDate(post.publishDate)} · {post.readingTime}
          </p>
          <Link to={`/blog/${post.slug}`}>
            <h3 className="font-serif text-xl font-semibold text-[#102A43] group-hover:text-[#168AAD] transition-colors line-clamp-2">
              {post.title}
            </h3>
          </Link>
          <p className="mt-2 text-sm text-slate-600 line-clamp-2 leading-relaxed">{post.excerpt}</p>
        </div>

        <div className="mt-4 flex items-center justify-between pt-3.5 border-t border-slate-100">
          <div className="flex items-center gap-2.5 min-w-0">
            <SafeImage
              src={post.author.avatar}
              alt={post.author.name}
              className="w-7 h-7 rounded-full object-cover shrink-0"
            />
            <span className="text-xs font-medium text-slate-600 truncate">{post.author.name}</span>
          </div>
          <Link
            to={`/blog/${post.slug}`}
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#102A43] hover:text-[#168AAD] transition-colors whitespace-nowrap shrink-0"
          >
            Read More <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
};
