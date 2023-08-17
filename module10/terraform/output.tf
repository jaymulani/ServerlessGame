output "lex-communicator-url" {
  value = aws_lambda_function_url.lex_comm_url.function_url
}

# Output the API Gateway endpoint URL
output "api_gateway_endpoint" {
  value = aws_api_gateway_deployment.deployment.invoke_url
}
