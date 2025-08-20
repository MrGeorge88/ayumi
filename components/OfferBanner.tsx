'use client';
import { useEffect, useState } from 'react';

export type Offer = {
  type: string;
  value: number;
  description: string;
};

export default function OfferBanner() {
  const [offer, setOffer] = useState<Offer | null>(null);

  useEffect(() => {
    fetch('/api/offers')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && data.description) setOffer(data);
      })
      .catch(() => {});
  }, []);

  if (!offer) return null;

  return (
    <div className="rounded-lg2 bg-babaco p-4 text-center text-sm">
      {offer.description}
    </div>
  );
}
