import React from 'react';

interface ToggleFavoriteProps {
  showFavorites: boolean;
  onToggle: (value: boolean) => void;
}

const ToggleFavorite: React.FC<ToggleFavoriteProps> = ({ showFavorites, onToggle }) => {
  return (
    <div className='flex justify-start mb-8 text-[12px] font-semibold text-white'>
      <button
        className={`px-4 py-2 rounded-l-full ${!showFavorites ? 'bg-slate-700' : 'bg-slate-500'}`}
        onClick={() => onToggle(false)}
      >
        All
      </button>
      <button
        className={`px-4 py-2 rounded-r-full ${showFavorites ? 'bg-slate-700' : 'bg-slate-500'}`}
        onClick={() => onToggle(true)}
      >
        Favorites
      </button>
    </div>
  );
};

export default ToggleFavorite;
