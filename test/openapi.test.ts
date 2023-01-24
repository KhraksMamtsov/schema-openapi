import { pipe } from '@fp-ts/data/Function';
import * as S from '@fp-ts/schema/Schema';
import * as OA from '../src/openapi';

describe('simple', () => {
  it('simple post', () => {
    const schema = S.string;

    const spec = pipe(
      OA.openAPI('test', '0.1'),
      OA.path('/pet', OA.operation('post', OA.jsonRequest(schema)))
    );

    expect(spec).toStrictEqual({
      openapi: '3.0.3',
      info: {
        title: 'test',
        version: '0.1',
      },
      paths: {
        '/pet': {
          post: {
            requestBody: {
              content: {
                'application/json': {
                  schema: {
                    type: 'string',
                  },
                },
              },
            },
          },
        },
      },
    });
  });

  it('simple post with response using pipeable API', () => {
    const schema = S.string;

    const spec = pipe(
      OA.openAPI('test', '0.1'),
      OA.path(
        '/pet',
        OA.operation(
          'post',
          OA.jsonRequest(schema),
          OA.jsonResponse('200', schema)
        )
      )
    );

    expect(spec.paths['/pet'].post).toStrictEqual({
      requestBody: {
        content: {
          'application/json': {
            schema: {
              type: 'string',
            },
          },
        },
      },
      responses: {
        '200': {
          content: {
            'application/json': {
              schema: {
                type: 'string',
              },
            },
          },
        },
      },
    });
  });

  it('set description', () => {
    const schema = S.string;

    const spec = pipe(
      OA.openAPI('test', '0.1'),
      OA.info(OA.description('My API')),
      OA.path(
        '/pet',
        OA.operation(
          'post',
          OA.jsonRequest(schema),
          OA.jsonResponse('200', schema),
          OA.description('Store a pet')
        ),
        OA.description('Pet endpoint')
      )
    );

    expect(spec.info.description).toEqual('My API');
    expect(spec.paths['/pet'].post?.description).toEqual('Store a pet');
    expect(spec.paths['/pet'].description).toEqual('Pet endpoint');
  });

  it('set license', () => {
    const spec1 = pipe(OA.openAPI('test', '0.1'), OA.license('MIT'));

    expect(spec1.info.license?.name).toEqual('MIT');

    const spec2 = pipe(
      OA.openAPI('test', '0.1'),
      OA.license('MIT', 'http://patrik.com')
    );

    expect(spec2.info.license?.name).toEqual('MIT');
    expect(spec2.info.license?.url).toEqual('http://patrik.com');
  });

  it('set description', () => {
    const schema = S.string;

    const spec = pipe(
      OA.openAPI('test', '0.1'),
      OA.path(
        '/pet',
        OA.operation(
          'post',
          OA.jsonRequest(schema),
          OA.jsonResponse('200', schema),
          OA.summary('My summary')
        ),
        OA.summary('Pet stuff')
      )
    );

    expect(spec.paths['/pet'].post?.summary).toEqual('My summary');
    expect(spec.paths['/pet'].summary).toEqual('Pet stuff');
  });

  it('schema description', () => {
    const schema = S.string;

    const spec = pipe(
      OA.openAPI('test', '0.1'),
      OA.path(
        '/pet',
        OA.operation(
          'post',
          OA.jsonRequest(schema, OA.description('request description')),
          OA.jsonResponse('200', schema, OA.description('response description'))
        )
      )
    );

    expect(spec.paths['/pet'].post?.responses?.['200']?.description).toEqual(
      'response description'
    );

    expect(spec.paths['/pet'].post?.requestBody?.description).toEqual(
      'request description'
    );
  });

  it('servers', () => {
    const spec1 = pipe(
      OA.openAPI('test', '0.1'),
      OA.server('http://server.com')
    );

    expect(spec1.servers).toStrictEqual([{ url: 'http://server.com' }]);

    const spec2 = pipe(
      OA.openAPI('test', '0.1'),
      OA.server('http://server-prod.com'),
      OA.server('http://server-sandbox.com')
    );

    expect(spec2.servers).toStrictEqual([
      { url: 'http://server-prod.com' },
      { url: 'http://server-sandbox.com' },
    ]);

    const spec3 = pipe(
      OA.openAPI('test', '0.1'),
      OA.server('http://server.com', OA.description('production'))
    );

    expect(spec3.servers).toStrictEqual([
      { url: 'http://server.com', description: 'production' },
    ]);

    const spec4 = pipe(
      OA.openAPI('test', '0.1'),
      OA.server(
        'http://server.com',
        OA.description('production'),
        OA.variable('username', 'demo', OA.description('username')),
        OA.variable('port', '8443', OA.enum('8443', '443'))
      )
    );

    expect(spec4.servers).toStrictEqual([
      {
        url: 'http://server.com',
        description: 'production',
        variables: {
          username: { default: 'demo', description: 'username' },
          port: { default: '8443', enum: ['8443', '443'] },
        },
      },
    ]);
  });

  it('path parameters', () => {
    const schema = S.string;

    const spec = pipe(
      OA.openAPI('test', '0.1'),
      OA.path(
        '/pet/{id}',
        OA.operation(
          'post',
          OA.jsonRequest(schema),
          OA.jsonResponse('200', schema)
        ),
        OA.summary('Pet stuff'),
        OA.parameter(
          'id',
          'query',
          OA.required,
          OA.deprecated,
          OA.allowEmptyValue,
          OA.description('id')
        )
      )
    );

    expect(spec.paths['/pet/{id}'].parameters).toEqual([
      {
        name: 'id',
        in: 'query',
        description: 'id',
        required: true,
        deprecated: true,
        allowEmptyValue: true,
      },
    ]);
  });

  it('operation parameters', () => {
    const schema = S.string;

    const spec = pipe(
      OA.openAPI('test', '0.1'),
      OA.path(
        '/pet/{id}',
        OA.operation(
          'post',
          OA.jsonRequest(schema),
          OA.jsonResponse('200', schema),
          OA.parameter('id', 'query', OA.required, OA.description('id'))
        ),
        OA.summary('Pet stuff')
      )
    );

    expect(spec.paths['/pet/{id}'].post?.parameters).toEqual([
      {
        name: 'id',
        in: 'query',
        description: 'id',
        required: true,
      },
    ]);
  });

  it('request body', () => {
    const schema = S.string;

    const spec = pipe(
      OA.openAPI('test', '0.1'),
      OA.path(
        '/pet/{id}',
        OA.operation(
          'post',
          OA.jsonRequest(schema, OA.description('schema'), OA.required),
          OA.jsonResponse('200', schema),
          OA.parameter('id', 'query', OA.required, OA.description('id'))
        ),
        OA.summary('Pet stuff')
      )
    );

    expect(spec.paths['/pet/{id}'].post?.requestBody).toEqual({
      content: {
        'application/json': {
          schema: { type: 'string' },
        },
      },
      required: true,
      description: 'schema',
    });
  });
});
