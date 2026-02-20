"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export function TopLoader() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          className="fixed top-0 left-0 right-0 z-[9999] h-[2px] bg-accent origin-left"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 0.8 }}
          exit={{ scaleX: 1, opacity: 0 }}
          transition={{
            scaleX: { duration: 0.4, ease: "easeOut" },
            opacity: { duration: 0.2, delay: 0.3 },
          }}
        />
      )}
    </AnimatePresence>
  );
}
