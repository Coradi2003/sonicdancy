import { MessageCircle } from "lucide-react";

const StickyWhatsApp = () => {
  return (
    <a
      href="https://wa.me/5547992626926"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-green-500 flex items-center justify-center shadow-lg shadow-green-500/30 hover:scale-110 transition-transform"
      aria-label="Contato via WhatsApp"
    >
      <MessageCircle className="w-6 h-6 text-primary-foreground" />
    </a>
  );
};

export default StickyWhatsApp;
