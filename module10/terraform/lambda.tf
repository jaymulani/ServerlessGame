
# Create a Lambda function

resource "aws_lambda_function" "lex_lambda_function" {
  function_name    = "lex-lambda"
  runtime          = "nodejs14.x"
  handler          = "index.handler"
  filename         = "lex-bot.zip"
  source_code_hash = data.archive_file.lex_bot.output_base64sha256
  role             = data.aws_iam_role.lab_role.arn

  environment {
    variables = {
      NAVIGATION_TABLE = var.navigation_table
      TEAM_SCORE_TABLE = var.teams_table
    }
  }
}

resource "aws_lambda_permission" "allow_lex" {
  statement_id  = "AllowExecutionFromLex"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.lex_lambda_function.function_name
  principal     = "lex.amazonaws.com"
}

resource "aws_lambda_function" "lex_communicator" {
  function_name    = "lex-comm"
  runtime          = "nodejs14.x"
  handler          = "index.handler"
  filename         = "lex-comm.zip"
  source_code_hash = data.archive_file.lex_comm.output_base64sha256
  role             = data.aws_iam_role.lab_role.arn
}

resource "aws_lambda_function_url" "lex_comm_url" {
  function_name      = aws_lambda_function.lex_communicator.function_name
  authorization_type = "NONE"

  cors {
    allow_credentials = true
    allow_origins     = ["*"]
    allow_methods     = ["*"]
    allow_headers     = ["date", "keep-alive"]
    expose_headers    = ["keep-alive", "date"]
    max_age           = 86400
  }
}

resource "aws_lambda_permission" "lex_comm_allow" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.lex_communicator.function_name
  principal     = "apigateway.amazonaws.com"
}
