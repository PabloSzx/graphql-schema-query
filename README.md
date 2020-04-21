# graphql-schema-query

```sh
yarn add graphql-schema-query
# or
npm install graphql-schema-query
```

This small library is made to execute a GraphQL **query** or **mutation** without the need of any http request, and just using the GraphQL schema generated from [TypeGraphQL](https://typegraphql.com/), [Nexus Schema](https://www.nexusjs.org/#/components/schema/about) or any other.

Useful for **testing**, referencing your own resolvers without any hassle or **repeating code**.

And **specially** the reason I made this library, for [**getServerSideProps**](https://nextjs.org/docs/basic-features/data-fetching#getserversideprops-server-side-rendering) and [**getStaticProps**](https://nextjs.org/docs/basic-features/data-fetching#getstaticprops-static-generation) usage in [Next.js](https://nextjs.org/)

## Usage

```ts
import schemaQuery from 'graphql-schema-query';

// ...
import { makeSchema } from '@nexus/schema';

export const schema = makeSchema({
  // ...
});

// or

import { buildSchemaSync } from 'type-graphql';

export const schema = buildSchemaSync({
  // ...
});

// ...

export const executeFromSchema = schemaQuery(schema);
```

Then, anywhere you need to use it:

```ts
import { executeFromSchema } from './[anywhere]';
import { gql } from 'graphql-squema-query';
// import gql from "graphql-tag"; also works

const helloWorld = async () => {
  // You can use a plain string
  executeFromSchema(`query {
        helloWorld
    }`);

  // Or you can use a graphql-tag document,
  // which gives you some nice editor formatting
  executeFromSchema(gql`
    query {
      helloWorld
    }
  `);
};
```

### Protip

This library is using [**graphql-tag-ts**](https://www.npmjs.com/package/graphql-tag-ts), which can give you some nice type-safety from the gql tag itself, writing less code without any performance penalty.

For example:

```ts
import { executeFromSchema } from './[anywhere]';
import { gql, DocumentNode } from 'graphql-schema-query';
// import gql, { DocumentNode } from "graphql-tag-ts"; also works

const HelloWorldQuery: DocumentNode<
  {
    helloWorld: string;
  },
  {
    anyVariable: number;
  }
> = gql`
  query($anyVariable: String!) {
    helloWorld(anyVariable: $anyVariable)
  }
`;

const helloWorld = async () => {
  const data = await executeFromSchema(HelloWorldQuery);

  // data === { helloWorld: string } | undefined | null
};
```
