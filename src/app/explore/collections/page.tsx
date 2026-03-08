"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Layers, Search, ArrowRight, Sparkles, TrendingUp,
  Clock, Star, Filter, ChevronRight, Loader2
} from "lucide-react";

interface CategoryItem {
  name: string;
  slug: string;
  productCount: number;
  gradient: string;
  description: string;
  featured: boolean;
}

// Rotate through gradient colors for categories
const GRADIENT_POOL = [
  "from-purple-600 to-indigo-600",
  "from-moulna-gold to-amber-500",
  "from-emerald-600 to-teal-600",
  "from-rose-600 to-pink-600",
  "from-orange-600 to-red-600",
  "from-violet-600 to-purple-600",
  "from-yellow-500 to-orange-500",
  "from-green-600 to-emerald-600",
  "from-cyan-500 to-blue-500",
  "from-pink-500 to-rose-500",
  "from-slate-600 to-gray-700",
  "from-lime-500 to-green-500",
  "from-indigo-500 to-blue-500",
  "from-red-500 to-rose-500",
];

export default function CollectionsPage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [collections, setCollections] = React.useState<CategoryItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchCategories() {
      setIsLoading(true);
      try {
        const res = await fetch("/api/categories");
        if (res.ok) {
          const data = await res.json();
          const mapped: CategoryItem[] = (data.categories || []).map(
            (cat: { name: string; slug: string; productCount: number }, index: number) => ({
              name: cat.name,
              slug: cat.slug,
              productCount: cat.productCount,
              gradient: GRADIENT_POOL[index % GRADIENT_POOL.length],
              description: `Explore ${cat.productCount} product${cat.productCount !== 1 ? "s" : ""} in ${cat.name}`,
              featured: index < 3,
            })
          );
          setCollections(mapped);
        }
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchCategories();
  }, []);

  const featuredCollections = collections.filter((c) => c.featured);
  const allCollections = collections.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/30 to-background">
      {/* Hero Section */}
      <section className="relative py-16 bg-gradient-to-r from-moulna-charcoal to-slate-800 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 border border-moulna-gold rounded-full" />
          <div className="absolute bottom-10 right-20 w-48 h-48 border border-moulna-gold/50 rounded-full" />
          <div className="absolute top-1/2 left-1/3 w-24 h-24 border border-white/30 rounded-full" />
        </div>
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl"
          >
            <Badge className="mb-4 bg-moulna-gold/20 text-moulna-gold border-moulna-gold/30">
              <Layers className="w-3 h-3 me-1" />
              Curated Collections
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Discover Curated
              <span className="text-moulna-gold block">Collections</span>
            </h1>
            <p className="text-lg text-gray-300 mb-6">
              Explore handpicked selections of authentic Arabian products,
              carefully curated to help you find exactly what you&apos;re looking for.
            </p>
            <div className="relative max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search collections..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="ps-12 h-12 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              />
            </div>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Loading State */}
        {isLoading ? (
          <div className="space-y-16">
            {/* Featured skeleton */}
            <section>
              <div className="mb-8">
                <div className="h-7 w-56 bg-muted rounded animate-pulse mb-2" />
                <div className="h-4 w-72 bg-muted rounded animate-pulse" />
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Card key={i} className="h-64 animate-pulse bg-muted" />
                ))}
              </div>
            </section>
            {/* All collections skeleton */}
            <section>
              <div className="mb-8">
                <div className="h-7 w-40 bg-muted rounded animate-pulse mb-2" />
                <div className="h-4 w-48 bg-muted rounded animate-pulse" />
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <Card key={i} className="overflow-hidden animate-pulse">
                    <div className="h-32 bg-muted" />
                    <div className="p-4 space-y-2">
                      <div className="h-4 w-3/4 bg-muted rounded" />
                      <div className="h-3 w-full bg-muted rounded" />
                      <div className="h-3 w-1/3 bg-muted rounded" />
                    </div>
                  </Card>
                ))}
              </div>
            </section>
          </div>
        ) : collections.length === 0 ? (
          <div className="text-center py-16">
            <Layers className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No collections yet</h3>
            <p className="text-muted-foreground">
              Collections will appear as products are added to the marketplace.
            </p>
          </div>
        ) : (
          <>
            {/* Featured Collections */}
            {!searchQuery && featuredCollections.length > 0 && (
              <section className="mb-16">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                      <Sparkles className="w-6 h-6 text-moulna-gold" />
                      Featured Collections
                    </h2>
                    <p className="text-muted-foreground">
                      Our most popular curated selections
                    </p>
                  </div>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                  {featuredCollections.map((collection, index) => (
                    <motion.div
                      key={collection.slug}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link href={`/explore?category=${encodeURIComponent(collection.name)}`}>
                        <Card className="group relative h-64 overflow-hidden cursor-pointer">
                          <div className={cn(
                            "absolute inset-0 bg-gradient-to-br",
                            collection.gradient
                          )} />
                          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
                          <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                            <Badge className="w-fit mb-2 bg-white/20 text-white border-0">
                              <Star className="w-3 h-3 me-1" />
                              Featured
                            </Badge>
                            <h3 className="text-2xl font-bold mb-2">{collection.name}</h3>
                            <p className="text-white/80 mb-3">{collection.description}</p>
                            <div className="flex items-center justify-between">
                              <span className="text-sm">{collection.productCount} items</span>
                              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </div>
                          </div>
                        </Card>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </section>
            )}

            {/* All Collections */}
            <section>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold">
                    {searchQuery ? `Search Results` : `All Collections`}
                  </h2>
                  <p className="text-muted-foreground">
                    {allCollections.length} collections found
                  </p>
                </div>
                <Button variant="outline">
                  <Filter className="w-4 h-4 me-2" />
                  Filter
                </Button>
              </div>
              {allCollections.length === 0 ? (
                <div className="text-center py-12">
                  <Search className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
                  <p className="text-muted-foreground">No collections match your search.</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {allCollections.map((collection, index) => (
                    <motion.div
                      key={collection.slug}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link href={`/explore?category=${encodeURIComponent(collection.name)}`}>
                        <Card className="group overflow-hidden cursor-pointer hover:shadow-lg transition-shadow">
                          <div className={cn(
                            "h-32 bg-gradient-to-br",
                            collection.gradient
                          )} />
                          <div className="p-4">
                            <h3 className="font-semibold mb-1 group-hover:text-moulna-gold transition-colors">
                              {collection.name}
                            </h3>
                            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                              {collection.description}
                            </p>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">
                                {collection.productCount} items
                              </span>
                              <ChevronRight className="w-4 h-4 text-moulna-gold group-hover:translate-x-1 transition-transform" />
                            </div>
                          </div>
                        </Card>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}

        {/* Create Your Collection CTA */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <Card className="p-8 bg-gradient-to-r from-moulna-gold/10 to-amber-500/10 border-moulna-gold/20">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-moulna-gold/20 flex items-center justify-center">
                <Sparkles className="w-10 h-10 text-moulna-gold" />
              </div>
              <div className="flex-1 text-center md:text-start">
                <h3 className="text-xl font-bold mb-2">Create Your Own Wishlist</h3>
                <p className="text-muted-foreground">
                  Save your favorite items and create personalized collections to share with friends and family.
                </p>
              </div>
              <Button className="bg-moulna-gold hover:bg-moulna-gold-dark">
                Start Collecting
                <ArrowRight className="w-4 h-4 ms-2" />
              </Button>
            </div>
          </Card>
        </motion.section>
      </div>
    </div>
  );
}
