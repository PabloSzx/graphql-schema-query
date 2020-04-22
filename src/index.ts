import { execute, GraphQLSchema, validateSchema, validate } from 'graphql';
import gql, { DocumentNode } from 'graphql-tag-ts';

export { default as gql, DocumentNode } from 'graphql-tag-ts';

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
      variables,
      context,
    }: {
      variables?: Variables;
      context?: any;
    } = {}
  ) => {
    if (typeof document === 'string') {
      document = gql(document);
    }

    const documentValidationErrors = validate(schema, document);

    if (documentValidationErrors.length) {
      throw documentValidationErrors;
    }

    const { data, errors } = await execute<Data>({
      schema,
      document,
      variableValues: variables,
      contextValue: context,
    });

    if (errors?.length) {
      throw errors;
    }
    return (
      data ??
      (() => {
        throw Error('Data could not be found');
      })()
    );
  };
};
