import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Play } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { supabase, MediaItem } from "@/lib/supabase";

const GallerySection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [selectedMedia, setSelectedMedia] = useState<{ url: string; type: string } | null>(null);
  const [adminMedia, setAdminMedia] = useState<MediaItem[]>([]);

  useEffect(() => {
    loadMedia();
    
    // Realtime subscription para atualizar automaticamente
    const channel = supabase
      .channel('media_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'media_items' },
        () => {
          loadMedia();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadMedia = async () => {
    try {
      const { data, error } = await supabase
        .from("media_items")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(20); // Limitar a 20 itens para melhor performance

      if (error) throw error;
      setAdminMedia(data || []);
    } catch (error) {
      console.error("Error loading media:", error);
    }
  };

  const allMedia = adminMedia.map((item) => ({
    url: item.type === "youtube" 
      ? item.url
      : item.url,
    type: item.type,
    id: item.id,
  }));

  return (
    <section className="py-24 md:py-32 relative" ref={ref} id="gallery">
      <div className="section-divider w-full mb-24" />
      <div className="container mx-auto px-6">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-accent font-body text-sm uppercase tracking-[0.3em] mb-4 text-center"
        >
          Portfólio
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1 }}
          className="font-display text-3xl md:text-5xl font-bold text-center mb-16"
        >
          Galeria <span className="text-gradient">Visual</span>
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4"
        >
          {allMedia.map((media, i) => (
            <motion.div
              key={media.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.1 * i }}
              className="aspect-[9/16] rounded-xl overflow-hidden relative group cursor-pointer"
              onClick={() => setSelectedMedia({ url: media.url, type: media.type })}
            >
              {media.type === "youtube" ? (
                <div className="w-full h-full relative">
                  <img
                    src={`https://img.youtube.com/vi/${media.url}/maxresdefault.jpg`}
                    alt="YouTube thumbnail"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                    <Play className="w-10 h-10 text-white/80 group-hover:text-white group-hover:scale-110 transition-all" />
                  </div>
                </div>
              ) : media.type === "image" ? (
                <div className="w-full h-full relative">
                  <img
                    src={media.url}
                    alt="Gallery"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.svg";
                    }}
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                    <Play className="w-10 h-10 text-white/80 group-hover:text-white group-hover:scale-110 transition-all" />
                  </div>
                </div>
              ) : (
                <>
                  <video
                    src={media.url}
                    muted
                    playsInline
                    preload="metadata"
                    className="w-full h-full object-cover"
                    onMouseEnter={(e) => e.currentTarget.play()}
                    onMouseLeave={(e) => {
                      e.currentTarget.pause();
                      e.currentTarget.currentTime = 0;
                    }}
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                    <Play className="w-10 h-10 text-white/80 group-hover:text-white group-hover:scale-110 transition-all" />
                  </div>
                </>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>

      <Dialog open={!!selectedMedia} onOpenChange={() => setSelectedMedia(null)}>
        <DialogContent className="max-w-3xl bg-black border-border/30 p-2">
          {selectedMedia && (
            <>
              {selectedMedia.type === "youtube" ? (
                <iframe
                  src={`https://www.youtube.com/embed/${selectedMedia.url}?autoplay=1`}
                  className="w-full aspect-video rounded-lg"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : selectedMedia.type === "image" ? (
                <img
                  src={selectedMedia.url}
                  alt="Gallery"
                  className="w-full rounded-lg"
                />
              ) : (
                <video
                  src={selectedMedia.url}
                  controls
                  autoPlay
                  playsInline
                  className="w-full rounded-lg"
                />
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default GallerySection;
