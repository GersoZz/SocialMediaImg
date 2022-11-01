const path = require("path");
const { randomNumber } = require("../helpers/libs");
const fs = require("fs-extra");
const { Image, Comment } = require("../models");
const md5 = require("md5");

const sidebar = require("../helpers/sidebar");

const ctrl = {};

ctrl.index = async (req, res) => {
  let viewModel = { image: {}, comments: {} };

  const image1 = await Image.findOne({
    filename: { $regex: req.params.image_id },
  });

  if (image1) {
    image1.views = image1.views + 1;

    await image1.save();

    /*     const image = image1.lean(); */

    const image = await Image.findOne({
      filename: { $regex: req.params.image_id },
    }).lean();

    const name = image.filename;
    let uniqueId = name.replace(path.extname(name), "");
    let newObjImage = { ...image, uniqueId };

    viewModel.image = newObjImage;

    const comments = await Comment.find({ image_id: image._id })
      .sort({ timestamp: -1 })
      .lean();
    viewModel.comments = comments;
    viewModel = await sidebar(viewModel);

    let auxArr2 = [];
    for (let i = 0; i < viewModel.sidebar.popular.length; i++) {
      const name = viewModel.sidebar.popular[i].filename;
      let uniqueId = name.replace(path.extname(name), "");
      auxArr2.push({ ...viewModel.sidebar.popular[i], uniqueId });
    }
    viewModel.sidebar.popular = auxArr2;

    res.render("image", viewModel);
  } else {
    res.redirect("/");
  }
};

ctrl.create = async (req, res) => {

  const saveImage = async () => {

    const imgUrl = randomNumber();

    const images = await Image.find({ filename: imgUrl }); //pq lo encuentra?//expReg?
    if (images.length > 0) {//if(images)
      saveImage();
    } else {
      console.log(imgUrl);

      const imageTempPath = req.file.path;
      const ext = path.extname(req.file.originalname).toLowerCase();
      const targetPath = path.resolve(`src/public/upload/${imgUrl}${ext}`); //P!

      if (
        ext === ".png" ||
        ext === ".jpg" ||
        ext === ".jpeg" ||
        ext === ".gif"
      ) {
        await fs.rename(imageTempPath, targetPath);
        const newImg = new Image({
          title: req.body.title,
          filename: imgUrl + ext,
          description: req.body.description,
        });
        const imageSaved = await newImg.save();
        res.redirect("/images/" + imgUrl);
        //res.send("works");
        //console.log(newImg);
      } else {
        await fs.unlink(imageTempPath); //P!
        res.status(500).json({ error: "Only Images are allowed" });
      }
      /*   console.log(req.file); */
      // res.send("works");
    }
  };

  saveImage();
};

ctrl.like = async (req, res) => {
  const image = await Image.findOne({
    filename: { $regex: req.params.image_id },
  });

  if (image) {
    image.likes = image.likes + 1;
    await image.save();
    console.log("lean", image.likes);

    res.json({ likes: image.likes });
  } else {
    res.status(500).json({ error: "Internal Error" });
  }
};

ctrl.comment = async (req, res) => {
  /* console.log(req.body); */
  const image = await Image.findOne({
    filename: { $regex: req.params.image_id },
  });
  if (image) {
    const newComment = new Comment(req.body);
    newComment.gravatar = md5(newComment.email);
    newComment.image_id = image._id;
    await newComment.save();

    const name = image.filename;
    let uniqueId = name.replace(path.extname(name), "");

    res.redirect("/images/" + uniqueId);
    /* res.send('ga'); */
  } else {
    res.redirect("/");
  }

  //  console.log(newComment);
};

ctrl.remove = async (req, res) => {
  const image = await Image.findOne({
    filename: { $regex: req.params.image_id },
  });
  console.log(req.params.image_id);

  if (image) {
    await fs.unlink(path.resolve("./src/public/upload/" + image.filename));
    await Comment.deleteMany({ image_id: image._id }); //deleteOne -> deleteMany
    await image.remove();
    res.json(true);
  }
};

module.exports = ctrl;
