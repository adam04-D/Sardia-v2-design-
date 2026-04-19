export default function RouteFallback() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 rounded-full border-2 border-accent/20 border-t-accent animate-spin" />
        <p className="font-sans text-xs text-text-muted tracking-[0.2em] uppercase">
          جاري التحميل
        </p>
      </div>
    </div>
  );
}
