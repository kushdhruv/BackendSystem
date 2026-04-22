const Task = require('../models/Task');

/**
 * @desc    Create a new task
 * @route   POST /api/v1/tasks
 */
exports.createTask = async (req, res, next) => {
  try {
    const { title, description, status, priority, dueDate } = req.body;

    const task = await Task.create({
      title,
      description,
      status,
      priority,
      dueDate,
      user: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: 'Task created successfully.',
      data: { task },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all tasks (own tasks for user, all tasks for admin)
 * @route   GET /api/v1/tasks
 */
exports.getTasks = async (req, res, next) => {
  try {
    const { status, priority, page = 1, limit = 10, sortBy = 'createdAt', order = 'desc' } = req.query;

    // Build filter
    const filter = {};

    // Users see only their tasks, admins see all
    if (req.user.role !== 'admin') {
      filter.user = req.user._id;
    }

    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Task.countDocuments(filter);

    // Sort
    const sortOrder = order === 'asc' ? 1 : -1;
    const sort = { [sortBy]: sortOrder };

    const tasks = await Task.find(filter)
      .populate('user', 'name email')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      data: {
        tasks,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / parseInt(limit)),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single task by ID
 * @route   GET /api/v1/tasks/:id
 */
exports.getTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id).populate('user', 'name email');

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found.',
      });
    }

    // Check ownership (unless admin)
    if (req.user.role !== 'admin' && task.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this task.',
      });
    }

    res.status(200).json({
      success: true,
      data: { task },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a task
 * @route   PUT /api/v1/tasks/:id
 */
exports.updateTask = async (req, res, next) => {
  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found.',
      });
    }

    // Check ownership (unless admin)
    if (req.user.role !== 'admin' && task.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this task.',
      });
    }

    const { title, description, status, priority, dueDate } = req.body;
    const updates = {};
    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (status !== undefined) updates.status = status;
    if (priority !== undefined) updates.priority = priority;
    if (dueDate !== undefined) updates.dueDate = dueDate;

    task = await Task.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    }).populate('user', 'name email');

    res.status(200).json({
      success: true,
      message: 'Task updated successfully.',
      data: { task },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a task
 * @route   DELETE /api/v1/tasks/:id
 */
exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found.',
      });
    }

    // Check ownership (unless admin)
    if (req.user.role !== 'admin' && task.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this task.',
      });
    }

    await Task.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get task stats (admin only)
 * @route   GET /api/v1/tasks/stats
 */
exports.getTaskStats = async (req, res, next) => {
  try {
    const filter = req.user.role !== 'admin' ? { user: req.user._id } : {};

    const stats = await Task.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    const priorityStats = await Task.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 },
        },
      },
    ]);

    const total = await Task.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: {
        total,
        byStatus: stats.reduce((acc, s) => ({ ...acc, [s._id]: s.count }), {}),
        byPriority: priorityStats.reduce((acc, s) => ({ ...acc, [s._id]: s.count }), {}),
      },
    });
  } catch (error) {
    next(error);
  }
};
