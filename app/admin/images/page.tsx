import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import ImagesContent from './ImagesContent';

export default async function ImagesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/admin/login');
  }

  // Fetch site images
  const { data: images } = await supabase
    .from('site_images')
    .select('*')
    .order('category', { ascending: true });

  // Get file sizes for each image from Supabase Storage
  const imagesWithSize = await Promise.all(
    (images || []).map(async (image) => {
      try {
        // Extract path from Supabase Storage URL
        const urlObj = new URL(image.url);
        const pathMatch = urlObj.pathname.match(/\/storage\/v1\/object\/public\/images\/(.+)/);

        if (pathMatch && pathMatch[1]) {
          const filePath = decodeURIComponent(pathMatch[1]);

          // Get file metadata from storage
          const { data: fileData, error } = await supabase.storage
            .from('images')
            .list(filePath.split('/').slice(0, -1).join('/'), {
              search: filePath.split('/').pop(),
            });

          if (!error && fileData && fileData.length > 0) {
            return {
              ...image,
              file_size: fileData[0].metadata?.size || null,
            };
          }
        }
      } catch (err) {
        console.error('Error getting file size for', image.key, err);
      }

      return { ...image, file_size: null };
    })
  );

  return <ImagesContent user={user} images={imagesWithSize} />;
}
