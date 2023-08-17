# Create an AWS Lex bot
resource "aws_lex_bot" "trivia_bot" {
  name             = "TriviaBot"
  description      = "Trivia Lex bot"
  process_behavior = "BUILD"
  child_directed   = false

  abort_statement {
    message {
      content      = "Thanks for connecting with us!"
      content_type = "PlainText"
    }
  }

  clarification_prompt {
    max_attempts = 2

    message {
      content      = "I didn't understand you, what would you like to do?"
      content_type = "PlainText"
    }
  }


  intent {
    intent_name    = aws_lex_intent.navigation.name
    intent_version = aws_lex_intent.navigation.version
  }

  intent {
    intent_name    = aws_lex_intent.team_score.name
    intent_version = aws_lex_intent.team_score.version
  }

}

# Define the intents for the bot
resource "aws_lex_intent" "navigation" {
  name           = "navigation"
  description    = "intent for navigating user to a page"
  create_version = false

  sample_utterances = var.navigation_utterances

  fulfillment_activity {
    type = "CodeHook"
    code_hook {
      message_version = "1.0"
      uri             = aws_lambda_function.lex_lambda_function.arn
    }
  }

  slot {
    description = "The page to be navigated to"
    name        = "page"
    priority    = 1

    sample_utterances = var.page_utterances

    slot_constraint = "Required"
    slot_type       = "AMAZON.AlphaNumeric"

    value_elicitation_prompt {
      max_attempts = 2

      message {
        content      = "which link do you need?"
        content_type = "PlainText"
      }
    }
  }

  depends_on = [aws_lambda_permission.allow_lex]
}

resource "aws_lex_intent" "team_score" {
  name           = "teamScore"
  description    = "intent for fetching a teams score based on names"
  create_version = false

  sample_utterances = var.teams_score_utterences

  fulfillment_activity {
    type = "CodeHook"
    code_hook {
      message_version = "1.0"
      uri             = aws_lambda_function.lex_lambda_function.arn
    }
  }

  slot {
    description = "Team name to fetch a score."
    name        = "teamName"
    priority    = 1

    sample_utterances = var.team_name_utterances

    slot_constraint = "Required"
    slot_type       = "AMAZON.AlphaNumeric"

    value_elicitation_prompt {
      max_attempts = 2

      message {
        content      = "What is the team name?"
        content_type = "PlainText"
      }
    }
  }
  depends_on = [aws_lambda_permission.allow_lex]
}

# Connect the Lex bot to the Lambda function
resource "aws_lex_bot_alias" "lex_bot_alias" {
  bot_name    = aws_lex_bot.trivia_bot.name
  bot_version = aws_lex_bot.trivia_bot.version
  name        = "TriviaBotAlias"
  description = "Alias for my Lex bot"
  conversation_logs {
    iam_role_arn = data.aws_iam_role.lab_role.arn
    log_settings {
      log_type     = "TEXT"
      destination  = "CLOUDWATCH_LOGS"
      resource_arn = aws_cloudwatch_log_group.lex.arn
    }
  }
}
