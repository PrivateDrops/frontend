import { HStack } from '@chakra-ui/react';
import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';

type StarRatingProps = {
  rating: number;
  setRating: (rating: number) => void;
  count?: number;
  size?: number;
};

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  setRating,
  count = 5,
  size = 20,
}) => {
  const [hover, setHover] = useState<number>(0);

  return (
    <HStack>
      {[...Array(count)].map((_, index) => {
        const ratingValue = index + 1;
        return (
          <label
            key={index}
            onMouseEnter={() => setHover(ratingValue)}
            onMouseLeave={() => setHover(0)}
          >
            <input
              type="radio"
              name="rating"
              value={ratingValue}
              onChange={() => setRating(ratingValue)}
              style={{ display: 'none' }} // Hide the radio button
            />
            <FaStar
              cursor="pointer"
              color={ratingValue <= (hover || rating) ? '#ffc107' : '#e4e5e9'}
              size={size}
              style={{ transition: 'color 200ms' }} // Smooth color transition
              aria-label={`Rate ${ratingValue} out of ${count}`} // Accessibility improvement
            />
          </label>
        );
      })}
    </HStack>
  );
};
