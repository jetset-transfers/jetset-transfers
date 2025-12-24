'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import AdminLayout from '@/components/admin/AdminLayout';
import MarkdownEditor from '@/components/admin/MarkdownEditor';
import ReactMarkdown from 'react-markdown';
import {
  DocumentTextIcon,
  ShieldCheckIcon,
  EyeIcon,
  CheckIcon,
  CursorArrowRippleIcon,
} from '@heroicons/react/24/outline';
import { User } from '@supabase/supabase-js';

interface LegalPage {
  id: string;
  slug: string;
  title_es: string;
  title_en: string;
  content_es: string;
  content_en: string;
  updated_at: string;
}

interface LegalContentProps {
  user: User;
  legalPages: LegalPage[];
}

type TabKey = 'terms' | 'privacy' | 'cookies';

export default function LegalContent({ user, legalPages }: LegalContentProps) {
  const router = useRouter();
  const supabase = createClient();
  const [activeTab, setActiveTab] = useState<TabKey>('terms');
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewLang, setPreviewLang] = useState<'es' | 'en'>('es');

  // Initialize form data from database
  const termsPage = legalPages.find(p => p.slug === 'terms');
  const privacyPage = legalPages.find(p => p.slug === 'privacy');
  const cookiesPage = legalPages.find(p => p.slug === 'cookies');

  const [termsData, setTermsData] = useState({
    title_es: termsPage?.title_es || 'Términos y Condiciones',
    title_en: termsPage?.title_en || 'Terms and Conditions',
    content_es: termsPage?.content_es || '',
    content_en: termsPage?.content_en || '',
  });

  const [privacyData, setPrivacyData] = useState({
    title_es: privacyPage?.title_es || 'Aviso de Privacidad',
    title_en: privacyPage?.title_en || 'Privacy Policy',
    content_es: privacyPage?.content_es || '',
    content_en: privacyPage?.content_en || '',
  });

  const [cookiesData, setCookiesData] = useState({
    title_es: cookiesPage?.title_es || 'Política de Cookies',
    title_en: cookiesPage?.title_en || 'Cookie Policy',
    content_es: cookiesPage?.content_es || '',
    content_en: cookiesPage?.content_en || '',
  });

  const getCurrentData = () => {
    switch (activeTab) {
      case 'terms': return termsData;
      case 'privacy': return privacyData;
      case 'cookies': return cookiesData;
    }
  };

  const getCurrentSetData = () => {
    switch (activeTab) {
      case 'terms': return setTermsData;
      case 'privacy': return setPrivacyData;
      case 'cookies': return setCookiesData;
    }
  };

  const getCurrentPage = () => {
    switch (activeTab) {
      case 'terms': return termsPage;
      case 'privacy': return privacyPage;
      case 'cookies': return cookiesPage;
    }
  };

  const currentData = getCurrentData();
  const setCurrentData = getCurrentSetData();
  const currentPage = getCurrentPage();

  const handleSave = async () => {
    setSaving(true);
    try {
      const slug = activeTab;
      const data = currentData;

      if (currentPage) {
        // Update existing
        const { error } = await supabase
          .from('legal_pages')
          .update({
            title_es: data.title_es,
            title_en: data.title_en,
            content_es: data.content_es,
            content_en: data.content_en,
            updated_at: new Date().toISOString(),
          })
          .eq('slug', slug);

        if (error) throw error;
      } else {
        // Insert new
        const { error } = await supabase
          .from('legal_pages')
          .insert({
            slug,
            title_es: data.title_es,
            title_en: data.title_en,
            content_es: data.content_es,
            content_en: data.content_en,
          });

        if (error) throw error;
      }

      toast.success('Contenido guardado correctamente');
      router.refresh();
    } catch (error) {
      console.error('Error saving:', error);
      toast.error('Error al guardar el contenido');
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { key: 'terms' as TabKey, label: 'Términos y Condiciones', icon: DocumentTextIcon },
    { key: 'privacy' as TabKey, label: 'Aviso de Privacidad', icon: ShieldCheckIcon },
    { key: 'cookies' as TabKey, label: 'Política de Cookies', icon: CursorArrowRippleIcon },
  ];

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <AdminLayout userEmail={user.email || ''}>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Contenido Legal</h1>
          <p className="text-navy-400 mt-1">
            Administra los términos, privacidad y política de cookies
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              showPreview
                ? 'bg-brand-500 text-white'
                : 'bg-navy-800 text-navy-300 hover:bg-navy-700'
            }`}
          >
            <EyeIcon className="w-4 h-4" />
            {showPreview ? 'Editar' : 'Vista previa'}
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-lg transition-colors disabled:opacity-50"
          >
            <CheckIcon className="w-4 h-4" />
            {saving ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-colors ${
              activeTab === tab.key
                ? 'bg-brand-500 text-white'
                : 'bg-navy-800 text-navy-300 hover:bg-navy-700'
            }`}
          >
            <tab.icon className="w-5 h-5" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="bg-navy-900 rounded-xl border border-navy-800 overflow-hidden">
        {showPreview ? (
          /* Preview Mode */
          <div className="p-6">
            {/* Language toggle */}
            <div className="flex items-center gap-2 mb-6">
              <span className="text-sm text-navy-400">Idioma:</span>
              <button
                onClick={() => setPreviewLang('es')}
                className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                  previewLang === 'es'
                    ? 'bg-brand-500 text-white'
                    : 'bg-navy-800 text-navy-300 hover:bg-navy-700'
                }`}
              >
                Español
              </button>
              <button
                onClick={() => setPreviewLang('en')}
                className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                  previewLang === 'en'
                    ? 'bg-brand-500 text-white'
                    : 'bg-navy-800 text-navy-300 hover:bg-navy-700'
                }`}
              >
                English
              </button>
            </div>

            {/* Preview content */}
            <div className="bg-white rounded-xl p-8 max-w-4xl">
              <h1 className="text-3xl font-bold text-gray-900 mb-6">
                {previewLang === 'es' ? currentData.title_es : currentData.title_en}
              </h1>
              <div className="prose prose-lg max-w-none">
                <ReactMarkdown
                  components={{
                    h2: ({ children }) => <h2 className="text-xl font-bold mt-8 mb-4 text-gray-900">{children}</h2>,
                    h3: ({ children }) => <h3 className="text-lg font-semibold mt-6 mb-3 text-gray-800">{children}</h3>,
                    p: ({ children }) => <p className="text-gray-600 leading-relaxed mb-4">{children}</p>,
                    ul: ({ children }) => <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">{children}</ul>,
                    ol: ({ children }) => <ol className="list-decimal list-inside text-gray-600 space-y-2 mb-4">{children}</ol>,
                    li: ({ children }) => <li className="text-gray-600">{children}</li>,
                    strong: ({ children }) => <strong className="font-bold text-gray-900">{children}</strong>,
                    em: ({ children }) => <em className="italic">{children}</em>,
                    a: ({ href, children }) => (
                      <a href={href} className="text-brand-500 hover:text-brand-600 underline">
                        {children}
                      </a>
                    ),
                  }}
                >
                  {previewLang === 'es' ? currentData.content_es : currentData.content_en}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        ) : (
          /* Edit Mode */
          <div className="p-6 space-y-6">
            {/* Titles */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-navy-300 mb-1">
                  <span className="mr-1">🇪🇸</span> Título (ES)
                </label>
                <input
                  type="text"
                  value={currentData.title_es}
                  onChange={(e) => setCurrentData({ ...currentData, title_es: e.target.value })}
                  className="w-full px-3 py-2 bg-navy-800 border border-navy-700 rounded-lg text-white placeholder-navy-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy-300 mb-1">
                  <span className="mr-1">🇺🇸</span> Título (EN)
                </label>
                <input
                  type="text"
                  value={currentData.title_en}
                  onChange={(e) => setCurrentData({ ...currentData, title_en: e.target.value })}
                  className="w-full px-3 py-2 bg-navy-800 border border-navy-700 rounded-lg text-white placeholder-navy-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            {/* Content ES */}
            <div>
              <MarkdownEditor
                value={currentData.content_es}
                onChange={(value) => setCurrentData({ ...currentData, content_es: value })}
                label="🇪🇸 Contenido (Español)"
                description="Escribe el contenido en español. Soporta formato Markdown."
                placeholder="Escribe el contenido aquí..."
                rows={15}
              />
            </div>

            {/* Content EN */}
            <div>
              <MarkdownEditor
                value={currentData.content_en}
                onChange={(value) => setCurrentData({ ...currentData, content_en: value })}
                label="🇺🇸 Contenido (English)"
                description="Write the content in English. Supports Markdown formatting."
                placeholder="Write the content here..."
                rows={15}
              />
            </div>

            {/* Last updated */}
            {currentPage?.updated_at && (
              <div className="pt-4 border-t border-navy-800">
                <p className="text-sm text-navy-500">
                  Última actualización: {formatDate(currentPage.updated_at)}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
