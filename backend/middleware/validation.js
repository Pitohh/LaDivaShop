const Joi = require('joi');

const validateProduct = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(100).required(),
    description: Joi.string().min(10).max(1000).required(),
    price: Joi.number().positive().required(),
    originalPrice: Joi.number().positive().optional(),
    category: Joi.string().required(),
    stock: Joi.number().integer().min(0).required(),
    features: Joi.array().items(Joi.string()).optional(),
    specifications: Joi.object().optional(),
    isNew: Joi.boolean().optional(),
    isActive: Joi.boolean().optional()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ 
      error: 'Données invalides', 
      details: error.details[0].message 
    });
  }
  next();
};

const validateContent = (req, res, next) => {
  const schema = Joi.object({
    section: Joi.string().required(),
    key: Joi.string().required(),
    value: Joi.alternatives().try(
      Joi.string(),
      Joi.object(),
      Joi.array()
    ).required(),
    type: Joi.string().valid('text', 'image', 'json').required()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ 
      error: 'Données invalides', 
      details: error.details[0].message 
    });
  }
  next();
};

const validateCategory = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(50).required(),
    description: Joi.string().max(200).optional(),
    isActive: Joi.boolean().optional()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ 
      error: 'Données invalides', 
      details: error.details[0].message 
    });
  }
  next();
};

module.exports = {
  validateProduct,
  validateContent,
  validateCategory
};