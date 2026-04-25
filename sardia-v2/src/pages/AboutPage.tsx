/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { RevealText } from '../components/RevealText';
import { useEffect } from 'react';
import Seo from '../components/Seo';

export default function AboutPage() {
  // Always scroll to top when opening a new reading page
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-32 pb-20 max-w-4xl mx-auto px-6 md:px-12">
      <Seo
        title="عن المؤلف"
        path="/about"
        description="التعرف على الأديب آدم داودي، رحلته الفكرية، ومشروعه الأدبي في سرديا."
      />

      {/* Hero Intro */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-20 text-center"
      >
        <div className="w-16 h-16 bg-accent rounded-full mx-auto mb-8 flex items-center justify-center text-white font-serif text-3xl shadow-lg shadow-accent/20">
          آ
        </div>
        <RevealText text="من أنا؟" className="font-serif text-5xl md:text-6xl text-primary mb-6 justify-center" />
        <p className="font-sans text-stone-500 uppercase tracking-[0.2em] text-sm font-bold">آدم داودي — كاتب وباحث</p>
      </motion.div>

      {/* The Story Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-12 items-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="relative rounded-3xl overflow-hidden aspect-[4/5] shadow-2xl group"
        >
          <div className="absolute inset-0 bg-accent/10 mix-blend-multiply z-10 group-hover:bg-transparent transition-colors duration-700"></div>
          <img
            src="https://images.unsplash.com/photo-1519638399535-1b036603ac77?q=80&w=1000&auto=format&fit=crop"
            alt="Author portrait placeholder"
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover grayscale transition-transform duration-1000 group-hover:scale-105"
          />
        </motion.div>

        <div className="space-y-8 font-serif text-lg leading-[2.2] text-text-main">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            ولدتُ والحروفُ تملأ زوايا الذاكرة. منذ سنواتي الأولى، أدركت أن العالم لا يُقرأ بالعين السطحية، بل من خلال عدسة الفكر والتأمل. سرديا ليست مجرد منصة، بل هي امتداد لروحي الباحثة عن المعنى في عصر الضجيج.
          </motion.p>
          <motion.p
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 0.8, delay: 0.2 }}
          >
            أكرس وقتي لدراسة الأدب العربي، استنطاق التراث، وتفكيك النصوص المعقدة لتقديمها بقالب حداثي يحترم جلال الماضي ويخاطب العقل المعاصر. من خلال هذه المنصة، أشارككم نتاج بحثي، مقالاتي، وتأملاتي.
          </motion.p>
          
          <motion.div 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 0.8, delay: 0.4 }}
             className="pt-6 border-t border-accent/20"
          >
            <p className="font-serif italic text-2xl text-primary">"الكاتب صدى لأمته.. وكل كلمة لا تترك أثراً، هي محض حبرٍ على ورق."</p>
          </motion.div>
        </div>
      </div>

    </div>
  );
}
