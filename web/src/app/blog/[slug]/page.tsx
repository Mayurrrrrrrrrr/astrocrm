"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export default function BlogPostPage() {
    const params = useParams();
    const [post, setPost] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (params.slug) fetchPost();
    }, [params.slug]);

    const fetchPost = async () => {
        try {
            const res = await fetch(`${API_URL}/blog/posts/${params.slug}/`);
            if (res.ok) setPost(await res.json());
        } catch (err) {
            console.error("Error loading post");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;
    if (!post) return <div className="min-h-screen flex items-center justify-center text-white">Post not found</div>;

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Header */}
            <div className="w-full h-[50vh] relative">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/30 to-background z-10"></div>
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>

                <div className="absolute bottom-0 left-0 right-0 z-20 p-4 pb-12">
                    <div className="container mx-auto max-w-3xl text-center">
                        <Link href="/blog" className="inline-block mb-6 px-4 py-1.5 rounded-full bg-white/10 text-white text-sm hover:bg-white/20 transition-colors">
                            ← Back to Blog
                        </Link>
                        <div className="flex items-center justify-center gap-4 text-sm text-gray-300 mb-4">
                            <span className="bg-primary/20 text-primary px-3 py-1 rounded-lg border border-primary/20 font-bold">
                                {post.category?.name}
                            </span>
                            <span>{new Date(post.created_at).toLocaleDateString()}</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-8">
                            {post.title}
                        </h1>
                        <div className="flex items-center justify-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold">
                                {post.author_name?.[0]}
                            </div>
                            <div className="text-left">
                                <p className="text-white font-medium">{post.author_name}</p>
                                <p className="text-xs text-gray-500">Astrology Expert</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <article className="container mx-auto max-w-3xl px-4 relative z-20">
                <div className="glass rounded-3xl p-8 md:p-12 border border-glass-border shadow-2xl">
                    <div className="prose prose-invert prose-lg max-w-none">
                        {/* We simple split by newline for now to mimic paragraphs */}
                        {post.content.split('\n').map((para: string, i: number) => (
                            para.trim() && <p key={i} className="mb-6 leading-relaxed text-gray-300">{para}</p>
                        ))}
                    </div>

                    <div className="mt-12 pt-12 border-t border-white/10">
                        <h3 className="text-white font-bold mb-4">Share this wisdom</h3>
                        <div className="flex gap-4">
                            {['Facebook', 'Twitter', 'WhatsApp'].map(platform => (
                                <button key={platform} className="px-6 py-2 glass rounded-xl text-sm font-medium hover:bg-white/10 transition-colors text-white">
                                    {platform}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </article>
        </div>
    );
}
