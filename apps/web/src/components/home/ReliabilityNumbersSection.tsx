'use client';

import React from 'react';
import { motion } from 'framer-motion';

export const ReliabilityNumbersSection: React.FC = () => {
  return (
    <section className="py-20 bg-white border-t border-[#EBEBE7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111111] font-display">
            The numbers speak for our reliability
          </h2>
          <p className="text-sm sm:text-base text-[#6B6E68] font-medium leading-relaxed">
            Proven Anycast infrastructure engineered for sub-3-minute global routing and 100% uptime.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="p-8 rounded-2xl bg-[#FAFAF9] border border-[#EBEBE7] flex flex-col justify-between space-y-6 shadow-xs hover:border-[#0D3B85] transition-all"
          >
            <div className="space-y-3">
              <div className="text-4xl font-black text-[#0D3B85] font-mono">99.99%</div>
              <h3 className="text-lg font-bold text-[#111111]">Always Online SLA</h3>
              <p className="text-sm text-[#6B6E68] font-medium leading-relaxed">
                Redundant Anycast DNS clusters ensure your web traffic resolves instantly worldwide with zero single points of failure.
              </p>
            </div>
            <div className="pt-4 border-t border-[#EBEBE7] text-xs font-bold text-[#0D3B85]">
              Verified Global Uptime
            </div>
          </motion.div>

          {/* Card 2 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="p-8 rounded-2xl bg-[#FAFAF9] border border-[#EBEBE7] flex flex-col justify-between space-y-6 shadow-xs hover:border-[#1B6FC9] transition-all"
          >
            <div className="space-y-3">
              <div className="text-4xl font-black text-[#1B6FC9] font-mono">&lt; 3 mins</div>
              <h3 className="text-lg font-bold text-[#111111]">Instant Anycast Routing</h3>
              <p className="text-sm text-[#6B6E68] font-medium leading-relaxed">
                Changes to A, CNAME, and MX records propagate across global edge nodes in minutes rather than hours.
              </p>
            </div>
            <div className="pt-4 border-t border-[#EBEBE7] text-xs font-bold text-[#1B6FC9]">
              Sub-3-Minute Propagation
            </div>
          </motion.div>

          {/* Card 3 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="p-8 rounded-2xl bg-[#FAFAF9] border border-[#EBEBE7] flex flex-col justify-between space-y-6 shadow-xs hover:border-[#7CB342] transition-all"
          >
            <div className="space-y-3">
              <div className="text-4xl font-black text-[#7CB342] font-mono">100%</div>
              <h3 className="text-lg font-bold text-[#111111]">Rental Conversion Credit</h3>
              <p className="text-sm text-[#6B6E68] font-medium leading-relaxed">
                Every dollar spent on short-term staging subdomains is credited back when you purchase the full domain.
              </p>
            </div>
            <div className="pt-4 border-t border-[#EBEBE7] text-xs font-bold text-[#7CB342]">
              100% Money-Back Rebate
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
