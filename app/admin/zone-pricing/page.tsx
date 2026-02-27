import { Metadata } from 'next';
import AdminLayout from '@/components/admin/AdminLayout';
import ZonePricingContent from './ZonePricingContent';

export const metadata: Metadata = {
  title: 'Precios por Zona | Admin - Jetset Transfers',
  description: 'Gestión de precios entre zonas para transfers',
};

export default function ZonePricingPage() {
  return (
    <AdminLayout>
      <ZonePricingContent />
    </AdminLayout>
  );
}
