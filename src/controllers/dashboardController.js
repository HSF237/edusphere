const Batch = require('../models/Batch');

exports.getOverview = async (req, res, next) => {
  try {
    const shopID = req.user.id;

    if (!shopID) {
      return res.status(400).json({
        success: false,
        data: null,
        error: 'Shop ID is required'
      });
    }

    const now = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(now.getDate() + 7);

    // Get count of batches expiring now (already expired or expiring today)
    const expiringNow = await Batch.countDocuments({
      shopID,
      expiryDate: { $lte: now },
      quantity: { $gt: 0 } // Only count items in stock
    });

    // Get count of batches expiring soon (in the next 7 days)
    const expiringSoon = await Batch.countDocuments({
      shopID,
      expiryDate: { $gt: now, $lt: nextWeek },
      quantity: { $gt: 0 }
    });

    res.status(200).json({
      success: true,
      data: {
        expiringNow,
        expiringSoon
      },
      error: null
    });
  } catch (error) {
    next(error);
  }
};
