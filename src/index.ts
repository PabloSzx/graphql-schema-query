import { execute, GraphQLSchema, validateSchema, validate } from 'graphql';
import gql, { DocumentNode } from 'graphql-tag-ts';

export { default as gql, DocumentNode } from 'graphql-tag-ts';

const defaultValidateDoc = process.env.NODE_ENV !== 'production';

const defaultEmptyObject = {};

export default (schema: GraphQLSchema) => {
  const schemaValidationErrors = validateSchema(schema);
  if (schemaValidationErrors.length) {
    throw schemaValidationErrors;
  }

  return async <
    Data extends Record<string, unknown> = Record<string, any>,
    Variables extends Record<string, unknown> = Record<string, any>
  >(
    document: DocumentNode<Data, Variables> | string,
    {
      variables: variableValues,
      context: contextValue,
      validateDoc = defaultValidateDoc,
    }: {
      variables?: Variables;
      context?: any;
      /**
       * Validate query/mutation into the schema before executing it
       *
       * By default is true in development and in production
       * is turned off.
       */
      validateDoc?: boolean;
    } = defaultEmptyObject
  ) => {
    if (typeof document === 'string') {
      document = gql(document);
    }

    if (validateDoc) {
      const documentValidationErrors = validate(schema, document);

      if (documentValidationErrors.length) {
        throw documentValidationErrors;
      }
    }

    const { data, errors } = await execute<Data>({
      schema,
      document,
      variableValues,
      contextValue,
    });

    if (errors?.length) {
      throw errors;
    }
    return (
      data ||
      (() => {
        throw Error('Data could not be found');
      })()
    );
  };
};
