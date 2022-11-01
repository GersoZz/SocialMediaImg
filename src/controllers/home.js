const ctrl = {};
const { Image } = require("../models");
const path = require("path");
const sidebar = require("../helpers/sidebar");

ctrl.index = async (req, res) => {
  const images = await Image.find().sort({ timestamp: -1 }).lean();
  /*   console.log(typeof images);
  console.log(images); */

  let auxArr = [];
  for (let i = 0; i < images.length; i++) {
    const name = images[i].filename;
    let uniqueId = name.replace(path.extname(name), "");
    auxArr.push({ ...images[i], uniqueId });
  }

  let viewModel = { images: [] };
  viewModel.images = auxArr;
  viewModel = await sidebar(viewModel);

  /* res.render("index", { images: auxArr }); */
/*   console.log(viewModel.sidebar.popular); */
/*   viewModel.sidebar.popular = viewModel.sidebar.popular.lean();
 */
  let auxArr2 = [];
  for (let i = 0; i < viewModel.sidebar.popular.length; i++) {
    const name = viewModel.sidebar.popular[i].filename;
    let uniqueId = name.replace(path.extname(name), "");
    auxArr2.push({ ...viewModel.sidebar.popular[i], uniqueId });
  }
  viewModel.sidebar.popular = auxArr2;

/*   console.log(viewModel.sidebar.popular); */
  console.log(viewModel.sidebar.comments);
  res.render("index", viewModel);
};

module.exports = ctrl;
