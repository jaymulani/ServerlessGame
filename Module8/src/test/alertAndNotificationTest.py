import requests
import json
import random

# API Base URL
API_BASE_URL = "https://hnnioi27bd.execute-api.us-east-1.amazonaws.com/v1"

# Function to create a team
def create_team(team_name):
    url = f"{API_BASE_URL}/create-team"
    data = {
        "Team_Name": team_name
    }
    response = requests.post(url, json=data)
    return response.json()

# Function to invite a team member
def invite_team(team_name, user_email):
    url = f"{API_BASE_URL}/invite-team"
    data = {
        "Team_Name": team_name,
        "User_Email": user_email
    }
    response = requests.post(url, json=data)
    return response.json()

# Function to update notification settings for a team member
def update_notification(team_name, user_email, filter_list):
    url = f"{API_BASE_URL}/update-notification"
    data = {
        "Team_Name": team_name,
        "User_Email": user_email,
        "Filter_List": filter_list
    }
    response = requests.post(url, json=data)
    return response.json()

# Function to change a team member's team
def change_team(old_team_name, user_email, new_team_name):
    url = f"{API_BASE_URL}/change-team"
    data = {
        "OldTeamName": old_team_name,
        "UserEmail": user_email,
        "NewTeamName": new_team_name
    }
    response = requests.post(url, json=data)
    return response.json()

# Function to verify if a team member's email is subscribed to a team
def verify_email_within_team(team_name, user_email):
    url = f"{API_BASE_URL}/verify-email-within-team"
    data = {
        "TeamName": team_name,
        "UserEmail": user_email
    }
    response = requests.post(url, json=data)
    return response.json()

# Function to send a notification to a team with a specific filter
def send_notification(team_name, filter_name, email_topic, message):
    url = f"{API_BASE_URL}/send-notification"
    data = {
        "TeamName": team_name,
        "FilterName": filter_name,
        "EmailTopic": email_topic,
        "Message": message
    }
    response = requests.post(url, json=data)
    return response.json()

def NotificationTypes():
    team_name = "FactFanatics"
    
    # Game Invites
    game_invite_topic = "Game Invitation: Trivia Challenge"
    game_invite_message = '''Hi [name],\nYour Team [TeamName] Invited you to a Game!!!\nHow would you like to Respond?\n\nI will Definitely Accept It!! : https://GameURL/?gameId=1234&inviteAccepted=Yes\n\nNo, Some other day Please, Reject for now... : https://GameURL/?gameId=1234&inviteAccepted=No\n\n'''

    send_notification_response = send_notification(team_name, filter_name="GameInvite", email_topic=game_invite_topic, message=game_invite_message)
    print("Send Notification Response:", send_notification_response)

    # Team Updates
    team_update_topic = "Team Update: Strategy Discussion"
    team_update_message = f"""Hi [TeamMemberName],\nA new player joined your team - [TeamName].\n\nUpdate Details:\nTopic: Welcome New Team Member\nDescription: Let's welcome and plan our next move together!\n\n"""

    send_notification_response = send_notification(team_name, filter_name="TeamUpdate", email_topic=team_update_topic, message=team_update_message)
    print("Send Notification Response:", send_notification_response)

    # New Trivia Game Availability
    new_game_topic = "New Trivia Game Available!"
    new_game_message = f"""Hi [PlayerName],\nA new trivia game is now available.\n\nGame Details:\nStart Time: 2023-07-30 08:00 AM\nPrize Pool: $500\n\n"""

    send_notification_response = send_notification(team_name, filter_name="GameAvailability", email_topic=new_game_topic, message=new_game_message)
    print("Send Notification Response:", send_notification_response)

    # Achievements Unlocked
    achievement_topic = "Achievement Unlocked: Trivia Master"
    achievement_message = f"""Congratulations [PlayerName]!\nYou have unlocked the "Trivia Master" achievement.\n\nAchievement Details:\nName: Trivia Master\nScore: 1000\n\nKeep up the good work!\n\n"""
    
    send_notification_response = send_notification(team_name, filter_name="AchievementUnlocked", email_topic=achievement_topic, message=achievement_message)
    print("Send Notification Response:", send_notification_response)

    # Leaderboard Rank Changes
    rank_change_topic = "Leaderboard Rank Update"
    rank_change_message = f"""Hi [PlayerName],\nYour leaderboard rank has changed!\n\nRank Update:\nPrevious Rank: 5\nNew Rank: 3\nPoints Gained: +150\n\n"""

    send_notification_response = send_notification(team_name, filter_name="RankChange", email_topic=rank_change_topic, message=rank_change_message)
    print("Send Notification Response:", send_notification_response)

# Example Usage:
if __name__ == "__main__":
    NotificationTypes()
    team_name = "FactFanatics"
    user_email = "tejasreeamirneni@gmail.com" # Write user Email for testing
    filter_list = {
        "GameInvite": "true",
        "TeamUpdate": "true",
        "AchievementUnlocked": "true",
        "RankChange": "true",
        "GameAvailability": "true"
    }
    new_team_name = "FactFanatics"
    filter_name = "GameAvailability"
    email_topic = "New Game Announcement No."+str(round(random.random()*1000,0))
    message = "Join us for an exciting new game launch No. "+str(round(random.random()*1000,0))

    # Testing each endpoint

    invite_team_response = invite_team(team_name, user_email)
    print("Invite Team Response:", invite_team_response)

    update_notification_response = update_notification(team_name, user_email, filter_list)
    print("Update Notification Response:", update_notification_response)

    change_team_response = change_team(team_name, user_email, new_team_name)
    print("Change Team Response:", change_team_response)

    verify_email_response = verify_email_within_team(team_name, user_email)
    print("Verify Email Response:", verify_email_response)

    send_notification_response = send_notification(team_name, filter_name, email_topic, message)
    print("Send Notification Response:", send_notification_response)
