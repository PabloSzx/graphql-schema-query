import graphql from 'graphql';
import gql, { DocumentNode } from 'graphql-tag-ts';

export { default as gql, DocumentNode } from 'graphql-tag-ts';

export default (schema: graphql.GraphQLSchema) => {
  const schemaValidationErrors = graphql.validateSchema(schema);
  if (schemaValidationErrors.length > 0) {
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
    const { data, errors } = await graphql.execute<Data>({
      schema,
      document,
      variableValues: variables,
      contextValue: context,
    });

    if (errors?.length) {
      throw errors;
    }
    return data;
  };
};
