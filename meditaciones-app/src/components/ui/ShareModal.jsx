import React, { useState } from 'react';
import { useAudio } from '../../context/AudioContext';
import { X, Copy, Check, MessageCircle, Share2 } from 'lucide-react';

export const ShareModal = () => {
  const { isShareModalOpen, setIsShareModalOpen, shareTarget, showToast } = useAudio();
  const [copied, setCopied] = useState(false);

  if (!isShareModalOpen || !shareTarget) return null;

  const currentUrl = window.location.href;
  const shareText = `Escucha "${shareTarget.title}" en Zenith Mind Meditaciones: ${currentUrl}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    showToast("Enlace copiado al portapapeles");
    setTimeout(() => setCopied(false), 2000);
  };

  const shareToWhatsApp = () => {
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-midnight-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md p-6 bg-midnight-900 border border-amberGlow-500/20 rounded-3xl shadow-2xl glass-card text-white">
        <button
          onClick={() => setIsShareModalOpen(false)}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800/60 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-4">
          <div className="p-3 rounded-2xl bg-amberGlow-500/10 text-amberGlow-400 border border-amberGlow-500/20">
            <Share2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Compartir Meditación</h3>
            <p className="text-xs text-slate-400">Regala momentos de calma y serenidad</p>
          </div>
        </div>

        <div className="p-4 mb-6 rounded-2xl bg-midnight-950/60 border border-slate-800 flex items-center space-x-3">
          <img
            src={shareTarget.cover_url}
            alt={shareTarget.title}
            className="w-14 h-14 rounded-xl object-cover border border-slate-700"
          />
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-amberGlow-100 truncate">{shareTarget.title}</h4>
            <p className="text-xs text-slate-400 truncate">{shareTarget.instructor_name}</p>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={shareToWhatsApp}
            className="w-full flex items-center justify-center space-x-3 py-3 px-4 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 font-medium transition"
          >
            <MessageCircle className="w-5 h-5" />
            <span>Compartir por WhatsApp</span>
          </button>

          <button
            onClick={copyToClipboard}
            className="w-full flex items-center justify-center space-x-3 py-3 px-4 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700 font-medium transition"
          >
            {copied ? <Check className="w-5 h-5 text-amberGlow-400" /> : <Copy className="w-5 h-5" />}
            <span>{copied ? '¡Enlace Copiado!' : 'Copiar Enlace Directo'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
