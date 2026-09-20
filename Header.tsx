import { Menu, Sparkles } from 'lucide-react';

interface HeaderProps {
  onOpenSidebar: () => void;
}

export default function Header({ onOpenSidebar }: HeaderProps) {
  return (
    <header className="h-14 border-b border-slate-800 bg-[#070a12]/80 backdrop-blur-md flex items-center justify-between px-4 sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSidebar}
          className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 md:hidden"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-400" />
          <span className="font-semibold text-slate-200 tracking-wide">NEXUS AI</span>
        </div>
      </div>
      <div className="text-xs text-slate-500 font-mono">Gemini 2.5 Flash</div>
    </header>
  );
}
