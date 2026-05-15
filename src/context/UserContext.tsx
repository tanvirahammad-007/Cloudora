import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { CitySuggestion } from '../types/weather';

export interface UserProfile {
  name: string;
  avatarSeed: string;
  bio: string;
  location: string;
  joinedDate: string;
  favorites: CitySuggestion[];
}

interface UserContextType {
  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;
  toggleFavorite: (city: CitySuggestion) => void;
  isFavorite: (lat: number, lon: number) => boolean;
  reorderFavorites: (newFavorites: CitySuggestion[]) => void;
}

const defaultProfile: UserProfile = {
  name: 'Architect',
  avatarSeed: 'Architect',
  bio: 'Digital nomad exploring the intersection of weather patterns and urban design.',
  location: 'Global / Decentralized',
  joinedDate: new Date().toISOString(),
  favorites: [],
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('cloudora-user-profile');
      if (saved) {
        try {
          return { ...defaultProfile, ...JSON.parse(saved) };
        } catch (e) {
          return defaultProfile;
        }
      }
    }
    return defaultProfile;
  });

  useEffect(() => {
    localStorage.setItem('cloudora-user-profile', JSON.stringify(profile));
  }, [profile]);

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  };

  const toggleFavorite = (city: CitySuggestion) => {
    setProfile(prev => {
      const exists = prev.favorites.some(f => f.lat === city.lat && f.lon === city.lon);
      if (exists) {
        return {
          ...prev,
          favorites: prev.favorites.filter(f => !(f.lat === city.lat && f.lon === city.lon))
        };
      } else {
        return {
          ...prev,
          favorites: [...prev.favorites, city]
        };
      }
    });
  };

  const isFavorite = (lat: number, lon: number) => {
    return profile.favorites.some(f => f.lat === lat && f.lon === lon);
  };

  const reorderFavorites = (newFavorites: CitySuggestion[]) => {
    setProfile(prev => ({ ...prev, favorites: newFavorites }));
  };

  return (
    <UserContext.Provider value={{ profile, updateProfile, toggleFavorite, isFavorite, reorderFavorites }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within a UserProvider');
  return context;
};
