resource "aws_cloudwatch_log_group" "lex" {
  name = "/aws/lambda/lex"
}

resource "aws_cloudwatch_log_group" "api_gateway_logs" {
  name = "/aws/api-gateway/${aws_api_gateway_rest_api.module_7_10_api_gw.id}"
}
