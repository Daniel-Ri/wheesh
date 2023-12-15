const express = require('express');

const authentication = require('../middlewares/authentication');
const { getAllBanners, getBanner, createBanner, updateBanner, deleteBanner } = require('../controllers/bannerController');
const upload = require('../middlewares/multer');
const { authorize } = require('../middlewares/authorize');
const bannerRoute = express.Router();

bannerRoute.get('/', getAllBanners);
bannerRoute.get('/:bannerId', getBanner);
bannerRoute.post('/', authentication, authorize(['admin']), upload.fields([
  { name: 'imageDesktop', maxCount: 1 },
  { name: 'imageMobile', maxCount: 1 },
]), createBanner);
bannerRoute.put('/:bannerId', authentication, authorize(['admin']), upload.fields([
  { name: 'imageDesktop', maxCount: 1 },
  { name: 'imageMobile', maxCount: 1 },
]), updateBanner);
bannerRoute.delete('/:bannerId', authentication, authorize(['admin']), deleteBanner);

module.exports = bannerRoute;