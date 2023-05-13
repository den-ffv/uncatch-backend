import { body } from "express-validator";

export const loginValidation = [
  body('email', 'error email').isEmail(),
  body('password', 'error pass').isLength({min:5})
];
export const registerValidation = [
  body('email', 'error email').isEmail(),
  body('password', 'error pass').isLength({min:5}),
  body('fullName', 'error name').isLength({min:5}),
  body('avatarUrl', 'error avatar').optional().isURL(),
];


export const postCreateValidation = [
  body('title', 'Введіть заголовок статьї').isLength({min:3}).isString(),
  body('text', 'Введіть текст статьї').isLength({min:5}).isString(),
  body('tags', 'Не вірний формат тегів (вкажіть масив)').optional().isString(),
  body('imgeUrl', 'Не вірне посилання на зображення').optional().isString(),
];