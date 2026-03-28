import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Flame, Eye, Shuffle, Award, Fingerprint } from "lucide-react";

const items = [
  { icon: Flame, title: "Forte Presença de Palco", desc: "Comandando a atenção do primeiro ao último momento." },
  { icon: Eye, title: "Visual de Alto Impacto", desc: "Figurinos, movimentos e coreografias deslumbrantes feitas para hipnotizar." },
  { icon: Shuffle, title: "Adaptabilidade", desc: "Encaixando-se perfeitamente em qualquer ambiente, de espaços intimistas a grandes palcos." },
  { icon: Award, title: "Entrega Profissional", desc: "Confiabilidade, pontualidade e excelência em cada performance." },
  { icon: Fingerprint, title: "Identidade Artística Única", desc: "Um estilo marcante que diferencia cada show." },
];

const DifferentialsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-24 md:py-32 relative" ref={ref}>
      <div className="section-divider w-full mb-24" />
      <div className="container mx-auto px-6 max-w-4xl">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-accent font-body text-sm uppercase tracking-[0.3em] mb-4 text-center"
        >
          Diferenciais
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1 }}
          className="font-display text-3xl md:text-5xl font-bold text-center mb-16"
        >
          O Que Nos Torna <span className="text-gradient">Únicos</span>
        </motion.h2>

        <div className="space-y-6">
          {items.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.12 * i, duration: 0.6 }}
              className="flex items-start gap-5 glass rounded-xl p-6 card-lift"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <item.icon className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h3 className="font-display text-lg font-bold mb-1">{item.title}</h3>
                <p className="text-muted-foreground text-sm font-light">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DifferentialsSection;
