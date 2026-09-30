import React from 'react';
import { Star } from 'lucide-react';

const RatingStars = ({ rating = 5, numReviews, size = 'w-3.5 h-3.5', showText = true }) => {
  const safeRating = Number(rating != null && !isNaN(rating) ? rating : 5);
  const fullStars = Math.floor(safeRating);
  const hasHalf = safeRating % 1 >= 0.4;

  return (
    <div className="flex items-center space-x-1.5">
      <div className="flex items-center text-amber-400">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${size} ${
              star <= fullStars
                ? 'fill-amber-400 text-amber-400'
                : star === fullStars + 1 && hasHalf
                ? 'fill-amber-400/60 text-amber-400'
                : 'text-neutral-200 fill-neutral-100'
            }`}
          />
        ))}
      </div>
      {showText && (
        <span className="text-xs text-neutral-500 font-medium">
          {safeRating.toFixed(1)} {numReviews !== undefined && numReviews !== null && `(${numReviews})`}
        </span>
      )}
    </div>
  );
};

export default RatingStars;
