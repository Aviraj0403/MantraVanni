import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import ReviewForm from "./ReviewForm";
import ReviewList from "./ReviewList";

const ReviewTab = ({ productId, reviews, setReviews }) => {
  const { user } = useAuth();

  // Check if the user has already submitted a review
  const userHasReviewed = reviews.some(review => review.user._id === user?.id);
//  console.log("User Has Reviewed:", userHasReviewed);
  return (
    <div className="py-6">
      {/* Review List */}
      <ReviewList reviews={reviews} />

      {/* Conditionally render Review Form if the user hasn't reviewed the product */}
      {!userHasReviewed && (
        <ReviewForm productId={productId} setReviews={setReviews} />
      )}

      {/* If the user has reviewed, you could show a message */}
      {userHasReviewed && (
        <div className="text-center text-gray-500 mt-6">
          <p>You have already submitted a review for this product.</p>
        </div>
      )}
    </div>
  );
};

export default ReviewTab;
