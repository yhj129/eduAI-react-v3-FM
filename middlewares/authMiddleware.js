// server\middleware\authMiddleware.js
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const isAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: '인증 토큰이 없습니다.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) return res.status(401).json({ message: '유효하지 않은 사용자입니다.' });

    req.user = user; // 요청 객체에 사용자 정보 추가
    next();
  } catch (err) {
    return res.status(401).json({ message: '토큰 검증 실패' });
  }
};