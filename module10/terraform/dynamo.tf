# Create a DynamoDB table
resource "aws_dynamodb_table" "navigation_table" {
  name           = var.navigation_table
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "id"
  attribute {
    name = "id"
    type = "N"
  }
}

/* resource "aws_dynamodb_table" "team_score_table" {
  name           = var.teams_table
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "id"
  attribute {
    name = "id"
    type = "N"
  }
} */
