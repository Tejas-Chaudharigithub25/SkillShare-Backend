const express = require('express');
const router = express.Router();

// ✅ Correctly import controller functions
const {
  addReview,
  fetchReview,
  updateReview,
  deleteReview
} = require('../controllers/reviewController'); // ✅ Make sure this path is CORRECT


// ✅ Define routes
router.post('/addReview', addReview);
router.get('/fetchReview/:reviewedUserId', fetchReview);
router.put('/updateReview', updateReview);
router.delete('/deleteReview', deleteReview);

// ✅ Export the router
module.exports = router;
