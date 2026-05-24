'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { IncidentForm } from './IncidentForm';
import { UserSession } from './DashboardView';

export function NewIncidentAction({ currentUser }: { currentUser: UserSession }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const handleSuccess = () => {
    setIsModalOpen(false);
    router.refresh(); 
  };

  return (
    <>
      <button 
        onClick={() => setIsModalOpen(true)}
        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-semibold shadow-sm transition-colors flex items-center gap-2"
      >
        <span>+</span> Log New Incident
      </button>

      <IncidentForm 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={handleSuccess}
        currentUser={currentUser}
      />
    </>
  );
}