const BaseJoi=require('joi');
const sanitizeHtml=require('sanitize-html'); //security related

const extension=(joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {                                                       //It is just a security issue resolved
                const clean=sanitizeHtml(value, {                                          //user will not be able to add html 
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean!==value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});

const Joi=BaseJoi.extend(extension)            //Basejoi is extended with the extension saved in joi

module.exports.campgroundSchema=Joi.object({
    campground: Joi.object({
        title: Joi.string().required().escapeHTML(),
        price: Joi.number().required().min(0),
        // image: Joi.string().required(),
        location: Joi.string().required().escapeHTML(),
        description: Joi.string().required().escapeHTML()
    }).required(),
    deleteImages: Joi.array()
});

module.exports.reviewSchema=Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        body: Joi.string().required().escapeHTML()
    }).required()
})  