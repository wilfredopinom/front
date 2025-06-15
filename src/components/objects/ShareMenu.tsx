import React, { useState } from 'react';
import { Share2, Copy, Mail, Facebook, MessageCircle, Check } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface ShareMenuProps {
  url: string;
  title: string;
}

const ShareMenu: React.FC<ShareMenuProps> = ({ url, title }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareOptions = [
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      action: () => {
        const text = `¡Mira este objeto perdido en Vigo! ${title} - ${url}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
      }
    },
    {
      name: 'Correo',
      icon: Mail,
      action: () => {
        const subject = `Objeto perdido en Vigo: ${title}`;
        const body = `¡Hola! Te comparto este objeto perdido en Vigo:\n\n${title}\n${url}`;
        window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      }
    },
    {
      name: 'Facebook',
      icon: Facebook,
      action: () => {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
      }
    }
  ];

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success('Enlace copiado al portapapeles');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Error al copiar el enlace');
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="glass-card px-3 py-2 text-blue-300 hover:text-blue-400 transition-colors duration-300 inline-flex items-center hover-glow"
      >
        <Share2 className="h-4 w-4 mr-2" />
        Compartir
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
          <div className="py-1" role="menu" aria-orientation="vertical">
            {shareOptions.map((option) => {
              const Icon = option.icon;
              return (
                <button
                  key={option.name}
                  onClick={() => {
                    option.action();
                    setIsOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                  role="menuitem"
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {option.name}
                </button>
              );
            })}
            <button
              onClick={() => {
                copyToClipboard();
                setIsOpen(false);
              }}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
              role="menuitem"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-2 text-green-500" />
                  Copiado
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Copiar enlace
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShareMenu; 