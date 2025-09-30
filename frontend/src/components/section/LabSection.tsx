import { useState } from 'react';
import Card from '@/components/section/Card';
import { labs } from '@/data/labs';

const FILTERS = ['all', 'available', 'in use', 'booked'] as const;
type FilterType = typeof FILTERS[number];

export default function LabSection() {
  const [filter, setFilter] = useState<FilterType>('all');

  const filteredLabs = filter === 'all'
    ? labs
    : labs.filter(l => l.status === filter);

  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      {/* === Filter Buttons === */}
      <div className="flex flex-wrap justify-center gap-3 mb-6">
        {FILTERS.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition
              ${filter === f
                ? 'bg-cyan-600 text-white'
                : 'bg-white text-cyan-600 border border-cyan-600 hover:bg-cyan-50'}`}
          >
            {f.toUpperCase()}
          </button>
        ))}
      </div>

      {/* === Cards === */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredLabs.map((lab, i) => (
          <Card key={i} {...lab} />
        ))}
      </div>
    </section>
  );
}
