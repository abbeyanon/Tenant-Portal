import React, { useState } from 'react';
import { useTenant } from '../context/TenantContext';
import { Building2, X, PlusCircle, MapPin, Phone, User, Upload, Image as ImageIcon, Check } from 'lucide-react';
import { Property } from '../types';

const propertyImagePresets = [
  {
    label: 'Luxury Apartment Tower',
    url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=800&auto=format&fit=crop'
  },
  {
    label: 'Modern Glass High-Rise',
    url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop'
  },
  {
    label: 'Executive Suites & Balconies',
    url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800&auto=format&fit=crop'
  },
  {
    label: 'Gated Townhouse Court',
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop'
  }
];

export const AddPropertyModal: React.FC = () => {
  const { isAddPropertyModalOpen, setIsAddPropertyModalOpen, addProperty } = useTenant();

  const [name, setName] = useState('');
  const [location, setLocation] = useState('Ngong Road, Nairobi');
  const [propertyType, setPropertyType] = useState<Property['propertyType']>('Apartment Complex');
  const [totalUnits, setTotalUnits] = useState<number>(20);
  const [caretakerName, setCaretakerName] = useState('');
  const [caretakerPhone, setCaretakerPhone] = useState('+254 759 508 348');
  const [image, setImage] = useState(propertyImagePresets[0].url);
  const [isCustomUpload, setIsCustomUpload] = useState(false);

  if (!isAddPropertyModalOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setImage(reader.result);
          setIsCustomUpload(true);
        }
      };
      reader.readAsDataURL(file);
    }
  };

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
      image: image || propertyImagePresets[0].url
    });

    setIsAddPropertyModalOpen(false);
    setName('');
    setLocation('Ngong Road, Nairobi');
    setCaretakerName('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in">
      <div className="bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[92vh] overflow-y-auto">
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
            <p className="text-xs text-slate-500">Register a new residential building, attach photos & configure units</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Property Name */}
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

          {/* Location & Type */}
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

          {/* Specs */}
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

          {/* ATTACH PROPERTY IMAGE SECTION */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-dark-850 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-brand-600" />
                <span>Attach Property Image / Building Photo *</span>
              </label>
              {image && (
                <span className="text-[11px] text-emerald-600 font-semibold">✓ Image Attached</span>
              )}
            </div>

            {/* Live Image Preview & File Upload Box */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
              {/* Preview Thumbnail */}
              <div className="h-28 rounded-xl overflow-hidden bg-slate-800 relative border border-slate-200 dark:border-slate-700">
                {image ? (
                  <img src={image} alt="Property Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-500 text-[10px]">
                    No Image Selected
                  </div>
                )}
                <div className="absolute bottom-1 left-1 right-1 bg-slate-900/80 backdrop-blur-md px-1.5 py-0.5 rounded text-[9px] text-white text-center">
                  Preview Card
                </div>
              </div>

              {/* Upload Button */}
              <div className="sm:col-span-2 space-y-2">
                <label className="flex items-center justify-center gap-2 p-3 rounded-xl border-2 border-dashed border-brand-300 dark:border-brand-700 hover:border-brand-500 bg-brand-50/50 dark:bg-brand-950/20 cursor-pointer transition">
                  <Upload className="w-4 h-4 text-brand-600" />
                  <span className="font-bold text-brand-700 dark:text-brand-300 text-xs">
                    Attach Image from Computer / Phone
                  </span>
                  <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                </label>

                <div>
                  <input
                    type="url"
                    placeholder="Or paste image URL (e.g. https://...)"
                    value={image}
                    onChange={(e) => {
                      setImage(e.target.value);
                      setIsCustomUpload(false);
                    }}
                    className="w-full bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-[11px] text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Preset Image Options */}
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                Or Choose from High-Res Presets:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {propertyImagePresets.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setImage(preset.url);
                      setIsCustomUpload(false);
                    }}
                    className={`p-1 rounded-xl border transition relative overflow-hidden text-left ${
                      image === preset.url
                        ? 'border-brand-600 ring-2 ring-brand-500'
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-400'
                    }`}
                  >
                    <img src={preset.url} alt={preset.label} className="w-full h-12 object-cover rounded-lg" />
                    <span className="text-[9px] font-semibold text-slate-700 dark:text-slate-300 block truncate mt-1">
                      {preset.label}
                    </span>
                    {image === preset.url && (
                      <div className="absolute top-1.5 right-1.5 w-3.5 h-3.5 bg-brand-600 rounded-full flex items-center justify-center text-white">
                        <Check className="w-2.5 h-2.5" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-brand-600 to-blue-600 hover:from-brand-500 text-white font-bold text-sm shadow-lg shadow-brand-600/20 mt-2 transition"
          >
            Save & Add Property to Portfolio
          </button>
        </form>
      </div>
    </div>
  );
};
