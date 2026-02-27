import { Metadata } from 'next';
import AdminLayout from '@/components/admin/AdminLayout';
import ZonesContent from './ZonesContent';

export const metadata: Metadata = {
  title: 'Zonas de Transfer | Admin - Jetset Transfers',
  description: 'Gestión de zonas geográficas para transfers',
};

export default function ZonesPage() {
  return (
    <AdminLayout>
      <ZonesContent />
    </AdminLayout>
  );
}
