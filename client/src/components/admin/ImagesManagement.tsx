import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { db, storage } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// List of images to manage (excluding GearGrid)
const initialImages = [
  {
    key: 'hero-bg',
    page: 'Home',
    description: 'Hero background image',
    url: 'https://pixabay.com/get/gb193432d797864e168e6df940ffe5e3dac87b282d79d10c94d455f1f2d5d38429caca9edab17d030400d670325cbacb9573e7792b8477c20e038343d6575fd5e_1280.jpg',
  },
  {
    key: 'about-img',
    page: 'Home',
    description: 'About section image',
    url: 'https://pixabay.com/get/gcf4376522d5e5a5ba78e14349557e981adcc3f0bfabc5693b3906f081219d16c27e4ff906462c15e6aca815a3726d99597016fe149b0f2fdc93f4684a6dcdff4_1280.jpg',
  },
  {
    key: 'services-gear',
    page: 'Home',
    description: 'Services - Baby Gear Rentals',
    url: 'https://images.unsplash.com/photo-1600627094888-1957e7797da4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500&q=80',
  },
  {
    key: 'services-nappynow',
    page: 'Home',
    description: 'Services - NappyNow',
    url: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500&q=80',
  },
];

const CONFIG_DOC = 'siteImages';

const ImagesManagement = () => {
  const [images, setImages] = useState(initialImages);
  const [showModal, setShowModal] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [fileUpload, setFileUpload] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Load image URLs from Firestore config on mount
  useEffect(() => {
    const fetchConfig = async () => {
      const configRef = doc(db, 'config', CONFIG_DOC);
      const configSnap = await getDoc(configRef);
      if (configSnap.exists()) {
        const configData = configSnap.data();
        setImages((prev) =>
          prev.map((img) =>
            configData[img.key]
              ? { ...img, url: configData[img.key] }
              : img
          )
        );
      }
    };
    fetchConfig();
  }, []);

  const openModal = (idx: number) => {
    setSelectedIdx(idx);
    setShowModal(true);
    setFileUpload(null);
  };
  const closeModal = () => {
    setShowModal(false);
    setSelectedIdx(null);
    setFileUpload(null);
  };

  // Upload to Firebase Storage and update Firestore config
  const handleSave = async () => {
    if (selectedIdx === null || !fileUpload) return;
    setIsSaving(true);
    try {
      const img = images[selectedIdx];
      const storageRef = ref(storage, `siteImages/${img.key}_${Date.now()}_${fileUpload.name}`);
      const uploadResult = await uploadBytes(storageRef, fileUpload);
      const downloadUrl = await getDownloadURL(uploadResult.ref);
      // Update Firestore config
      const configRef = doc(db, 'config', CONFIG_DOC);
      await setDoc(configRef, { [img.key]: downloadUrl }, { merge: true });
      // Update UI
      setImages((prev) =>
        prev.map((item, idx) =>
          idx === selectedIdx ? { ...item, url: downloadUrl } : item
        )
      );
      closeModal();
    } catch (error) {
      alert('Error uploading image: ' + (error as Error).message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl mb-6">Manage Images</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded-lg">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 text-left">Page</th>
              <th className="py-2 px-4 text-left">Description</th>
              <th className="py-2 px-4 text-left">Image</th>
              <th className="py-2 px-4 text-left">Change</th>
            </tr>
          </thead>
          <tbody>
            {images.map((img, idx) => (
              <tr key={img.key} className="border-t border-gray-200">
                <td className="py-2 px-4 align-middle">{img.page}</td>
                <td className="py-2 px-4 align-middle">{img.description}</td>
                <td className="py-2 px-4 align-middle">
                  <img src={img.url} alt={img.description} className="h-20 w-32 object-cover rounded shadow" />
                </td>
                <td className="py-2 px-4 align-middle">
                  <Button
                    className="bg-accent hover:bg-accent/90 text-white py-2 px-4 rounded-full"
                    onClick={() => openModal(idx)}
                  >
                    <Edit size={16} className="mr-1" /> Change
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Change Image Modal */}
      <AlertDialog open={showModal} onOpenChange={closeModal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Change Image</AlertDialogTitle>
            <AlertDialogDescription>
              {selectedIdx !== null && (
                <>
                  <div className="mb-4">
                    <strong>{images[selectedIdx].description}</strong>
                  </div>
                  <div className="mb-4">
                    <img src={images[selectedIdx].url} alt={images[selectedIdx].description} className="h-20 w-32 object-cover rounded shadow mx-auto" />
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => {
                      if (e.target.files && e.target.files[0]) setFileUpload(e.target.files[0]);
                    }}
                  />
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={closeModal}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleSave} disabled={!fileUpload || isSaving} className="bg-accent hover:bg-accent/90">
              {isSaving ? 'Saving...' : 'Save'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ImagesManagement; 