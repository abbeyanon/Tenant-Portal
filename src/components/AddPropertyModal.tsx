import React, { useState } from 'react';
import { useTenant } from '../context/TenantContext';
import { Building2, X, PlusCircle, MapPin, Phone, User } from 'lucide-react';
import { Property } from '../types';

export const AddPropertyModal: React.FC = () => {
  const { isAddPropertyModalOpen, setIsAddPropertyModalOpen, addProperty } = useTenant();

  const [name, setName] = useState('');
  const [location, setLocation] = useState('Ngong Road, Nairobi');
  const [propertyType, setPropertyType] = useState<Property['propertyType']>('Apartment Complex');
  const [totalUnits, setTotalUnits] = useState<number>(20);
  const [caretakerName, setCaretakerName] = useState('');
  const [caretakerPhone, setCaretakerPhone] = useState('+254 759 508 348');
  const [image, setImage] = useState('https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=600&auto=format&fit=crop');

  if (!isAddPropertyModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    addProperty({
      name,
      location,
      propertyType,
      totalUnits,
      caretakerName: caretakerName || 'Estate Caretaker',
      caretakerPhone: caretakerPhone || '+254 759 508 348',
      image
    });

    setIsAddPropertyModalOpen(false);
    setName('');
    setLocation('Ngong Road, Nairobi');
    setCaretakerName('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in">
      <div className="bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative max-h-[92vh] overflow-y-auto">
        <button
          onClick={() => setIsAddPropertyModalOpen(false)}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-100 dark:bg-dark-800 text-slate-500 hover:text-slate-900 dark:hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-brand-100 dark:bg-brand-950 text-brand-600 flex items-center justify-center">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Add New Property / Estate</h3>
            <p className="text-xs text-slate-500">Register a new residential building or commercial complex</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">Property / Building Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Sapphire Palms Executive Suites"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-50 dark:bg-dark-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">Location / Address *</label>
              <input
                type="text"
                required
                placeholder="e.g. Kilimani, Nairobi"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-slate-50 dark:bg-dark-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">Property Type</label>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value as any)}
                className="w-full bg-slate-50 dark:bg-dark-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs font-semibold"
              >
                <option value="Apartment Complex">Apartment Complex</option>
                <option value="Executive Suites">Executive Suites</option>
                <option value="Gated Community">Gated Community</option>
                <option value="Commercial">Commercial Plaza</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">Total Units</label>
              <input
                type="number"
                value={totalUnits}
                onChange={(e) => setTotalUnits(Number(e.target.value))}
                className="w-full bg-slate-50 dark:bg-dark-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs font-bold"
              />
            </div>
            <div>
              <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">Caretaker Name</label>
              <input
                type="text"
                placeholder="e.g. Dennis Ochieng"
                value={caretakerName}
                onChange={(e) => setCaretakerName(e.target.value)}
                className="w-full bg-slate-50 dark:bg-dark-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs"
              />
            </div>
            <div>
              <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">Caretaker Phone</label>
              <input
                type="tel"
                value={caretakerPhone}
                onChange={(e) => setCaretakerPhone(e.target.value)}
                className="w-full bg-slate-50 dark:bg-dark-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">Property Photo URL</label>
            <input
              type="url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="w-full bg-slate-50 dark:bg-dark-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-sm shadow-lg shadow-brand-600/20 mt-2 transition"
          >
            Save & Add Property
          </button>
        </form>
      </div>
    </div>
  );
};
