resource "aws_api_gateway_rest_api" "module_7_10_api_gw" {
  name = "Module_7_10"
}

resource "aws_api_gateway_account" "api_gw_account" {
  cloudwatch_role_arn = var.lab_role_arn
}
# Resource for /bot
resource "aws_api_gateway_resource" "bot_resource" {
  rest_api_id = aws_api_gateway_rest_api.module_7_10_api_gw.id
  parent_id   = aws_api_gateway_rest_api.module_7_10_api_gw.root_resource_id
  path_part   = "bot"
  depends_on  = [aws_api_gateway_rest_api.module_7_10_api_gw]
}

# Lambda integration for /bot resource
resource "aws_api_gateway_integration" "bot_lambda_integration" {
  rest_api_id             = aws_api_gateway_rest_api.module_7_10_api_gw.id
  resource_id             = aws_api_gateway_resource.bot_resource.id
  http_method             = "ANY"
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = "arn:aws:apigateway:${var.aws_region}:lambda:path/2015-03-31/functions/${aws_lambda_function.lex_communicator.arn}/invocations"
  depends_on              = [aws_api_gateway_resource.bot_resource, aws_api_gateway_rest_api.module_7_10_api_gw, aws_lambda_function.lex_communicator]
}

# Method for /bot resource
resource "aws_api_gateway_method" "bot_method" {
  rest_api_id   = aws_api_gateway_rest_api.module_7_10_api_gw.id
  resource_id   = aws_api_gateway_resource.bot_resource.id
  http_method   = "ANY"
  authorization = "NONE"
  depends_on    = [aws_api_gateway_rest_api.module_7_10_api_gw, aws_api_gateway_resource.bot_resource]
}


# Method integration for /bot resource
resource "aws_api_gateway_integration" "bot_method_integration" {
  rest_api_id             = aws_api_gateway_rest_api.module_7_10_api_gw.id
  resource_id             = aws_api_gateway_resource.bot_resource.id
  http_method             = aws_api_gateway_method.bot_method.http_method
  integration_http_method = aws_api_gateway_integration.bot_lambda_integration.integration_http_method
  type                    = aws_api_gateway_integration.bot_lambda_integration.type
  uri                     = aws_api_gateway_integration.bot_lambda_integration.uri
  depends_on              = [aws_api_gateway_rest_api.module_7_10_api_gw, aws_api_gateway_resource.bot_resource, aws_api_gateway_integration.bot_lambda_integration]
}


# Deployment of the API
resource "aws_api_gateway_deployment" "deployment" {
  depends_on = [
    aws_api_gateway_integration.bot_method_integration
  ]
  rest_api_id = aws_api_gateway_rest_api.module_7_10_api_gw.id
}

# CloudWatch Logs for API Gateway
resource "aws_api_gateway_stage" "api_gateway_stage" {
  deployment_id = aws_api_gateway_deployment.deployment.id
  rest_api_id   = aws_api_gateway_rest_api.module_7_10_api_gw.id
  stage_name    = "prod"

  # Enable logging for the stage
  access_log_settings {
    destination_arn = aws_cloudwatch_log_group.api_gateway_logs.arn
    format          = "{\"requestId\":\"$context.requestId\", \"ip\": \"$context.identity.sourceIp\",\"requestTime\":\"$context.requestTime\", \"httpMethod\":\"$context.httpMethod\", \"routeKey\":\"$context.routeKey\", \"status\":\"$context.status\", \"protocol\":\"$context.protocol\",\"responseLength\":\"$context.responseLength\"}"
  }
  depends_on = [aws_api_gateway_deployment.deployment, aws_api_gateway_rest_api.module_7_10_api_gw]
}

#Bot response cors
resource "aws_api_gateway_method_response" "bot_response_200" {
  rest_api_id = aws_api_gateway_rest_api.module_7_10_api_gw.id
  resource_id = aws_api_gateway_resource.bot_resource.id
  http_method = aws_api_gateway_method.bot_method.http_method
  status_code = "200"
  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = true,
    "method.response.header.Access-Control-Allow-Methods" = true,
    "method.response.header.Access-Control-Allow-Origin"  = true
  }
  depends_on = [aws_api_gateway_rest_api.module_7_10_api_gw, aws_api_gateway_resource.bot_resource, aws_api_gateway_method.bot_method]
}

resource "aws_api_gateway_integration_response" "options_integration_response" {
  rest_api_id = aws_api_gateway_rest_api.module_7_10_api_gw.id
  resource_id = aws_api_gateway_resource.bot_resource.id
  http_method = aws_api_gateway_method.bot_method.http_method
  status_code = aws_api_gateway_method_response.bot_response_200.status_code
  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'",
    "method.response.header.Access-Control-Allow-Methods" = "'GET,OPTIONS,POST,PUT,DELETE'",
    "method.response.header.Access-Control-Allow-Origin"  = "'*'"
  }
  depends_on = [aws_api_gateway_method_response.bot_response_200]
}
