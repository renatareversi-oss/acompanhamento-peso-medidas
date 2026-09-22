export function OrganicBackdrop() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden="true">
      <div
        className="animate-float absolute -top-16 -left-20 w-80 h-80 rounded-full blur-2xl opacity-90 dark:opacity-50"
        style={{ background: 'radial-gradient(circle, #ffb6c9 0%, transparent 70%)' }}
      />
      <div
        className="animate-float absolute top-1/3 -right-24 w-[26rem] h-[26rem] rounded-full blur-2xl opacity-80 dark:opacity-45"
        style={{ background: 'radial-gradient(circle, #a8d8f0 0%, transparent 70%)', animationDelay: '2.5s' }}
      />
      <div
        className="animate-float absolute bottom-0 left-1/4 w-96 h-96 rounded-full blur-2xl opacity-70 dark:opacity-40"
        style={{ background: 'radial-gradient(circle, #ffe08a 0%, transparent 70%)', animationDelay: '5s' }}
      />
    </div>
  );
}
