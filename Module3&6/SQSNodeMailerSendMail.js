

const AWS = require('aws-sdk');
const sqs = new AWS.SQS();
const nodemailer = require('nodemailer');

exports.handler = async (event, context) => {
  try {
    // console.log(event+"event")
    const sqsQueueUrl = 'https://sqs.us-east-1.amazonaws.com/893061098969/sendMailSQS'; 

    const receiveParams = {
      QueueUrl: sqsQueueUrl,

      MaxNumberOfMessages: 1, 
      VisibilityTimeout: 30,
    };

    const data = await sqs.receiveMessage(receiveParams).promise();
    // console.log(data.Messages[0].Body+"d");
    const numMessages = data.Messages ? data.Messages.length : 0; 
    console.log(numMessages + "numxyz");
    if (!data.Messages) {
      console.log('No messages to process.');
      return {
        statusCode: 200,
        body: JSON.stringify('No messages to process.'),
      };
    }

    for (const message of data.Messages) {
      // Process SQS message
      const email = JSON.parse(message.Body).MessageAttributes.Email.Value;

      await sendEmail(email);
      console.log("email" + JSON.parse(message.Body).MessageAttributes.Email.Value);

      // Delete processed message
      await deleteSQSMessage(sqsQueueUrl, message.ReceiptHandle);
    }

    return {
      statusCode: 200,
      body: JSON.stringify('All messages processed '),
    };
  } catch (error) {
    console.error('Error processing messages:', error);
    return {
      statusCode: 500,
      body: JSON.stringify('Error processing messages.'),
    };
  }
};

async function deleteSQSMessage(queueUrl, receiptHandle) {
  const params = {
    QueueUrl: queueUrl,
    ReceiptHandle: receiptHandle,
  };

  await sqs.deleteMessage(params).promise();
}

async function sendEmail(email) {
  const senderEmailAddress = 'workemailsdp@gmail.com'; 
  const recipientEmailAddress = email; 

  const subject = 'Hello'; 
  const body = 'This is a test email.'; 

  // Create a nodemailer transporter using your Gmail account
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'workemailsdp@gmail.com', 
      pass: 'mdqhdfoxtwycuoos', 
    },
  });

  // Email content
  const mailOptions = {
    from: senderEmailAddress,
    to: recipientEmailAddress,
    subject: subject,
    text: body,
  };

  try {
    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.response);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error; 
  }
}

