'use client';

import React, { useState, useEffect } from 'react';
import { DogProfile, DogProfileInput } from '@/types/dog-profile';
import { dogProfileService } from '@/lib/services/dog-profile.service';
import { getCurrentUser } from '@/lib/auth';

export default function DogProfileForm() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [dogProfile, setDogProfile] = useState<DogProfileInput>({
    name: '',
    breed: '',
    weight: 0,
    vet_issues: '',
    dietary_restrictions: ''
  });
  const [existingProfile, setExistingProfile] = useState<DogProfile | null>(null);

  useEffect(() => {
    const fetchDogProfile = async () => {
      try {
        const user = await getCurrentUser();
        if (!user) return;

        const profiles = await dogProfileService.getUserDogProfiles();
        if (profiles && profiles.length > 0) {
          setExistingProfile(profiles[0]);
          setDogProfile({
            name: profiles[0].name,
            breed: profiles[0].breed,
            weight: profiles[0].weight,
            vet_issues: profiles[0].vet_issues || '',
            dietary_restrictions: profiles[0].dietary_restrictions || ''
          });
        }
      } catch (err) {
        console.error('Error fetching dog profile:', err);
        setError('Failed to load your dog profile');
      } finally {
        setLoading(false);
      }
    };

    fetchDogProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setDogProfile(prev => ({
      ...prev,
      [name]: name === 'weight' ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      if (existingProfile) {
        await dogProfileService.updateDogProfile(existingProfile.id, dogProfile);
        setSuccess('Dog profile updated successfully!');
      } else {
        await dogProfileService.createDogProfile(dogProfile);
        setSuccess('Dog profile created successfully!');
      }
    } catch (err) {
      console.error('Error saving dog profile:', err);
      setError('Failed to save your dog profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-600">Loading your dog profile...</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-soft-lg rounded-xl p-6 border border-gray-100">
      <h2 className="text-xl font-semibold mb-4 font-poppins">
        {existingProfile ? 'Update Your Dog Profile' : 'Create Your Dog Profile'}
      </h2>
      
      {error && (
        <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded-xl relative mb-4 shadow-soft" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      {success && (
        <div className="bg-green-50 border border-green-400 text-green-700 px-4 py-3 rounded-xl relative mb-4 shadow-soft" role="alert">
          <span className="block sm:inline">{success}</span>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Dog's Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={dogProfile.name}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-xl shadow-soft py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
          />
        </div>
        
        <div>
          <label htmlFor="breed" className="block text-sm font-medium text-gray-700">
            Breed
          </label>
          <input
            type="text"
            id="breed"
            name="breed"
            value={dogProfile.breed}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-xl shadow-soft py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
          />
        </div>
        
        <div>
          <label htmlFor="weight" className="block text-sm font-medium text-gray-700">
            Weight (lbs)
          </label>
          <input
            type="number"
            id="weight"
            name="weight"
            value={dogProfile.weight}
            onChange={handleChange}
            required
            min="0"
            className="mt-1 block w-full border border-gray-300 rounded-xl shadow-soft py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
          />
        </div>
        
        <div>
          <label htmlFor="vet_issues" className="block text-sm font-medium text-gray-700">
            Veterinary Issues (optional)
          </label>
          <textarea
            id="vet_issues"
            name="vet_issues"
            value={dogProfile.vet_issues || ''}
            onChange={handleChange}
            rows={3}
            className="mt-1 block w-full border border-gray-300 rounded-xl shadow-soft py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            placeholder="Any health conditions, allergies, or medications"
          />
        </div>
        
        <div>
          <label htmlFor="dietary_restrictions" className="block text-sm font-medium text-gray-700">
            Dietary Restrictions (optional)
          </label>
          <textarea
            id="dietary_restrictions"
            name="dietary_restrictions"
            value={dogProfile.dietary_restrictions || ''}
            onChange={handleChange}
            rows={3}
            className="mt-1 block w-full border border-gray-300 rounded-xl shadow-soft py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            placeholder="Any food allergies or special dietary needs"
          />
        </div>
        
        <div className="pt-4">
          <button
            type="submit"
            disabled={saving}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-xl shadow-soft text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            {saving ? 'Saving...' : existingProfile ? 'Update Profile' : 'Create Profile'}
          </button>
        </div>
      </form>
    </div>
  );
} 