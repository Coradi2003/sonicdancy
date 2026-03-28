import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import heroImage from "@/assets/hero-pirate-ship.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Barco pirata com iluminação cinematográfica"
          className="w-full h-full object-cover"
          width={1920}
          height={1080}
        />
        <div className="overlay-dark absolute inset-0" />
      </div>

      {/* Glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/10 blur-[120px] animate-glow-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-accent/10 blur-[100px] animate-glow-pulse" style={{ animationDelay: "1.5s" }} />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-accent font-body text-sm uppercase tracking-[0.3em] mb-6"
        >
          Artista de Performance Profissional
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-display text-3xl sm:text-5xl md:text-7xl font-bold leading-tight max-w-4xl mx-auto mb-6"
        >
          Performance que transforma qualquer evento em um{" "}
          <span className="text-gradient">espetáculo</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-muted-foreground text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-10 font-light"
        >
          Performances profissionais para navios piratas, casas noturnas, animação de pistas, flashbacks, aniversários, resenhas e eventos temáticos.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <a
            href="#contact"
            className="glow-button w-full sm:w-auto px-8 py-4 rounded-lg bg-primary text-primary-foreground font-body font-semibold text-lg tracking-wide"
          >
            Agende Agora
          </a>
          <a
            href="https://wa.me/5547992626926"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 rounded-lg glass text-foreground font-body font-medium hover:bg-secondary/80 transition-all"
          >
            <MessageCircle className="w-5 h-5 text-green-400" />
            WhatsApp
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex justify-center pt-2">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1.5 h-1.5 rounded-full bg-accent"
          />
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
