aws_region    = "us-east-1"
lab_role_arn  = "arn:aws:iam::594577747972:role/LabRole"
lab_role_name = "LabRole"

#intent config
navigation_utterances = [
  "I would like to {page}",
  "I would like to {page}",
  "navigate me to {page}",
  "take me to {page}",
  "go to {page}",
  "let me {page}",
  "navigate to {page}",
  "open {page}",
  "show how to {page}",
  "guide to {page}",
  "guide for {page}",
  "navigate",
  "go",
  "link for {page}",
  "link to {page}",
  "link to",
  "link for"
]
teams_score_utterences = [
  "get me scores for {teamName}",
  "can I gets scores for {teamName}",
  "score for {teamName}",
  "score for team {teamName}",
  "scores {teamName}",
  "score for team {teamName}",
  "team's score for {teamName}",
  "score of {teamName}",
  "scores for {teamName}",
  "scores for",
  "scores of",
  "score for",
  "score of",
  "{teamName} scores",
  "{teamName} score",
  "scores",
  "score",
  "points",
  "point"
  ]

#slot configs
page_utterances = [
  "I would like to navigate to {page}",
  "I would like to go to {page}",
  "take me to {page}",
  "how to reach {page}",
  "go to {page}"
]

team_name_utterances = [
  "scores for {teamName}",
  "get me scores for {teamName}",
  "scores {teamName}"
]

#Lambda
lex_bot_lambda_name = "lex"
navigation_table = "trivia.navigations"
teams_table = "trivia.teams"
