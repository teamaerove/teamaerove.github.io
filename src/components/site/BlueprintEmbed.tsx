import { Suspense, lazy, useEffect, useRef, useState } from "react";

// WebGL can't render on the server, and three.js is heavy: load the viewer in
// the browser only, once the panel is about to scroll into view.
const BlueprintViewer = lazy(() => import("@/components/blueprint/BlueprintViewer"));

export function BlueprintEmbed({ height: desktopHeight = 600 }: { height?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);
  // On phones the flight panel docks along the bottom, so give the drone room above it.
  const [height, setHeight] = useState(desktopHeight);
  useEffect(() => { if (window.matchMedia("(max-width: 768px)").matches) setHeight(720); }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e?.isIntersecting) { setNear(true); io.disconnect(); } }, { rootMargin: "400px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const loading = <div className="bp-embed-loading" style={{ height }}><p>Loading 3D blueprint…</p></div>;

  return (
    <div ref={ref} className="bp-embed">
      {near ? <Suspense fallback={loading}><BlueprintViewer height={height} embedded /></Suspense> : loading}
    </div>
  );
}
