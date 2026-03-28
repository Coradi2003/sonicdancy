import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Star } from "lucide-react";

const testimonials = [
  {
    quote: "Absolutamente hipnotizante. A performance elevou nosso evento a outro nível. Os convidados ainda comentam sobre isso.",
    name: "Marina S.",
    role: "Diretora de Eventos, Espaço de Luxo",
  },
  {
    quote: "Profissional, cativante e inesquecível. Exatamente o que precisávamos para nossa festa VIP de lançamento.",
    name: "Carlos R.",
    role: "Gerente de Casa Noturna",
  },
  {
    quote: "O show no navio pirata foi o destaque da temporada. A energia e a arte superaram todas as expectativas.",
    name: "Ana L.",
    role: "Coordenadora de Entretenimento",
  },
];

const TestimonialsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-24 md:py-32 relative" ref={ref}>
      <div className="section-divider w-full mb-24" />
      <div className="container mx-auto px-6">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-accent font-body text-sm uppercase tracking-[0.3em] mb-4 text-center"
        >
          Depoimentos
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1 }}
          className="font-display text-3xl md:text-5xl font-bold text-center mb-16"
        >
          O Que Nossos Clientes <span className="text-gradient">Dizem</span>
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.15 * i, duration: 0.6 }}
              className="glass rounded-xl p-8 card-lift"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-accent text-accent" />
                ))}
              </div>
              <p className="text-foreground/80 text-sm leading-relaxed mb-6 font-light italic">
                "{t.quote}"
              </p>
              <div>
                <p className="font-display font-bold text-sm">{t.name}</p>
                <p className="text-muted-foreground text-xs">{t.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
