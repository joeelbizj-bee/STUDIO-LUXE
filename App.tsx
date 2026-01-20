
import React, { useState, useCallback } from 'react';
import { ImageState } from './types';
import { GeminiService } from './services/geminiService';
import { ImageInput } from './components/ImageInput';
import { Button } from './components/Button';
import { Sparkles, Trash2, Download, ExternalLink, RefreshCw } from 'lucide-react';

const App: React.FC = () => {
  const [state, setState] = useState<ImageState>({
    original: null,
    transformed: null,
    isLoading: false,
    error: null,
  });

  const handleImageSelect = (base64: string) => {
    setState(prev => ({ ...prev, original: base64, transformed: null, error: null }));
  };

  const handleTransform = async () => {
    if (!state.original) return;

    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const gemini = new GeminiService();
      // Refined prompt based on user request
      const prompt = `Transform the person in this photo into a sharp, handsome portrait. 
      CRITICAL: Preserve the exact facial structure and likeness of the person in the source image. 
      STYLING: Dress the subject in minimalist luxury fashion (high-end tailored wool overcoat, sleek turtleneck, or bespoke linen blazer in muted tones like charcoal, cream, or sand). 
      ACCESSORY: Add a stylish, contemporary 'cowboy kofia' - a fusion of a structured western cowboy hat brim with a traditional, elegantly embroidered kofia crown. 
      LIGHTING: Professional studio rim lighting, cinematic shadows, high contrast but soft skin texture. 
      ENVIRONMENT: Clean, neutral studio background with subtle depth. 
      QUALITY: Ultra-high detail, 8k resolution, magazine-style professional photography.`;

      const result = await gemini.transformImage(state.original, prompt);
      setState(prev => ({ ...prev, transformed: result, isLoading: false }));
    } catch (err: any) {
      setState(prev => ({ ...prev, error: err.message, isLoading: false }));
    }
  };

  const reset = () => {
    setState({
      original: null,
      transformed: null,
      isLoading: false,
      error: null,
    });
  };

  const downloadResult = () => {
    if (!state.transformed) return;
    const link = document.createElement('a');
    link.href = state.transformed;
    link.download = 'luxury-portrait-result.png';
    link.click();
  };

  return (
    <div className="min-h-screen flex flex-col items-center">
      {/* Navigation */}
      <nav className="w-full max-w-7xl px-6 py-8 flex justify-between items-center z-10">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center rotate-3">
            <Sparkles className="text-black w-6 h-6" />
          </div>
          <span className="text-2xl font-serif tracking-tight font-bold ml-2">STUDIO LUXE</span>
        </div>
        <div className="hidden md:flex gap-8 text-sm font-medium text-neutral-400">
          <a href="#" className="hover:text-white transition-colors">Portfolios</a>
          <a href="#" className="hover:text-white transition-colors">Styles</a>
          <a href="#" className="hover:text-white transition-colors">About</a>
        </div>
        <Button variant="outline" className="hidden md:flex">Sign In</Button>
      </nav>

      {/* Hero / Main Content */}
      <main className="flex-1 w-full max-w-6xl px-6 py-12 flex flex-col items-center">
        {!state.original ? (
          <div className="text-center space-y-12 max-w-2xl mt-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="space-y-4">
              <span className="text-xs uppercase tracking-[0.3em] text-neutral-500 font-semibold">The Future of Portraiture</span>
              <h1 className="text-5xl md:text-7xl font-serif font-medium leading-tight italic">
                Refine Your <span className="not-italic">Persona</span>
              </h1>
              <p className="text-neutral-400 text-lg leading-relaxed max-w-lg mx-auto">
                Upload your photo and let our AI artisan redefine you with luxury fashion, bespoke accessories, and cinematic studio lighting.
              </p>
            </div>
            
            <ImageInput onImageSelect={handleImageSelect} />
            
            <div className="flex flex-wrap justify-center gap-6 pt-8 grayscale opacity-50">
              <span className="text-xs font-medium uppercase tracking-widest">Minimalist</span>
              <span className="text-xs font-medium uppercase tracking-widest">Luxury</span>
              <span className="text-xs font-medium uppercase tracking-widest">Couture</span>
            </div>
          </div>
        ) : (
          <div className="w-full space-y-8 animate-in fade-in duration-500">
            {/* Action Bar */}
            <div className="flex justify-between items-center">
              <button 
                onClick={reset}
                className="flex items-center gap-2 text-neutral-500 hover:text-white transition-colors text-sm"
              >
                <Trash2 size={16} />
                Start Over
              </button>
              
              {!state.transformed && (
                <Button 
                  onClick={handleTransform} 
                  isLoading={state.isLoading}
                >
                  <RefreshCw className={`w-5 h-5 ${state.isLoading ? 'animate-spin' : ''}`} />
                  Generate Portrait
                </Button>
              )}
            </div>

            {/* Results Grid */}
            <div className={`grid grid-cols-1 ${state.transformed ? 'md:grid-cols-2' : 'max-w-xl mx-auto'} gap-8`}>
              {/* Original */}
              <div className="space-y-4">
                <div className="relative aspect-[3/4] rounded-3xl overflow-hidden border border-neutral-800 bg-neutral-900 shadow-2xl">
                  <img 
                    src={state.original} 
                    alt="Original" 
                    className="w-full h-full object-cover opacity-60 grayscale hover:grayscale-0 transition-all duration-700" 
                  />
                  <div className="absolute top-6 left-6 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-[10px] uppercase tracking-widest border border-white/10">
                    Source Image
                  </div>
                </div>
              </div>

              {/* Transformed */}
              {(state.transformed || state.isLoading) && (
                <div className="space-y-4 animate-in slide-in-from-right-4 duration-700">
                  <div className="relative aspect-[3/4] rounded-3xl overflow-hidden border border-neutral-800 bg-neutral-900 shadow-2xl flex items-center justify-center">
                    {state.isLoading ? (
                      <div className="text-center space-y-6 flex flex-col items-center">
                        <div className="relative w-20 h-20">
                          <div className="absolute inset-0 rounded-full border-2 border-white/5 animate-ping"></div>
                          <div className="absolute inset-2 rounded-full border-t-2 border-white animate-spin"></div>
                          <Sparkles className="absolute inset-0 m-auto w-8 h-8 text-white animate-pulse" />
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-white">Developing your portrait...</p>
                          <p className="text-xs text-neutral-500 max-w-[200px]">Tailoring garments and sculpting light for the perfect aesthetic.</p>
                        </div>
                      </div>
                    ) : (
                      <>
                        <img 
                          src={state.transformed!} 
                          alt="Transformed" 
                          className="w-full h-full object-cover animate-in fade-in duration-1000" 
                        />
                        <div className="absolute top-6 right-6 bg-white text-black px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-bold shadow-xl">
                          Studio Result
                        </div>
                        
                        <div className="absolute bottom-6 left-6 right-6 flex gap-3">
                          <Button 
                            className="flex-1 text-sm py-2 rounded-xl" 
                            onClick={downloadResult}
                          >
                            <Download size={16} />
                            Save Image
                          </Button>
                          <Button 
                            variant="secondary" 
                            className="text-sm py-2 rounded-xl"
                            onClick={() => window.open(state.transformed!, '_blank')}
                          >
                            <ExternalLink size={16} />
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            {state.error && (
              <div className="p-4 bg-red-950/30 border border-red-900/50 rounded-2xl text-red-200 text-sm text-center">
                {state.error}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full max-w-7xl px-6 py-12 border-t border-neutral-900 flex flex-col md:flex-row justify-between items-center gap-8 text-neutral-600 text-xs">
        <div className="flex gap-12">
          <div className="space-y-2">
            <h4 className="text-neutral-400 font-semibold uppercase tracking-widest">Services</h4>
            <ul className="space-y-1">
              <li><a href="#" className="hover:text-white">Image Generation</a></li>
              <li><a href="#" className="hover:text-white">Style Transfer</a></li>
              <li><a href="#" className="hover:text-white">Custom Couture</a></li>
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="text-neutral-400 font-semibold uppercase tracking-widest">Studio</h4>
            <ul className="space-y-1">
              <li><a href="#" className="hover:text-white">Showcase</a></li>
              <li><a href="#" className="hover:text-white">Privacy</a></li>
              <li><a href="#" className="hover:text-white">Terms</a></li>
            </ul>
          </div>
        </div>
        <p>© 2024 Studio Luxe. Powered by Gemini Flash 2.5 Image Generation.</p>
      </footer>
    </div>
  );
};

export default App;
