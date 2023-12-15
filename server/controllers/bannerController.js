const Joi = require("joi");
const { Op } = require("sequelize");
const fs = require('fs');

const { Banner } = require("../models");
const { handleClientError, handleServerError } = require("../utils/handleError");

exports.getAllBanners = async (req, res) => {
  try {
    const banners = await Banner.findAll({
      attributes: { exclude: ['createdAt', 'updatedAt'] }
    });

    return res.status(200).json({ data: banners, status: 'Success' });

  } catch (error) {
    console.error(error);
    handleServerError(res);
  }
}

exports.getBanner = async (req, res) => {
  try {
    const { bannerId } = req.params;
    const foundBanner = await Banner.findByPk(bannerId, {
      attributes: { exclude: ['createdAt', 'updatedAt'] }
    });
    if (!foundBanner) return handleClientError(res, 404, 'Banner Not Found');

    return res.status(200).json({ data: foundBanner, status: 'Success' });

  } catch (error) {
    console.error(error);
    handleServerError(res);
  }
}

exports.createBanner = async (req, res) => {
  try {
    const { imageDesktop, imageMobile } = req.files;
    const newBanner = await Banner.create({
      imageDesktop: `public/${imageDesktop[0].filename}`,
      imageMobile: `public/${imageMobile[0].filename}`,
    });

    return res.status(201).json({ data: newBanner, status: 'Success' });

  } catch (error) {
    console.error(error);
    handleServerError(res);
  }
}

exports.updateBanner = async (req, res) => {
  try {
    const { bannerId } = req.params;
    const { imageDesktop, imageMobile } = req.files;
    const foundBanner = await Banner.findByPk(bannerId);
    if (!foundBanner) {
      fs.unlinkSync(imageDesktop[0].path);
      fs.unlinkSync(imageMobile[0].path);
      return handleClientError(res, 404, 'Banner Not Found');
    }

    const oldImageDesktopPath = foundBanner.imageDesktop;
    const oldImageMobilePath = foundBanner.imageMobile;

    foundBanner.imageDesktop = `public/${imageDesktop[0].filename}`;
    foundBanner.imageMobile = `public/${imageMobile[0].filename}`;
    await foundBanner.save();

    fs.unlinkSync(oldImageDesktopPath);
    fs.unlinkSync(oldImageMobilePath);

    return res.status(200).json({ data: foundBanner, status: 'Success' });

  } catch (error) {
    console.error(error);
    handleServerError(res);
  }
}

exports.deleteBanner = async (req, res) => {
  try {
    const { bannerId } = req.params;
    const foundBanner = await Banner.findByPk(bannerId);
    if (!foundBanner) return handleClientError(res, 404, 'Banner Not Found');

    await Banner.destroy({ where: { id: bannerId } });
    fs.unlinkSync(foundBanner.imageDesktop);
    fs.unlinkSync(foundBanner.imageMobile);

    return res.status(200).json({ message: 'Successfully delete banner', status: 'Success' });

  } catch (error) {
    console.error(error);
    handleServerError(res);
  }
}