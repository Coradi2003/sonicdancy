import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { MessageCircle, CalendarCheck } from "lucide-react";

const FinalCTA = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-24 md:py-32 relative overflow-hidden" ref={ref} id="contact">
      {/* Background glow */}
      <div className="absolute inset-0 gradient-cta opacity-10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/10 blur-[150px]" />

      <div className="relative container mx-auto px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="font-display text-4xl md:text-6xl font-bold mb-6"
        >
          Leve seu evento para o{" "}
          <span className="text-gradient">próximo nível</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-muted-foreground text-lg md:text-xl max-w-xl mx-auto mb-10 font-light"
        >
          Agende uma performance que as pessoas vão lembrar.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <a
            href="https://wa.me/5547992626926"
            target="_blank"
            rel="noopener noreferrer"
            className="glow-button flex items-center gap-2 px-8 py-4 rounded-lg bg-green-600 text-primary-foreground font-body font-semibold text-lg"
          >
            <MessageCircle className="w-5 h-5" />
            WhatsApp
          </a>
          <a
            href="#contact"
            className="flex items-center gap-2 px-8 py-4 rounded-lg glass text-foreground font-body font-medium hover:bg-secondary/80 transition-all"
          >
            <CalendarCheck className="w-5 h-5 text-accent" />
            Verificar Disponibilidade
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default FinalCTA;
