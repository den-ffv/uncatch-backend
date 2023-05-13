import PostModel from "../models/Post.js";


export const getAll = async (req, res) => {
  try {
    const posts = await PostModel.find().populate("user").exec();

    res.json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      massage: "Не вдалося тримати статьї",
    });
  }
};

export const getLastTags = async (req, res) => {
  try {
    const posts = await PostModel.find().limit(5).exec();

    const tags = posts
      .map((obj) => obj.tags)
      .flat()
      .slice(0, 5);

    res.json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      massage: "Не вдалося тримати статьї",
    });
  }
};

export const getOne = async (req, res) => {
  try {
    const postId = req.params.id;

    const updatedPost = await PostModel.findOneAndUpdate(
      {
        _id: postId,
      },
      {
        $inc: { viewsCount: 1 },
      },
      {
        new: true,
      }
    ).populate("user");
    if (!updatedPost) {
      return res.status(404).json({
        message: "Стаття не знайдена",
      });
    }
    res.json(updatedPost);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      massage: "Не вдалося отримати статью",
    });
  }
};

export const remove = async (req, res) => {
  try {
    const postId = req.params.id;

    const result = await PostModel.deleteOne({ _id: postId });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        message: "Статья не знайдена",
      });
    }

    res.json({
      success: true,
    });
    
  } catch (err) {
    console.log(err);
    res.status(500).json({
      massage: "Не вдалося отримати статью",
    });
  }
};

export const create = async (req, res) => {
  try {
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      imgeUrl: req.body.imgeUrl,
      tags: req.body.tags,
      user: req.userId,
    });

    const post = await doc.save();
    res.json(post);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      massage: "Не вдалося створити стятю",
    });
  }
};

export const update = async (req, res) => {
  try {
    const postId = req.params.id;

    await PostModel.updateOne(
      {
        _id: postId,
      },
      {
        title: req.body.title,
        text: req.body.text,
        imgeUrl: req.body.imgeUrl,
        tags: req.body.tags,
        user: req.userId,
      }
    );
    res.json({
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      massage: "Не вдалося оновити стятю",
    });
  }
};
