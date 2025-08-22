import json
import boto3
import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime

def lambda_handler(event, context):
    """
    AWS Lambda function to handle contact form submissions
    Triggered via API Gateway
    """
    
    # CORS headers for browser requests
    headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
    }
    
    # Handle preflight OPTIONS request
    if event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({'message': 'CORS preflight'})
        }
    
    try:
        # Parse request body
        if 'body' in event:
            body = json.loads(event['body'])
        else:
            return {
                'statusCode': 400,
                'headers': headers,
                'body': json.dumps({'error': 'No request body provided'})
            }
        
        # Validate required fields
        required_fields = ['name', 'email', 'message']
        for field in required_fields:
            if not body.get(field):
                return {
                    'statusCode': 400,
                    'headers': headers,
                    'body': json.dumps({'error': f'{field} is required'})
                }
        
        name = body['name'].strip()
        email = body['email'].strip()
        message = body['message'].strip()
        subject = body.get('subject', 'General Inquiry')
        
        # Basic email validation
        if '@' not in email or '.' not in email:
            return {
                'statusCode': 400,
                'headers': headers,
                'body': json.dumps({'error': 'Invalid email format'})
            }
        
        # Send email via SMTP
        email_sent = send_contact_email(name, email, subject, message)
        
        if email_sent:
            # Optionally store in DynamoDB for tracking
            store_contact_submission(name, email, subject, message)
            
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps({
                    'message': 'Thank you! Your message has been sent successfully.',
                    'timestamp': datetime.utcnow().isoformat()
                })
            }
        else:
            return {
                'statusCode': 500,
                'headers': headers,
                'body': json.dumps({'error': 'Failed to send email. Please try again.'})
            }
            
    except json.JSONDecodeError:
        return {
            'statusCode': 400,
            'headers': headers,
            'body': json.dumps({'error': 'Invalid JSON in request body'})
        }
    except Exception as e:
        print(f"Error: {str(e)}")
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({'error': 'Internal server error'})
        }

def send_contact_email(name, email, subject, message):
    """
    Send contact form email using SMTP
    """
    try:
        # Get SMTP configuration from environment variables
        smtp_server = os.environ.get('SMTP_SERVER')
        smtp_port = int(os.environ.get('SMTP_PORT', 587))
        sender_email = os.environ.get('SENDER_EMAIL')
        sender_password = os.environ.get('SENDER_PASSWORD')
        admin_email = os.environ.get('ADMIN_EMAIL', sender_email)
        
        if not all([smtp_server, sender_email, sender_password]):
            print("Missing SMTP configuration")
            return False
        
        # Create HTML email content
        html_content = f"""
        <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">
                    New Contact Form Submission
                </h2>
                
                <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <p><strong style="color: #1f2937;">Name:</strong> {name}</p>
                    <p><strong style="color: #1f2937;">Email:</strong> {email}</p>
                    <p><strong style="color: #1f2937;">Subject:</strong> {subject}</p>
                </div>
                
                <div style="background-color: #fff; border: 1px solid #e5e7eb; padding: 20px; border-radius: 8px;">
                    <h3 style="color: #1f2937; margin-top: 0;">Message:</h3>
                    <div style="background-color: #f9fafb; padding: 15px; border-radius: 5px; border-left: 4px solid #2563eb;">
                        {message.replace(chr(10), '<br>')}
                    </div>
                </div>
                
                <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
                
                <div style="text-align: center; color: #6b7280; font-size: 14px;">
                    <p>This email was sent from your blog's contact form.</p>
                    <p>Reply directly to this email to respond to {name} at {email}</p>
                    <p><em>Sent via AWS Lambda • {datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S')} UTC</em></p>
                </div>
            </div>
        </body>
        </html>
        """
        
        # Create email message
        msg = MIMEMultipart('alternative')
        msg['From'] = f"Blog Contact Form <{sender_email}>"
        msg['To'] = admin_email
        msg['Reply-To'] = email  # Allow direct reply to sender
        msg['Subject'] = f"Contact Form: {subject} - from {name}"
        
        # Add HTML content
        html_part = MIMEText(html_content, 'html')
        msg.attach(html_part)
        
        # Send email
        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()
        server.login(sender_email, sender_password)
        server.sendmail(sender_email, admin_email, msg.as_string())
        server.quit()
        
        print(f"Contact email sent successfully from {name} ({email})")
        return True
        
    except Exception as e:
        print(f"Error sending contact email: {str(e)}")
        return False

def store_contact_submission(name, email, subject, message):
    """
    Store contact submission in DynamoDB for tracking (optional)
    """
    try:
        dynamodb = boto3.resource('dynamodb')
        table_name = os.environ.get('CONTACT_TABLE_NAME')
        
        if not table_name:
            print("No DynamoDB table configured, skipping storage")
            return
            
        table = dynamodb.Table(table_name)
        
        table.put_item(
            Item={
                'id': f"{int(datetime.utcnow().timestamp())}-{email}",
                'timestamp': datetime.utcnow().isoformat(),
                'name': name,
                'email': email,
                'subject': subject,
                'message': message,
                'status': 'received',
                'source': 'lambda'
            }
        )
        print("Contact submission stored in DynamoDB")
        
    except Exception as e:
        print(f"Error storing contact submission: {str(e)}")
        # Don't fail the entire request if storage fails