import { successResponse, validationError, notFoundResponse, errorResponse } from '../helpers/apiResponse.js';
import User from '../models/user.js';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userExists = await User.findOne({ email });
    if (!userExists) {
      return notFoundResponse(res, 'User does not exist');
    }
    const isPasswordCorrect = await bcrypt.compare(password, userExists.password);
    if (!isPasswordCorrect) {
      return validationError(res, 'Invalid credentials');
    }
    const token = jwt.sign({ email: userExists.email, id: userExists._id }, process.env.JWT_SECRET);
    userExists.password =undefined;

    return successResponse(res, 'User logged in successfully', { result: userExists, token });
  } catch (err) {
    return errorResponse(res, err.message);
  }
};

const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) {
      return errorResponse(res, 'User already exists');
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const result = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });
    const token = jwt.sign({ email: result.email, id: result._id }, process.env.JWT_SECRET);
    result.password =undefined;
    return successResponse(res, 'User created successfully', { result, token });
  } catch (err) {
    return errorResponse(res, err.message);
  }
};

const getUser = async (req, res) => {
  try {
    const secret = process.env.JWT_SECRET ;
    let token = req.headers.authorization?.split(' ')[1] || '';

    let decoded = jwt.verify(token, secret);
    const user = await User.findById(decoded.id);
    if (!user) {
      return notFoundResponse(res, 'User does not exist');
    }
    user.password =undefined
    const users = await User.find()
    return successResponse(res, 'User fetched successfully', { result: users });
  } catch (err) {
    return errorResponse(res, err.message);
  }
};

export { login, register, getUser };
