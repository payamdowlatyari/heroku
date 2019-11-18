const router = require('express').Router();
const path = require('path');
const userRoutes = require(path.join(__dirname, './user'));
const documentRoutes = require(path.join(__dirname, './document'));
const documentMetaRoutes = require(path.join(__dirname, './documentmeta'));
const forkRoutes = require(path.join(__dirname, './fork'));
const pullRoutes = require(path.join(__dirname, './pull'));

router.use("/user", userRoutes);
router.use("/document", documentRoutes);
router.use("/documentmeta", documentMetaRoutes);
router.use("/fork", forkRoutes);
router.use("/pull", pullRoutes);

module.exports = router;
