variable "aws_region" {
  default = "us-east-1"
}

#general
variable "lab_role_arn" {}
variable "lab_role_name" {}

#intent config
variable "navigation_utterances"{}
variable "teams_score_utterences"{}

#slot configs
variable "page_utterances"{}
variable "team_name_utterances"{}

#lambda
variable "lex_bot_lambda_name"{}
variable "navigation_table"{}
variable "teams_table"{}
