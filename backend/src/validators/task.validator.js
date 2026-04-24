const { body, param, query } = require('express-validator');

const createTaskValidator = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ min: 3, max: 100 }).withMessage('Title must be 3-100 characters')
    .escape(),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters')
    .escape(),
  body('status')
    .optional()
    .isIn(['pending', 'completed']).withMessage('Status must be: pending or completed'),
  body('dueDate')
    .optional()
    .isISO8601().withMessage('Due date must be a valid date'),
];

const updateTaskValidator = [
  param('id')
    .isMongoId().withMessage('Invalid task ID'),
  body('title')
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 }).withMessage('Title must be 3-100 characters')
    .escape(),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters')
    .escape(),
  body('status')
    .optional()
    .isIn(['pending', 'completed']).withMessage('Status must be: pending or completed'),
  body('dueDate')
    .optional()
    .isISO8601().withMessage('Due date must be a valid date'),
];

const taskIdValidator = [
  param('id')
    .isMongoId().withMessage('Invalid task ID'),
];

const listTasksValidator = [
  query('status')
    .optional()
    .isIn(['pending', 'completed']).withMessage('Invalid status filter'),
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Limit must be 1-100'),
];

module.exports = {
  createTaskValidator,
  updateTaskValidator,
  taskIdValidator,
  listTasksValidator,
};
