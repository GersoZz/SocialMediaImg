const { Comment, Image } = require("../models");

module.exports = {
  async newest() {
    const commentsAux = await Comment.find().limit(5).sort({ timestamp: -1 });//

    const comments = await Comment.find().limit(5).sort({ timestamp: -1 }).lean();//
    /* console.log('comments x',comments); */

    let arrAux = [];
    for (const comment of commentsAux) {
      console.log('xd')
      console.log(comment);
      const image = await Image.findOne({ _id: comment.image_id }).lean();
      //comment.image = image.filename; 
      arrAux.push(image.filename)
    } //populate ojito


    for (let i=0;i<comments.length;i++){
      comments[i].image= arrAux[i];
    }


 /*    console.log(arrAux); */

    return comments;
  },
};
