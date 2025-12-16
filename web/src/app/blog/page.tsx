"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export default function BlogIndex() {
    const [posts, setPosts] = useState<any[]>([]);
    const [quote, setQuote] = useState<any>(null);
    const [categories, setCategories] = useState<any[]>([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [postsRes, quoteRes, catsRes] = await Promise.all([
                fetch(`${API_URL}/blog/posts/`),
                fetch(`${API_URL}/blog/quote/daily/`),
                fetch(`${API_URL}/blog/categories/`)
            ]);

            if (postsRes.ok) setPosts(await postsRes.json());
            if (quoteRes.ok) setQuote(await quoteRes.json());
            if (catsRes.ok) setCategories(await catsRes.json());
        } catch (err) {
            console.error("Failed to load blog data");
        }
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <div className="bg-gradient-to-b from-primary/10 to-background pt-24 pb-12 px-4">
                <div className="container mx-auto text-center max-w-3xl">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Celestial <span className="gradient-text">Wisdom</span></h1>
                    {quote && (
                        <div className="glass p-6 rounded-2xl border border-glass-border inline-block max-w-2xl">
                            <p className="text-xl text-gray-200 italic font-serif mb-4">"{quote.text}"</p>
                            <p className="text-primary text-sm font-bold uppercase tracking-widest">— {quote.author}</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                {/* Categories */}
                <div className="flex flex-wrap gap-4 justify-center mb-12">
                    <button className="px-6 py-2 rounded-full bg-white text-background font-bold">All</button>
                    {categories.map(c => (
                        <button key={c.id} className="px-6 py-2 rounded-full glass border border-white/10 text-white hover:bg-white/10 transition-colors">
                            {c.name}
                        </button>
                    ))}
                </div>

                {/* Posts Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {posts.map((post, i) => (
                        <motion.div
                            key={post.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <Link href={`/blog/${post.slug}`} className="block group h-full">
                                <div className="glass rounded-3xl overflow-hidden border border-glass-border h-full hover:border-primary/50 transition-all flex flex-col">
                                    <div className="h-48 bg-surface/50 relative overflow-hidden">
                                        {/* Placeholder Pattern since we might not have images */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 group-hover:scale-110 transition-transform duration-500"></div>
                                        <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-bold text-white border border-white/10">
                                            {post.category?.name}
                                        </div>
                                    </div>
                                    <div className="p-6 flex-1 flex flex-col">
                                        <div className="text-gray-500 text-xs mb-2">{new Date(post.created_at).toLocaleDateString()}</div>
                                        <h2 className="text-xl font-bold text-white mb-3 leading-tight group-hover:text-primary transition-colors">
                                            {post.title}
                                        </h2>
                                        <p className="text-gray-400 text-sm line-clamp-3 mb-4 flex-1">
                                            {post.excerpt}
                                        </p>
                                        <div className="flex items-center gap-2 text-primary text-sm font-bold">
                                            Read Article →
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
