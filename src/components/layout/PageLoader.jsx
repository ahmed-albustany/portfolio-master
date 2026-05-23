import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const bootLines = [
  'INITIALIZING SYSTEMS...',
  'LOADING MODULES...',
  'CONNECTING TO DATABASE...',
  'SYSTEMS READY',
];

export default function PageLoader() {
  const [lineIndex, setLineIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const lineTimer = setInterval(() => {
      setLineIndex((prev) => (prev < bootLines.length - 1 ? prev + 1 : prev));
    }, 400);

    const progressTimer = setInterval(() => {
      setProgress((prev) => (prev < 100 ? prev + 2 : 100));
    }, 30);

    return () => {
      clearInterval(lineTimer);
      clearInterval(progressTimer);
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ backgroundColor: '#060B14' }}
    >
      <div className="flex flex-col items-center gap-6">
        {/* Animated logo */}
        <motion.div
          className="w-16 h-16 rounded-xl flex items-center justify-center font-heading font-bold text-xl"
          style={{
            backgroundColor: 'rgba(0,102,255,0.15)',
            color: '#0066FF',
            border: '1px solid rgba(0,102,255,0.3)',
            boxShadow: '0 0 30px rgba(0,102,255,0.2)',
          }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <motion.span
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            AC
          </motion.span>
        </motion.div>

        {/* Loading bar */}
        <div className="w-48">
          <div
            className="h-0.5 rounded-full overflow-hidden"
            style={{ backgroundColor: 'rgba(0,102,255,0.15)' }}
          >
            <motion.div
              className="h-full rounded-full"
              style={{
                background: 'linear-gradient(90deg, #0066FF, #00D4FF)',
                boxShadow: '0 0 10px rgba(0,102,255,0.5)',
              }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
        </div>

        {/* Boot text */}
        <div className="h-5 overflow-hidden">
          <motion.p
            key={lineIndex}
            className="text-[10px] font-mono tracking-widest uppercase"
            style={{ color: '#64748B' }}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {bootLines[lineIndex]}
          </motion.p>
        </div>
      </div>
    </div>
  );
}
