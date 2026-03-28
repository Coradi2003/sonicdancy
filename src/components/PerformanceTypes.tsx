import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Anchor, Music, Sparkles, PartyPopper, Crown, Disc3, Rewind, Cake, Users } from "lucide-react";

const types = [
  { icon: Anchor, title: "Shows em Navios Piratas", desc: "Performances teatrais no mar" },
  { icon: Music, title: "Casas Noturnas", desc: "Presença de palco de alto impacto" },
  { icon: Disc3, title: "Animação de Pistas", desc: "Energia contagiante na pista de dança" },
  { icon: Rewind, title: "Flashback", desc: "Revivendo os melhores hits com estilo" },
  { icon: Cake, title: "Aniversários", desc: "Shows especiais para celebrações" },
  { icon: Users, title: "Resenhas", desc: "Animação para encontros e festas" },
  { icon: Sparkles, title: "Eventos Temáticos", desc: "Coreografia e figurinos personalizados" },
  { icon: PartyPopper, title: "Festas Privadas", desc: "Entretenimento exclusivo" },
  { icon: Crown, title: "Experiências VIP", desc: "Performances premium sob medida" },
];

const PerformanceTypes = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-24 md:py-32 relative" ref={ref} id="performances">
      <div className="container mx-auto px-6">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-accent font-body text-sm uppercase tracking-[0.3em] mb-4 text-center"
        >
          Serviços
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1 }}
          className="font-display text-3xl md:text-5xl font-bold text-center mb-16"
        >
          Tipos de <span className="text-gradient">Performance</span>
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {types.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.15 * i, duration: 0.6 }}
              className="glass rounded-xl p-6 text-center card-lift cursor-pointer group"
            >
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                <item.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-display text-lg font-bold mb-2">{item.title}</h3>
              <p className="text-muted-foreground text-sm font-light">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PerformanceTypes;
