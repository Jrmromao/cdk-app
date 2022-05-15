import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
// import { Code, Function as LambdaFunction, Runtime } from 'aws-cdk-lib/lib/aws-lambda';
import { join } from "path";
import {
  AuthorizationType,
  LambdaIntegration,
  MethodOptions,
  RestApi,
} from "aws-cdk-lib/aws-apigateway";
import { GenericTable } from "./GenericTable";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";
import { AuthorizerWapper } from "./auth/AuthorizerWrapper";

export class SpaceStack extends Stack {
  private api = new RestApi(this, "SpaceApi");
  private authorizer: AuthorizerWapper;

  private spacesTable = new GenericTable(this, {
    tableName: "SpacesTable",
    primaryKey: "spaceId",
    createLambdaPath: "Create",
    readLambdaPath: "Read",
    updateLambdaPath: "Update",
    deleteLambdaPath: "Delete",
    secondareIndexex: ["location"],
  });

  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);
    this.authorizer = new AuthorizerWapper(this, this.api);

    const helloLambdaNodeJs = new NodejsFunction(this, "helloLambdaNodeJs", {
      entry: join(__dirname, "..", "services", "node-lambda", "hello.ts"),
      handler: "handler",
    });
    const s3ListPolicy = new PolicyStatement();
    s3ListPolicy.addActions("s3:ListAllMyBuckets");
    s3ListPolicy.addResources("*");
    helloLambdaNodeJs.addToRolePolicy(s3ListPolicy);

    const optionWithAuthorizer: MethodOptions = {
      authorizationType: AuthorizationType.COGNITO,
      authorizer: {
        authorizerId: this.authorizer.authorizer.authorizerId,
      },
    };

    // Hello Api lambda integration:
    const helloLambdaIntegration = new LambdaIntegration(helloLambdaNodeJs);
    const helloLambdaResource = this.api.root.addResource("hello");
    helloLambdaResource.addMethod(
      "GET",
      helloLambdaIntegration,
      optionWithAuthorizer
    );

    //Spaces API integrations:
    const spaceResource = this.api.root.addResource("spaces");
    spaceResource.addMethod(
      "POST",
      this.spacesTable.createLambdaIntegration,
      optionWithAuthorizer
    );
    spaceResource.addMethod(
      "GET",
      this.spacesTable.readLambdaIntegration,
      optionWithAuthorizer
    );
    spaceResource.addMethod(
      "PUT",
      this.spacesTable.updateLambdaIntegration,
      optionWithAuthorizer
    );
    spaceResource.addMethod(
      "DELETE",
      this.spacesTable.deleteLambdaIntegration,
      optionWithAuthorizer
    );
  }
}
