import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trash2, Plus, LogOut, Eye, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase, MediaItem } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";

const Admin = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [newUrl, setNewUrl] = useState("");
  const [activeTab, setActiveTab] = useState<"youtube" | "image">("youtube");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    checkUser();
    
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        checkAdminStatus(session.user.id);
      } else {
        setIsAdmin(false);
        setLoading(false);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (isAdmin) {
      loadMedia();
    }
  }, [isAdmin]);

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        await checkAdminStatus(user.id);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error("Error checking user:", error);
      setLoading(false);
    }
  };

  const checkAdminStatus = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", userId)
        .single();

      if (error) throw error;
      
      setIsAdmin(data?.is_admin ?? false);
      
      if (!data?.is_admin) {
        toast.error("Acesso negado! Você não é um administrador. Execute no SQL: UPDATE profiles SET is_admin = TRUE WHERE email = 'seu-email';");
        await supabase.auth.signOut();
      }
    } catch (error) {
      console.error("Error checking admin status:", error);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  const loadMedia = async () => {
    try {
      const { data, error } = await supabase
        .from("media_items")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setMediaItems(data || []);
    } catch (error) {
      console.error("Error loading media:", error);
      toast.error("Erro ao carregar mídia");
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        await checkAdminStatus(data.user.id);
        toast.success("Login realizado com sucesso!");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error.message || "Erro ao fazer login");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setIsAdmin(false);
      setEmail("");
      setPassword("");
      toast.success("Logout realizado com sucesso!");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Erro ao fazer logout");
    }
  };

  const extractYouTubeId = (url: string): string | null => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /^([a-zA-Z0-9_-]{11})$/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  const handleAddMedia = async () => {
    if (!newUrl.trim()) {
      toast.error("Por favor, insira uma URL!");
      return;
    }

    if (!user) {
      toast.error("Você precisa estar logado!");
      return;
    }

    setIsSubmitting(true);

    try {
      let processedUrl = newUrl.trim();
      let type: "youtube" | "image" = activeTab;

      if (type === "youtube") {
        const videoId = extractYouTubeId(processedUrl);
        if (!videoId) {
          toast.error("URL do YouTube inválida!");
          return;
        }
        processedUrl = videoId;
      }

      const { error } = await supabase
        .from("media_items")
        .insert({
          url: processedUrl,
          type,
          user_id: user.id,
        });

      if (error) throw error;

      setNewUrl("");
      await loadMedia();
      toast.success("Mídia adicionada com sucesso!");
    } catch (error: any) {
      console.error("Error adding media:", error);
      toast.error(error.message || "Erro ao adicionar mídia");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("media_items")
        .delete()
        .eq("id", id);

      if (error) throw error;

      await loadMedia();
      toast.success("Mídia removida!");
    } catch (error: any) {
      console.error("Error deleting media:", error);
      toast.error(error.message || "Erro ao remover mídia");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Admin Login</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isSubmitting}
              />
              <Input
                type="password"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isSubmitting}
              />
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Entrando...
                  </>
                ) : (
                  "Entrar"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  const youtubeItems = mediaItems.filter((item) => item.type === "youtube");
  const imageItems = mediaItems.filter((item) => item.type === "image");

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container mx-auto max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Painel Administrativo</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Logado como: {user.email}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate("/")}>
              <Eye className="w-4 h-4 mr-2" />
              Ver Site
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Adicionar Nova Mídia</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "youtube" | "image")}>
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="youtube">Vídeo YouTube</TabsTrigger>
                <TabsTrigger value="image">Foto (URL)</TabsTrigger>
              </TabsList>
              
              <TabsContent value="youtube" className="space-y-4">
                <Input
                  placeholder="Cole a URL do YouTube ou ID do vídeo"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !isSubmitting && handleAddMedia()}
                  disabled={isSubmitting}
                />
                <p className="text-sm text-muted-foreground">
                  Exemplos: https://youtube.com/watch?v=VIDEO_ID ou https://youtu.be/VIDEO_ID
                </p>
              </TabsContent>
              
              <TabsContent value="image" className="space-y-4">
                <Input
                  placeholder="Cole a URL da imagem"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !isSubmitting && handleAddMedia()}
                  disabled={isSubmitting}
                />
                <p className="text-sm text-muted-foreground">
                  Cole a URL completa da imagem (ex: https://exemplo.com/imagem.jpg)
                </p>
              </TabsContent>
            </Tabs>
            
            <Button onClick={handleAddMedia} className="w-full mt-4" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Adicionando...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Vídeos do YouTube ({youtubeItems.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 max-h-[600px] overflow-y-auto">
              {youtubeItems.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  Nenhum vídeo adicionado
                </p>
              ) : (
                youtubeItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 p-3 border rounded-lg">
                    <img
                      src={`https://img.youtube.com/vi/${item.url}/mqdefault.jpg`}
                      alt="Thumbnail"
                      className="w-24 h-16 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-mono truncate">{item.url}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(item.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDelete(item.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Fotos ({imageItems.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 max-h-[600px] overflow-y-auto">
              {imageItems.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  Nenhuma foto adicionada
                </p>
              ) : (
                imageItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 p-3 border rounded-lg">
                    <img
                      src={item.url}
                      alt="Preview"
                      className="w-24 h-16 object-cover rounded"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.svg";
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm truncate">{item.url}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(item.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDelete(item.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Admin;
