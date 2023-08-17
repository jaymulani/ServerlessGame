/* data "aws_lambda_function" "lex" {
  function_name  = var.lex_bot_lambda_name
} */

data "aws_iam_role" "lab_role" {
  name = var.lab_role_name
}

data "archive_file" "lex_bot" {
  type = "zip"
  source_file = "${path.module}/lambdas/lex-bot/index.js"
  output_path = "lex-bot.zip"
}

data "archive_file" "lex_comm" {
  type = "zip"
  source_file = "${path.module}/lambdas/lex-comm/index.js"
  output_path = "lex-comm.zip"
}
