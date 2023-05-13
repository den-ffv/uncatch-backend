
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";




import UserModel from "../models/User.js";

// додав код для створення ролі
// перевіряє роль користувача і повертає помилку, якщо у користувача немає необхідної ролі
// export const checkRole = (role) => (req, res, next) => {
//   if (req.userRole !== role) {
//     return res.status(403).json({
//       message: "У вас немає прав доступу",
//     });
//   }
//   next();
// };

export const register =  async (req, res) => {
  try {

    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const doc = new UserModel({
      email: req.body.email,
      fullName: req.body.fullName,
      avatarUrl: req.body.avatarUrl,
      passwordHash: hash,
      role: "user",//роль
    });

    const user = await doc.save();

    const token = jwt.sign(
      {
        _id: user._id,
      },
      "secret123",
      {
        expiresIn: "30d",
      }
    );

    const { passwordHash, ...userData } = user._doc;

    res.json({
      ...userData,
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      massage: "Не вдалося зарееструватися",
    });
  }
};

export const login = async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({
        // вказувати що корситувача не знайдено це не зезпечно потрібно вказувати ("не вірний логин ало пороль"")
        massage: "Користувач не знайдений",
      });
    }

    const isValidPass = await bcrypt.compare(
      req.body.password,
      user._doc.passwordHash
    );

    if (!isValidPass) {
      return res.status(400).json({
        // вказувати що корситувача не знайдено це не зезпечно потрібно вказувати ("не вірна пошта ало пороль"")
        massage: "Не правельний логин або пороль",
      });
    }

    const token = jwt.sign(
      {
        _id: user._id,
      },
      "secret123",
      {
        expiresIn: "30d",
      }
    );
    const { passwordHash, ...userData } = user._doc;

    res.json({
      ...userData,
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      massage: "Не вдалося авторизуватися",
    });
  }
}

export const getMe = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        massage: "Користувача не знайдено",
      });
    }

    const { passwordHash, ...userData } = user._doc;

    res.json(userData);

  } catch (err) {
    console.log(err);
    res.status(500).json({
      massage: "Немає доступу",
    });
  }
}