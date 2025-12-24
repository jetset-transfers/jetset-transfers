'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import {
  MapPinIcon,
  ClockIcon,
  UserGroupIcon,
  CameraIcon,
  HeartIcon,
  StarIcon
} from '@heroicons/react/24/solid';

export default function AirToursSection() {
  const t = useTranslations('airTours');

  const tours = [
    {
      icon: MapPinIcon,
      title: 'Isla Mujeres',
      duration: '30 min',
      price: '$199',
      rating: 4.9,
      image: '/images/sections/aerealView.png',
      color: 'from-blue-500 to-cyan-400',
      features: ['Vista 360°', 'Fotografía Aérea', 'Guía Experto']
    },
    {
      icon: CameraIcon,
      title: 'Cancún Costa',
      duration: '45 min',
      price: '$249',
      rating: 5.0,
      image: '/images/sections/aerealView.png',
      color: 'from-purple-500 to-pink-500',
      features: ['Atardecer', 'Video HD', 'Champagne']
    },
    {
      icon: HeartIcon,
      title: 'Tour Romántico',
      duration: '60 min',
      price: '$349',
      rating: 4.8,
      image: '/images/sections/aerealView.png',
      color: 'from-red-500 to-orange-500',
      features: ['Privado', 'Cena', 'Música']
    }
  ];

  return (
    <section className="py-20 lg:py-32 bg-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, #E63946 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-red/10 to-accent-purple/10 rounded-full mb-6"
          >
            <span className="text-sm font-semibold text-primary-red">
              ✈️ Tours Aéreos Premium
            </span>
          </motion.div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-primary-dark mb-6">
            {t('title')}
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            {t('cta')}
          </p>
        </motion.div>

        {/* Tours Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {tours.map((tour, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="group relative bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-300"
            >
              {/* Image Container */}
              <div className="relative h-48 md:h-64 overflow-hidden">
                <motion.img
                  src={tour.image}
                  alt={tour.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {/* Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-t ${tour.color} opacity-20 group-hover:opacity-30 transition-opacity`} />

                {/* Like Button */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg"
                >
                  <HeartIcon className="w-5 h-5 text-gray-400 group-hover:text-primary-red transition-colors" />
                </motion.button>

                {/* Price Badge */}
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-lg">
                  <span className="font-bold text-primary-dark">{tour.price}</span>
                  <span className="text-sm text-gray-600">/persona</span>
                </div>

                {/* Rating */}
                <div className="absolute bottom-4 left-4 flex items-center gap-1 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-lg">
                  <StarIcon className="w-4 h-4 text-yellow-400" />
                  <span className="font-semibold text-sm text-primary-dark">{tour.rating}</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${tour.color} rounded-xl flex items-center justify-center`}>
                    <tour.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-primary-dark">{tour.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <ClockIcon className="w-4 h-4" />
                      <span>{tour.duration}</span>
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-2 mb-6">
                  {tour.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary-red" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-3 bg-gradient-to-r ${tour.color} text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all`}
                >
                  Reservar Ahora
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
          {/* Card 1 */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-3xl p-4 md:p-8 border border-blue-100"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-accent-blue to-accent-cyan rounded-2xl flex items-center justify-center flex-shrink-0">
                <MapPinIcon className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-primary-dark mb-2">
                  {t('subtitle1')}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {t('description1')}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Card 2 */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-4 md:p-8 border border-purple-100"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-accent-purple to-pink-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                <UserGroupIcon className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-primary-dark mb-2">
                  {t('subtitle2')}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {t('description2')}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-primary-red to-red-600 text-white rounded-full font-semibold shadow-lg shadow-primary-red/30 hover:shadow-xl hover:shadow-primary-red/40 transition-all"
          >
            <span>Ver Todos los Tours</span>
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              →
            </motion.div>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
