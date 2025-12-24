'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import {
  ArrowRightIcon,
  CheckCircleIcon,
  PlayIcon
} from '@heroicons/react/24/solid';
import { useState } from 'react';

export default function FlyAndDiveSection() {
  const t = useTranslations('flyAndDive');
  const [isPlaying, setIsPlaying] = useState(true);

  const benefits = [
    'Vistas espectaculares desde el aire',
    'Experiencia de buceo única',
    'Guías profesionales certificados',
    'Equipo de última generación'
  ];

  return (
    <section className="py-20 lg:py-32 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
      {/* Background decorative elements - hidden on mobile for performance */}
      <div className="hidden md:block absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-accent-cyan/10 to-accent-blue/10 rounded-full blur-3xl" />
      <div className="hidden md:block absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-primary-red/10 to-accent-purple/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Content Card - Takes 5 columns */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 bg-white/80 backdrop-blur-xl rounded-3xl p-8 lg:p-10 shadow-xl border border-gray-200/50"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-accent-cyan/20 to-accent-blue/20 rounded-full mb-6"
            >
              <span className="text-sm font-semibold text-accent-blue">
                ✨ Experiencia Premium
              </span>
            </motion.div>

            <h2 className="text-4xl lg:text-5xl font-heading font-bold text-primary-dark mb-6 leading-tight">
              {t('title')}
            </h2>

            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              {t('description')}
            </p>

            {/* CTA Text */}
            <div className="bg-gradient-to-r from-primary-red/10 to-accent-purple/10 rounded-2xl p-6 mb-8">
              <p className="text-xl font-semibold text-primary-red">
                {t('cta')}
              </p>
            </div>

            {/* Benefits List */}
            <div className="space-y-3 mb-8">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <CheckCircleIcon className="w-6 h-6 text-accent-cyan flex-shrink-0" />
                  <span className="text-gray-700">{benefit}</span>
                </motion.div>
              ))}
            </div>

            {/* CTA Button */}
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="group w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-primary-red to-red-600 text-white px-8 py-4 rounded-full font-semibold shadow-lg shadow-primary-red/30 hover:shadow-xl hover:shadow-primary-red/40 transition-all"
            >
              <span>{t('button')}</span>
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ArrowRightIcon className="w-5 h-5" />
              </motion.div>
            </motion.button>
          </motion.div>

          {/* Video Card - Takes 7 columns */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-7"
          >
            <div className="relative h-full min-h-[280px] sm:min-h-[350px] md:min-h-[400px] lg:min-h-[600px] rounded-3xl overflow-hidden shadow-2xl group">
              {/* Video */}
              <video
                className="absolute inset-0 w-full h-full object-cover"
                autoPlay
                loop
                muted
                playsInline
              >
                <source src="/videos/diving-underwater.mp4" type="video/mp4" />
              </video>

              {/* Glassmorphism Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Play Button Overlay (decorative) */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="w-20 h-20 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center border-2 border-white/50 cursor-pointer"
                >
                  <PlayIcon className="w-10 h-10 text-white ml-1" />
                </motion.div>
              </motion.div>

              {/* Floating Stats Cards */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-6 right-6 bg-white/90 backdrop-blur-xl p-4 rounded-2xl shadow-xl border border-gray-200/50"
              >
                <div className="text-2xl font-bold text-primary-dark">30m+</div>
                <div className="text-sm text-gray-600">Profundidad</div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-xl p-4 rounded-2xl shadow-xl border border-gray-200/50"
              >
                <div className="text-2xl font-bold bg-gradient-to-r from-accent-cyan to-accent-blue bg-clip-text text-transparent">
                  45min
                </div>
                <div className="text-sm text-gray-600">Vuelo Panorámico</div>
              </motion.div>
            </div>
          </motion.div>

          {/* Stats Row - Full Width Below */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-12 grid grid-cols-1 sm:grid-cols-3 gap-6"
          >
            {[
              {
                icon: '🌊',
                value: '100+',
                label: 'Sitios de Buceo',
                color: 'from-accent-cyan to-accent-blue'
              },
              {
                icon: '✈️',
                value: '500+',
                label: 'Vuelos Realizados',
                color: 'from-primary-red to-red-600'
              },
              {
                icon: '⭐',
                value: '4.9/5',
                label: 'Calificación',
                color: 'from-accent-yellow to-orange-500'
              },
            ].map((stat, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5, scale: 1.02 }}
                className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-gray-200/50 group cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className={`text-4xl w-16 h-16 flex items-center justify-center bg-gradient-to-br ${stat.color} rounded-2xl group-hover:scale-110 transition-transform`}>
                    {stat.icon}
                  </div>
                  <div>
                    <div className={`text-3xl font-heading font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
