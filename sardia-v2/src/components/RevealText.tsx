/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, useInView } from 'motion/react';
import { useRef } from 'react';

export const RevealText = ({ text, className = "", delay = 0 }: { text: string, className?: string, delay?: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  // amount: 0.1 fires once 10% of the title is in view — far more reliable
  // than viewport margin offsets, which were silently skipping animation
  // triggers on words past the first when the element straddled the viewport.
  const inView = useInView(ref, { once: true, amount: 0.1 });
  const words = text.split(" ");
  return (
    <div ref={ref} className={`flex flex-wrap gap-x-2 gap-y-1 ${className}`}>
      {words.map((word, i) => (
        <div key={i} className="overflow-hidden pt-2 pb-3">
          <motion.div
            initial={{ y: "120%", opacity: 0, rotate: 2 }}
            animate={inView ? { y: 0, opacity: 1, rotate: 0 } : undefined}
            transition={{ duration: 0.9, delay: delay + i * 0.04, ease: [0.16, 1, 0.3, 1] }}
            className="inline-block origin-bottom-left"
          >
            {word}
          </motion.div>
        </div>
      ))}
    </div>
  );
};
