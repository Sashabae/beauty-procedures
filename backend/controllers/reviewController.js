const {
  createReview,
  getReviewsByServiceId,
  getReviewsByUserId,
  deleteReview,
  getReviewById,
} = require("../models/reviewModel");
const AppError = require("../utils/appError");
const { getRegistrationByUserAndDate } = require("../models/registrationModel");

exports.getReviewsByUserId = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { limit = 10, offset = 0 } = req.query;

    const reviews = await getReviewsByUserId(userId, { limit, offset });

    res.status(200).json({
      status: "success",
      data: reviews,
    });
  } catch (error) {
    next(error);
  }
};

exports.createReview = async (req, res, next) => {
  try {
    const { serviceId } = req.params;
    const userId = req.user.id;
    const { rating, comment } = req.body;

    const newReview = await createReview({
      user_id: userId,
      service_id: serviceId,
      rating,
      comment,
    });

    res.status(201).json({
      status: "success",
      data: newReview,
    });
  } catch (error) {
    next(error);
  }
};

exports.getReviewsByServiceId = async (req, res, next) => {
  try {
    const { serviceId } = req.params;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const offset = (page - 1) * limit;

    if (isNaN(page) || isNaN(limit)) {
      throw new AppError("Page and limit must be numbers", 400);
    }

    const { reviews, totalCount } = await getReviewsByServiceId(serviceId, {
      limit,
      offset,
    });

    const totalPages = Math.ceil(totalCount / limit);

    res.status(200).json({
      status: "success",
      data: reviews,
      pagination: {
        reviewCount: totalCount,
        totalPages,
        currentPage: page,
        perPage: limit,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteReview = async (req, res, next) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user.id;

    const review = await getReviewById(reviewId);

    if (!review) {
      throw new AppError("Review not found", 404);
    }

    if (review.user_id !== userId) {
      throw new AppError("You can only delete your own reviews", 403);
    }

    const deleted = await deleteReview(reviewId);

    if (!deleted) {
      throw new AppError("Review not found", 404);
    }

    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};
