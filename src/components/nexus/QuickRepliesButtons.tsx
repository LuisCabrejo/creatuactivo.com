'use client';

import React from 'react';

export interface QuickReply {
  label: string;
  value: string;
  description?: string;
}

interface QuickRepliesButtonsProps {
  replies: QuickReply[];
  onSelect: (value: string, label: string) => void;
}

export default function QuickRepliesButtons({ replies, onSelect }: QuickRepliesButtonsProps) {
  const [selected, setSelected] = React.useState<string | null>(null);

  const handleClick = (reply: QuickReply) => {
    setSelected(reply.value);
    onSelect(reply.value, reply.label);
  };

  // Si ya se seleccionó, no renderizar nada (botones desaparecen)
  if (selected) {
    return null;
  }

  return (
    <div className="my-4 grid grid-cols-1 md:grid-cols-2 gap-3">
      {replies.map((reply) => (
        <button
          key={reply.value}
          onClick={() => handleClick(reply)}
          className="group relative overflow-hidden rounded-lg border border-slate-700/50 bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-sm p-4 text-left transition-all duration-300 hover:scale-[1.02] hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/20"
        >
          {/* Glow effect on hover */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-purple-500/0 to-blue-500/0 opacity-0 transition-opacity duration-300 group-hover:opacity-10" />

          {/* Content */}
          <div className="relative z-10">
            <div className="font-semibold text-white mb-1">
              {reply.label}
            </div>
            {reply.description && (
              <div className="text-xs text-slate-400">
                {reply.description}
              </div>
            )}
          </div>
        </button>
      ))}
    </div>
  );
}
