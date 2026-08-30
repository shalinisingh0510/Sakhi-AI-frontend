"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { AffiliateProduct } from "@/lib/api";

interface AffiliateProductCardProps {
  product: AffiliateProduct;
  className?: string;
}

export function AffiliateProductCard({ product, className = "" }: AffiliateProductCardProps) {
  if (product.status !== "ACTIVE") return null;

  return (
    <a
      href={product.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`group block bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md hover:border-primary-300 dark:hover:border-primary-700 transition-all ${className}`}
    >
      <div className="flex p-4 gap-4 items-center">
        {product.image_url ? (
          <div className="relative w-20 h-20 flex-shrink-0 bg-gray-50 dark:bg-neutral-800 rounded-lg overflow-hidden border border-gray-100 dark:border-neutral-800">
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        ) : (
          <div className="w-20 h-20 flex-shrink-0 bg-primary-50 dark:bg-primary-900/20 rounded-lg border border-primary-100 dark:border-primary-800/50 flex items-center justify-center">
            <span className="text-primary-500 font-bold text-2xl">
              {product.name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-1">
            <h4 className="text-base font-semibold text-gray-900 dark:text-gray-100 truncate pr-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
              {product.name}
            </h4>
            <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-primary-500 flex-shrink-0 transition-colors transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
          {product.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
              {product.description}
            </p>
          )}
          <span className="inline-block px-2 py-0.5 bg-gray-100 dark:bg-neutral-800 text-[10px] text-gray-500 dark:text-gray-400 rounded uppercase tracking-wider font-medium">
            Sponsored Product
          </span>
        </div>
      </div>
      {product.disclosure_text && (
        <div className="bg-gray-50 dark:bg-neutral-900/50 px-4 py-2 border-t border-gray-100 dark:border-neutral-800">
          <p className="text-[10px] text-gray-500 dark:text-gray-500 italic">
            {product.disclosure_text}
          </p>
        </div>
      )}
    </a>
  );
}
