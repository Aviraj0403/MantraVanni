import React, { useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import { useGrowthFlags } from "../../growth/flags";
import MediaPicker from "../../growth/ugc/MediaPicker";
import { attachReviewMedia } from "../../growth/ugc/ugcApi";
import { toast } from "../../utils/toast";
import ReviewForm from "./ReviewForm";
import ReviewList from "./ReviewList";

const ReviewTab = ({ productId, reviews, setReviews }) => {
  const { user } = useAuth();
  const flags = useGrowthFlags();
  const ugcOn = !!flags.ugcReviews;
  const mediaRef = useRef([]);

  // Check if the user has already submitted a review
  const userHasReviewed = reviews.some(review => review.user._id === user?.id);

  // Photo / video reviews add-on: when the shopper picked media, attach it to the review right after the review is created.
  const setReviewsWithMedia = (updater) => {
    setReviews(updater);
    try {
      const media = mediaRef.current;
      if (!ugcOn || !media.length) return;
      const next = typeof updater === "function" ? updater([]) : updater;
      const created = Array.isArray(next) ? next[0] : null;
      if (!created?._id) return;
      attachReviewMedia(created._id, media.map(({ type, url, bytes, duration }) => ({ type, url, bytes, duration })))
        .then((r) => {
          mediaRef.current = [];
          if (r?.moderation?.status === "pending") toast.success("Thanks! Your photos will appear after approval.");
        })
        .catch((e) => toast.error(e?.response?.data?.message || "Your review was saved, but the photos could not be attached."));
    } catch { /* never block the review */ }
  };

  return (
    <div className="py-6">
      {/* Review List */}
      <ReviewList reviews={reviews} />

      {/* Optional photo / video upload (only when the add-on is on) */}
      {ugcOn && user && !userHasReviewed && <MediaPicker onChange={(m) => { mediaRef.current = m; }} />}

      {/* Conditionally render Review Form if the user hasn't reviewed the product */}
      {!userHasReviewed && (
        <ReviewForm productId={productId} setReviews={ugcOn ? setReviewsWithMedia : setReviews} />
      )}

      {/* If the user has reviewed, you could show a message */}
      {userHasReviewed && (
        <div className="text-center text-gray-500 mt-6 bg-brand-bg p-4 rounded-xl border border-secondary-200">
          <p className="font-medium">You have already submitted a review for this product.</p>
        </div>
      )}
    </div>
  );
};

export default ReviewTab;
