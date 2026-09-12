// FILE: apps/api-services/src/config/validation.schema.ts
import * as Joi from 'joi';

/** Fail-fast env validation for api-services (§4.2). */
export const validationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'test', 'production')
    .default('development'),
  SERVICES_PORT: Joi.number().port().default(3001),
  GATEWAY_API_KEY: Joi.string().min(32).required(),
  INTERNAL_JWT_PUBLIC_KEY: Joi.string().required(),
  DATABASE_URL_SERVICE: Joi.string().required(),
});
