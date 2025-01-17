import { Schema } from '@effect/schema';

export type AnySchema = Schema.Schema<any, any, any>;

export type OpenAPISpec<S = AnySchema> = {
  openapi: '3.0.3';
  info: OpenAPISpecInfo;
  servers?: OpenAPISpecServer[];
  paths: OpenAPISpecPaths<S>;
  components?: OpenAPIComponents<S>;
  security?: OpenAPISecurityRequirement[];
  tags?: OpenAPISpecTag[];
  externalDocs?: OpenAPISpecExternalDocs;
};

export type OpenAPISpecInfo = {
  title: string;
  version: string;
  description?: string;
  license?: OpenAPISpecLicense;
};

export type OpenAPISpecTag = {
  name: string;
  description?: string;
  externalDocs?: OpenAPISpecExternalDocs;
};

export type OpenAPISpecExternalDocs = {
  url: string;
  description?: string;
};

export type OpenAPISpecLicense = {
  name: string;
  url?: string;
};

export type OpenAPISpecServer = {
  url: string;
  description?: string;
  variables?: Record<string, OpenAPISpecServerVariable>;
};

export type OpenAPISpecServerVariable = {
  default: string;
  enum?: [string, ...string[]];
  description?: string;
};

export type OpenAPISpecPaths<S = AnySchema> = Record<
  string,
  OpenAPISpecPathItem<S>
>;

export type OpenAPISpecMethodName =
  | 'get'
  | 'put'
  | 'post'
  | 'delete'
  | 'options'
  | 'head'
  | 'patch'
  | 'trace';

export type OpenAPISpecPathItem<S = AnySchema> = {
  [K in OpenAPISpecMethodName]?: OpenAPISpecOperation<S>;
} & {
  summary?: string;
  description?: string;
  parameters?: OpenAPISpecParameter[];
};

export type OpenAPISpecParameter<S = AnySchema> = {
  name: string;
  in: 'query' | 'header' | 'path' | 'cookie';
  schema: S;
  description?: string;
  required?: boolean;
  deprecated?: boolean;
  allowEmptyValue?: boolean;
};

export type OpenAPISpecStatusCode = 200 | 201;

export type OpenAPISpecResponses<S = AnySchema> = {
  [K in OpenAPISpecStatusCode]?: OpenApiSpecResponse<S>;
};

export type OpenApiSpecContentType = 'application/json' | 'application/xml';

export type OpenApiSpecContent<S = AnySchema> = {
  [K in OpenApiSpecContentType]?: OpenApiSpecMediaType<S>;
};

export type OpenApiSpecResponseHeader<S = AnySchema> = {
  description?: string;
  schema: S;
};

export type OpenApiSpecResponseHeaders<S = AnySchema> = Record<
  string,
  OpenApiSpecResponseHeader<S>
>;

export type OpenApiSpecResponse<S = AnySchema> = {
  content: OpenApiSpecContent<S>;
  headers?: OpenApiSpecResponseHeaders<S>;
  description: string;
};

export type OpenApiSpecMediaType<S = AnySchema> = {
  schema?: S;
  example?: object;
  description?: string;
};

export type OpenAPISpecRequestBody<S = AnySchema> = {
  content: OpenApiSpecContent<S>;
  description?: string;
  required?: boolean;
};

export type OpenAPISpecReference = {
  $ref: string;
};

export type OpenAPIComponents<S = AnySchema> = {
  schemas?: Record<string, S>;
  securitySchemes?: Record<string, OpenAPISecurityScheme>;
};

export type OpenAPIHTTPSecurityScheme = {
  type: 'http';
  scheme: string;
  bearerFormat?: string;
};

export type OpenAPIApiKeySecurityScheme = {
  type: 'apiKey';
  name: string;
  in: 'query' | 'header' | 'cookie';
};

export type OpenAPIMutualTLSSecurityScheme = {
  type: 'mutualTLS';
};

export type OpenAPIOAuth2SecurityScheme = {
  type: 'oauth2';
  flows: Record<
    'implicit' | 'password' | 'clientCredentials' | 'authorizationCode',
    Record<string, unknown>
  >;
};

export type OpenAPIOpenIdConnectSecurityScheme = {
  type: 'openIdConnect';
  openIdConnectUrl: string;
};

export type OpenAPISecurityScheme =
  | OpenAPIHTTPSecurityScheme
  | OpenAPIApiKeySecurityScheme
  | OpenAPIMutualTLSSecurityScheme
  | OpenAPIOAuth2SecurityScheme
  | OpenAPIOpenIdConnectSecurityScheme
  | OpenAPISpecReference;

export type OpenAPISecurityRequirement = Record<string, string[]>;

export type OpenAPISpecOperation<S = AnySchema> = {
  requestBody?: OpenAPISpecRequestBody<S>;
  responses?: OpenAPISpecResponses<S>;
  operationId?: string;
  description?: string;
  parameters?: OpenAPISpecParameter<S>[];
  summary?: string;
  deprecated?: boolean;
  tags?: string[];
  security?: OpenAPISecurityRequirement[];
  externalDocs?: OpenAPISpecExternalDocs;
};

// Open API schema

export type OpenAPISchemaNullType = {
  type: 'null';
};

export type OpenAPISchemaStringType = {
  type: 'string';
  minLength?: number;
  maxLength?: number;
  nullable?: boolean;
};

export type OpenAPISchemaNumberType = {
  type: 'number' | 'integer';
  minimum?: number;
  exclusiveMinimum?: boolean;
  maximum?: number;
  exclusiveMaximum?: boolean;
  nullable?: boolean;
};

export type OpenAPISchemaBooleanType = {
  type: 'boolean';
  nullable?: boolean;
};

export type OpenAPISchemaArrayType = {
  type: 'array';
  items?: OpenAPISchemaType | Array<OpenAPISchemaType>;
  minItems?: number;
  maxItems?: number;
  additionalItems?: OpenAPISchemaType;
  nullable?: boolean;
};

export type OpenAPISchemaEnumType = {
  enum: Array<string | number | boolean>;
  nullable?: boolean;
};

export type OpenAPISchemaOneOfType = {
  oneOf: ReadonlyArray<OpenAPISchemaType>;
  nullable?: boolean;
};

export type OpenAPISchemaAllOfType = {
  allOf: Array<OpenAPISchemaType>;
  nullable?: boolean;
};

export type OpenAPISchemaObjectType = {
  type: 'object';
  required?: Array<string>;
  properties?: { [x: string]: OpenAPISchemaType };
  additionalProperties?: boolean | OpenAPISchemaType;
  nullable?: boolean;
};

export type OpenAPISchemaAnyType = {};

export type OpenAPISchemaType = {
  description?: string;
} & (
  | OpenAPISchemaNullType
  | OpenAPISchemaStringType
  | OpenAPISchemaNumberType
  | OpenAPISchemaBooleanType
  | OpenAPISchemaArrayType
  | OpenAPISchemaEnumType
  | OpenAPISchemaOneOfType
  | OpenAPISchemaAllOfType
  | OpenAPISchemaObjectType
  | OpenAPISchemaAnyType
  | OpenAPISpecReference
);
