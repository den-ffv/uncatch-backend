import PostModel from "../models/Post.js";
import UserModel from "../models/User.js";
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



export const saveToProfile = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.userId;
    const user = await UserModel.findById(userId);
    const post = await PostModel.findById(postId);
    if (!user.savedPosts) {
      user.savedPosts = []; 
    }
    user.savedPosts.push(postId); 
    await user.save();
    if (!post) {
      return res.status(404).json({
        message: "Пост не знайдено",
      });
    }

    res.json({
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не вдалося зберегти пост у профіль",
    });
  }
};

export const showSavePost = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await UserModel.findById(userId).populate("savedPosts");

    if (!user) {
      return res.status(404).json({
        message: "Користувач не знайдений",
      });
    }

    res.status(200).json(user.savedPosts);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не вдалося отримати збережені пости",
    });
  }
};

export const removeFromProfile = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.userId;

    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "Користувач не знайдений",
      });
    }

    if (user.savedPosts.includes(postId)) {
      user.savedPosts = user.savedPosts.filter(
        (savedPost) => savedPost.toString() !== postId
      );
      await user.save();
    }

    res.json({
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не вдалося видалити пост зі збережених",
    });
  }
};
