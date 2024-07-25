import React from 'react';

interface ToggleFavoriteProps {
  showFavorites: boolean;
  onToggle: (value: boolean) => void;
  hasFavorites: boolean; // Add this prop
}

const ToggleFavorite: React.FC<ToggleFavoriteProps> = ({ showFavorites, onToggle, hasFavorites }) => {
  return (
    <div className='flex justify-start mb-8 text-[12px] font-semibold text-white'>
      <button
        className={`px-4 py-2 rounded-l-full ${!showFavorites ? 'bg-slate-700' : 'bg-slate-500'} ${!hasFavorites ? 'cursor-not-allowed opacity-50' : ''}`}
        onClick={() => hasFavorites && onToggle(false)}
        disabled={!hasFavorites}
      >
        All
      </button>
      <button
        className={`px-4 py-2 rounded-r-full ${showFavorites ? 'bg-slate-700' : 'bg-slate-500'} ${!hasFavorites ? 'cursor-not-allowed opacity-50' : ''}`}
        onClick={() => hasFavorites && onToggle(true)}
        disabled={!hasFavorites}
      >
        Favorites
      </button>
    </div>
  );
};

export default ToggleFavorite;
