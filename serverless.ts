import type { AWS } from '@serverless/typescript';

const serverlessConfiguration: AWS = {
  service: 'todo-serverless',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild', 'serverless-dynamodb-local', 'serverless-offline'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
    },
  },
  // import the function via paths
  functions: {
    createTodo: {
      handler: 'src/functions/createTodo.handler',
      events: [
        {
          http: {
            path: 'todos/{userId}',
            method: 'post',
            cors: true,
          }
        }
      ],
    },
    getAllUserTodos: {
      handler: 'src/functions/getAllUserTodos.handler',
      events: [
        {
          http: {
            path: 'todos/{userId}',
            method: 'get',
            cors: true,
          }
        }
      ],
    },
    updateTodo: {
      handler: 'src/functions/updateTodo.handler',
      events: [
        {
          http: {
            path: 'todos/{id}',
            method: 'put',
            cors: true,
          },
        }
      ],
    },
    toggleTodoStatus: {
      handler: 'src/functions/toggleTodoStatus.handler',
      events: [
        {
          http: {
            path: 'todos/{id}/status',
            method: 'patch',
            cors: true,
          }
        }
      ],
    },
    deleteTodo: {
      handler: 'src/functions/deleteTodo.handler',
      events: [
        {
          http: {
            path: 'todos/{id}',
            method: 'delete',
            cors: true,
          }
        }
      ],
    },
  },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
    dynamodb: {
      stages: ['dev', 'local'],
      start: {
        port: 8000,
        inMemory: true,
        migrate: true,
      },
    },
  },
  resources: {
    Resources: {
      dbTodos: {
        Type: 'AWS::DynamoDB::Table',
        Properties: {
          TableName: 'todos',
          ProvisionedThroughput: {
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 5,
          },
          AttributeDefinitions: [
            {
              AttributeName: 'id',
              AttributeType: 'S',
            },
          ],
          KeySchema: [
            {
              AttributeName: 'id',
              KeyType: 'HASH',
            },
          ],
        }
      }
    }
  }
};

module.exports = serverlessConfiguration;
