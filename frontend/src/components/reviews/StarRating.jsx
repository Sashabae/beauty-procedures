// Star rating

import { useState } from "react";

export default function StarRating({ rating, onChange, editable = false }) {
  const maxStars = 5;
  const [hoverRating, setHoverRating] = useState(0);

  const displayRating = hoverRating || rating;

  function handleClick(starNumber) {
    if (!editable) return;
    if (onChange) onChange(starNumber);
  }

  function handleMouseEnter(starNumber) {
    if (!editable) return;
    setHoverRating(starNumber);
  }

  function handleMouseLeave() {
    if (!editable) return;
    setHoverRating(0);
  }

  return (
    <div className="flex items-center gap-1">
      {[...Array(maxStars)].map((_, index) => {
        const starNumber = index + 1;

        let starType = "mask mask-star-2 bg-gray-500"; // empty by default

        if (displayRating >= starNumber) {
          starType = "mask mask-star-2 bg-orange-400"; // full star
        } else if (displayRating >= starNumber - 0.5) {
          starType =
            "mask mask-star-2 bg-orange-400 relative before:content-[''] before:absolute before:inset-y-0 before:left-1/2 before:right-0 before:bg-gray-500"; // half star
        }

        return (
          <div
            key={index}
            className={`relative w-6 h-6 ${
              editable ? "cursor-pointer" : "cursor-default"
            }`}
            onClick={() => handleClick(starNumber)}
            onMouseEnter={() => handleMouseEnter(starNumber)}
            onMouseLeave={handleMouseLeave}
            role={editable ? "button" : undefined}
            tabIndex={editable ? 0 : undefined}
            onKeyDown={(e) => {
              if (editable && (e.key === "Enter" || e.key === " ")) {
                handleClick(starNumber);
              }
            }}
            aria-label={`Set rating to ${starNumber} star${
              starNumber > 1 ? "s" : ""
            }`}
          >
            <div
              className={starType}
              style={{ width: "100%", height: "100%" }}
            ></div>
          </div>
        );
      })}
      {!editable && (
        <span className="text-sm text-gray-600 ml-1">
          ({parseFloat(rating).toFixed(1)})
        </span>
      )}
    </div>
  );
}
