import * as Joi from '@hapi/joi';

export const configValidationSchema = Joi.object({
    PORT: Joi.number().default(3000),
    STAGE: Joi.string(),
    DATABASE_URL: Joi.string(),
    POSTGRES_HOST: Joi.string(),
    POSTGRES_USER: Joi.string(),
    POSTGRES_PASSWORD: Joi.string(),
    POSTGRES_DB: Joi.string(),
    JWT_SECRET: Joi.string(),
});
