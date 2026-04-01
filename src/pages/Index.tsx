import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import PerformanceTypes from "@/components/PerformanceTypes";
import GallerySection from "@/components/GallerySection";
import DifferentialsSection from "@/components/DifferentialsSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import FinalCTA from "@/components/FinalCTA";
import StickyWhatsApp from "@/components/StickyWhatsApp";
import ParticlesBackground from "@/components/ParticlesBackground";

const Index = () => {
  return (
    <div className="min-h-screen bg-background relative">
      <ParticlesBackground />
      <Navbar />
      <HeroSection />
      <AboutSection />
      <PerformanceTypes />
      <GallerySection />
      <DifferentialsSection />
      <TestimonialsSection />
      <FinalCTA />
      <StickyWhatsApp />

      {/* Footer */}
      <footer className="py-8 border-t border-border/30">
        <div className="container mx-auto px-6 text-center">
          <p className="text-muted-foreground text-sm font-light">
            © {new Date().getFullYear()} SONIKDANCEYBC. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
