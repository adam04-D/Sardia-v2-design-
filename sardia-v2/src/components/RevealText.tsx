/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';

export const RevealText = ({ text, className = "", delay = 0 }: { text: string, className?: string, delay?: number }) => {
  const words = text.split(" ");
  return (
    <div className={`flex flex-wrap gap-x-2 gap-y-1 ${className}`}>
      {words.map((word, i) => (
        <div key={i} className="overflow-hidden pt-2 pb-3">
          <motion.div
            initial={{ y: "120%", opacity: 0, rotate: 2 }}
            whileInView={{ y: 0, opacity: 1, rotate: 0 }}
            viewport={{ once: true, margin: "-50px" }}
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
