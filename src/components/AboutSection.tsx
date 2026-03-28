import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import dancerReal from "@/assets/dancer-real.jpg";

const AboutSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-24 md:py-32 relative" ref={ref}>
      <div className="section-divider w-full mb-24" />
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16">
          {/* Photo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8 }}
            className="flex-shrink-0"
          >
            <div className="relative w-full max-w-[280px] aspect-square md:w-80 md:h-80 rounded-2xl overflow-hidden glow-purple mx-auto md:mx-0">
              <img
                src={dancerReal}
                alt="Performer profissional"
                loading="lazy"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
            </div>
          </motion.div>

          {/* Text */}
          <div className="text-center md:text-left">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="text-accent font-body text-sm uppercase tracking-[0.3em] mb-4"
            >
              Sobre
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-display text-2xl sm:text-3xl md:text-5xl font-bold mb-8"
            >
              Mais que dança — uma{" "}
              <span className="text-gradient">experiência</span> completa
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-muted-foreground text-base sm:text-lg md:text-xl leading-relaxed font-light"
            >
              Uma experiência de performance completa, projetada para cativar o público e elevar
              a atmosfera de qualquer evento. Cada movimento é pensado para contar uma história,
              cada entrada criada para deixar uma impressão duradoura. Isso é arte que se move —
              e que move todos que assistem.
            </motion.p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
