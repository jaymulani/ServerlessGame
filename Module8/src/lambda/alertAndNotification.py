# Import required libraries
import json
import boto3

# Initialize AWS SNS client
sns = boto3.client('sns')

# Function to create CORS headers
def create_cors_headers():
    return {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS, POST, GET, PUT, DELETE',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '86400' 
    }

# Function to get all SNS topics
def get_all_sns_topics():
    topics = []
    next_token = None

    while True:
        # Retrieve a page of topics
        response = sns.list_topics(NextToken=next_token) if next_token else sns.list_topics()

        # Check if the specified topic exists in the list
        filtered_topics = [topic for topic in response['Topics'] if topic['TopicArn'] != 'arn:aws:sns:us-east-1:878833144803:RedshiftSNS']

        # Add the filtered topics to the list
        topics.extend(filtered_topics)

        # If there are more topics, get the next page using the NextToken
        if 'NextToken' in response:
            next_token = response['NextToken']
        else:
            break

    return topics

# Function to get SNS topic ARN by team name
def get_topic_arn_by_team_name(team_name):
    topics = get_all_sns_topics()

    for topic in topics:
        if team_name in topic['TopicArn']:
            return topic['TopicArn']

    return None

# Function to get subscription ARN by topic ARN and email
def get_subscription_arn(topic_arn, email):
    subscriptions = sns.list_subscriptions_by_topic(TopicArn=topic_arn)['Subscriptions']

    for sub in subscriptions:
        if sub['Protocol'] == 'email' and sub['Endpoint'] == email:
            return sub['SubscriptionArn']

    return None

# Function to create a new team and SNS topic
def create_team(event):
    data = json.loads(event['body'])
    team_name = data['Team_Name']

    # Check if the team topic already exists
    topic_arn = get_topic_arn_by_team_name(team_name)

    if topic_arn:
        # If the team topic already exists, return its ARN
        response = {
            'statusCode': 200,
            'body': json.dumps({'Topic_ARN': topic_arn, 'Message': f'Topic for team {team_name} already exists.'})
        }
    else:
        # Create a new SNS topic with the team name
        topic_arn = sns.create_topic(Name=team_name)['TopicArn']
        response = {
            'statusCode': 200,
            'body': json.dumps({'Topic_ARN': topic_arn, 'Message': f'Topic for team {team_name} created.'})
        }

    response['headers'] = create_cors_headers()

    return response

# Function to invite a user to a team
def invite_team(event):
    data = json.loads(event['body'])
    team_name = data['Team_Name']
    user_email = data['User_Email']

    topic_arn = get_topic_arn_by_team_name(team_name)
    if topic_arn:
        sns.subscribe(
            TopicArn=topic_arn,
            Protocol='email',
            Endpoint=user_email
        )

        response = {
            'statusCode': 200,
            'body': json.dumps({'Message': f'Invited {user_email} to {team_name} topic.'})
        }
    else:
        response = {
            'statusCode': 404,
            'body': json.dumps({'Message': f'Team {team_name} not found.'})
        }

    response['headers'] = create_cors_headers()

    return response

# Function to update notification settings for a user
def update_notification(event):
    data = json.loads(event['body'])
    team_name = data['Team_Name']
    user_email = data['User_Email']
    filters = data['Filter_List']

    # Get the topic ARN for the team
    topic_arn = get_topic_arn_by_team_name(team_name)

    if topic_arn:
        # Apply the filter policy to the user email subscription
        filter_policy = []
        for key, value in filters.items():
            if value == 'true':
                filter_policy.append(key)

        sns.set_subscription_attributes(
            SubscriptionArn=get_subscription_arn(topic_arn, user_email),
            AttributeName='FilterPolicy',
            AttributeValue=json.dumps({'settings':filter_policy})
        )
        response = {
            'statusCode': 200,
            'body': json.dumps({'Message': f'Filter policy applied to {user_email} in {team_name} topic.'})
        }
    else:
        response = {
            'statusCode': 404,
            'body': json.dumps({'Message': f'Team {team_name} not found.'})
        }

    response['headers'] = create_cors_headers()

    return response

# Function to change a user's team
def change_team(event):
    data = json.loads(event['body'])
    old_team_name = data['OldTeamName']
    user_email = data['UserEmail']
    new_team_name = data['NewTeamName']

    # Get the topic ARNs for both old and new teams
    old_topic_arn = get_topic_arn_by_team_name(old_team_name)
    new_topic_arn = get_topic_arn_by_team_name(new_team_name)

    if old_topic_arn and new_topic_arn:
        # Verify if the user email is subscribed to the old team
        old_subscription_arn = get_subscription_arn(old_topic_arn, user_email)

        if old_subscription_arn:
            # Read the filter policy from the old subscription
            filters = sns.get_subscription_attributes(SubscriptionArn=old_subscription_arn)['Attributes'].get('FilterPolicy', '{}')

            # Subscribe the user email to the new team along with filters
            sns.subscribe(
                TopicArn=new_topic_arn,
                Protocol='email',
                Endpoint=user_email,
                Attributes={
                    'FilterPolicy': filters
                }
            )

            # Remove the user email from the old team
            sns.unsubscribe(SubscriptionArn=old_subscription_arn)

            response = {
                'statusCode': 200,
                'body': json.dumps({'Message': f'{user_email} moved from {old_team_name} to {new_team_name}.'})
            }
        else:
            response = {
                'statusCode': 404,
                'body': json.dumps({'Message': f'{user_email} is not subscribed to {old_team_name}.'})
            }
    else:
        response = {
            'statusCode': 404,
            'body': json.dumps({'Message': 'One or both teams not found.'})
        }

    response['headers'] = create_cors_headers()

    return response

# Function to verify if a user's email is subscribed to a team
def verify_email_within_team(event):
    data = json.loads(event['body'])
    team_name = data['TeamName']
    user_email = data['UserEmail']

    # Get the topic ARN for the team
    topic_arn = get_topic_arn_by_team_name(team_name)

    if topic_arn:
        # Check if the user email is subscribed to the team topic
        subscription_arn = get_subscription_arn(topic_arn, user_email)

        if subscription_arn:
            # Verify if the subscription is confirmed
            subscription = sns.get_subscription_attributes(SubscriptionArn=subscription_arn)['Attributes']
            is_confirmed = subscription.get('PendingConfirmation', 'true') == 'false'

            response = {
                'statusCode': 200,
                'body': json.dumps({'IsSubscribed': 'true', 'IsConfirmed': is_confirmed})
            }
        else:
            response = {
                'statusCode': 200,
                'body': json.dumps({'IsSubscribed': 'false', 'IsConfirmed': 'false'})
            }
    else:
        response = {
            'statusCode': 404,
            'body': json.dumps({'Message': f'Team {team_name} not found.'})
        }

    response['headers'] = create_cors_headers()

    return response

# Function to send a notification to a team with a specific filter
def send_notification(event):
    data = json.loads(event['body'])
    team_name = data['TeamName']
    filter_name = data['FilterName']
    email_topic = data['EmailTopic']
    message = data['Message']

    # Get the topic ARN for the team
    topic_arn = get_topic_arn_by_team_name(team_name)

    if topic_arn:
        # Send notification to subscribers with the specified filter name
        val = sns.publish(
            TopicArn=topic_arn,
            Message=message,
            Subject=email_topic,
            MessageAttributes={
                'settings': {
                    'DataType': 'String',
                    'StringValue': filter_name
                }
            }
        )

        response = {
            'statusCode': 200,
            'body': json.dumps({'Message': 'Notification sent successfully.'})
        }
    else:
        response = {
            'statusCode': 404,
            'body': json.dumps({'Message': f'Team {team_name} not found.'})
        }

    response['headers'] = create_cors_headers()

    return response

# Function to broadcast a notification to all teams with a specific filter
def broadcast_notification(event):
    data = json.loads(event['body'])
    filter_name = data['FilterName']
    email_topic = data['EmailTopic']
    message = data['Message']

    # Get the topic ARN for all teams
    topics = get_all_sns_topics()
    topic_arns = [topic['TopicArn'] for topic in topics]

    try:
        for topic_arn in topic_arns:
            # Send notification to subscribers with the specified filter name
            val = sns.publish(
                TopicArn=topic_arn,
                Message=message,
                Subject=email_topic,
                MessageAttributes={
                    'settings': {
                        'DataType': 'String',
                        'StringValue': filter_name
                    }
                }
            )

        response = {
            'statusCode': 200,
            'body': json.dumps({'Message': 'Notification sent successfully.'})
        }
    except Exception as error:
        print(error)
        response = {
            'statusCode': 404,
            'body': json.dumps({'Message': 'Broadcast failed. Some users may not get the notification.'})
        }

    response['headers'] = create_cors_headers()

    return response

# Function to combine CORS headers with response
def combine_headers(response):
    headers = {
        'headers': {
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'OPTIONS, POST'
        }
    }
    combined_dict = response.copy()
    combined_dict.update(headers)
    return combined_dict

# Lambda function handler
def lambda_handler(event, context):
    resource_path = event['resource']
    if resource_path == '/create-team':
        return combine_headers(create_team(event))
    elif resource_path == '/invite-team':
        return combine_headers(invite_team(event))
    elif resource_path == '/update-notification':
        return combine_headers(update_notification(event))
    elif resource_path == '/change-team':
        return combine_headers(change_team(event))
    elif resource_path == '/verify-email-within-team':
        return combine_headers(verify_email_within_team(event))
    elif resource_path == '/send-notification':
        return combine_headers(send_notification(event))
    elif resource_path == '/team-broadcast':
        return combine_headers(broadcast_notification(event))
    else:
        return {
            'headers': {
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'OPTIONS, POST'
            },
            'statusCode': 404,
            'body': json.dumps({'Message': 'Invalid API path.'})
        }
