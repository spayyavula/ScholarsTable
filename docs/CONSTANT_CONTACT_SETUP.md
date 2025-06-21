# Constant Contact Integration Setup Guide

This guide will help you set up Constant Contact integration for email marketing automation in your Scholars Table application.

## Prerequisites

1. A Constant Contact account (sign up at [constantcontact.com](https://constantcontact.com))
2. A Netlify account for deploying the serverless functions
3. Basic understanding of API keys and environment variables

## Step 1: Create Constant Contact Developer Account

1. **Sign up for Constant Contact** if you haven't already
2. **Navigate to the Developer Portal**:
   - Go to [developer.constantcontact.com](https://developer.constantcontact.com)
   - Sign in with your Constant Contact credentials
3. **Create a New Application**:
   - Click "Create New App"
   - Fill in your application details:
     - App Name: "Scholars Table"
     - Description: "Educational gaming platform email marketing"
     - Website URL: Your domain (e.g., https://scholarstable.com)
   - Accept the terms and create the app

## Step 2: Get API Credentials

After creating your app, you'll receive:

1. **API Key**: Found in your app dashboard
2. **Client ID**: Also in your app dashboard  
3. **Client Secret**: Keep this secure!

## Step 3: Generate Access Token

You'll need to generate an OAuth 2.0 access token:

1. **Authorization URL**: Use this format:
   ```
   https://authz.constantcontact.com/oauth2/default/v1/authorize?client_id=YOUR_CLIENT_ID&redirect_uri=YOUR_REDIRECT_URI&response_type=code&scope=contact_data+campaign_data+account_read+account_update
   ```

2. **Exchange Code for Token**: After authorization, exchange the code for an access token using your backend

3. **Store the Access Token**: This token will be used for API calls

## Step 4: Configure Environment Variables

### For Local Development

Create a `.env.local` file in your project root:

```env
CONSTANT_CONTACT_API_KEY=your_api_key_here
CONSTANT_CONTACT_ACCESS_TOKEN=your_access_token_here
CONSTANT_CONTACT_CLIENT_ID=your_client_id_here
CONSTANT_CONTACT_CLIENT_SECRET=your_client_secret_here
```

### For Production (Netlify)

1. **Go to your Netlify site dashboard**
2. **Navigate to**: Site settings > Build & deploy > Environment variables
3. **Add the following variables**:
   - `CONSTANT_CONTACT_API_KEY`: Your API key
   - `CONSTANT_CONTACT_ACCESS_TOKEN`: Your access token
   - `CONSTANT_CONTACT_CLIENT_ID`: Your client ID
   - `CONSTANT_CONTACT_CLIENT_SECRET`: Your client secret

## Step 5: Set Up Contact Lists

Create the following lists in your Constant Contact account:

1. **Newsletter Subscribers**: General newsletter list
2. **Pro Subscribers**: Paid subscribers to Scholar Pro
3. **Premium Subscribers**: Paid subscribers to Scholar Elite
4. **Coding Enthusiasts**: Users interested in programming
5. **Tournament Participants**: Active tournament participants
6. **Free Trial Users**: Users on free trial

## Step 6: Create Email Templates

Set up these email templates in Constant Contact:

### Welcome Series (5 emails)
1. **Welcome Email**: Immediate welcome message
2. **Getting Started**: Platform overview (1 day delay)
3. **Feature Highlights**: Key features tour (3 days delay)
4. **Success Stories**: User testimonials (7 days delay)
5. **Upgrade Invitation**: Premium features (14 days delay)

### Transactional Emails
1. **Subscription Confirmation**: Payment successful
2. **Feature Access**: New features unlocked
3. **Tournament Notifications**: New tournaments
4. **Course Completion**: Achievement notifications

## Step 7: Test the Integration

### Test Newsletter Signup

```javascript
// Example: Test newsletter signup
const testSignup = async () => {
  try {
    const response = await fetch('/api/constant-contact/contacts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        lists: ['newsletter']
      })
    });
    
    const result = await response.json();
    console.log('Signup successful:', result);
  } catch (error) {
    console.error('Signup failed:', error);
  }
};
```

### Test Campaign Creation

```javascript
// Example: Create a test campaign
const testCampaign = async () => {
  try {
    const response = await fetch('/api/constant-contact/campaigns', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test Campaign',
        subject: 'Welcome to Scholars Table!',
        fromEmail: 'hello@scholarstable.com',
        fromName: 'Scholars Table Team',
        htmlContent: '<h1>Welcome!</h1><p>Thank you for joining us.</p>',
        lists: ['newsletter']
      })
    });
    
    const result = await response.json();
    console.log('Campaign created:', result);
  } catch (error) {
    console.error('Campaign creation failed:', error);
  }
};
```

## Step 8: Set Up Automation Sequences

### Welcome Sequence
Create an automation that triggers when someone joins the newsletter list:

1. **Trigger**: Contact added to "Newsletter Subscribers" list
2. **Email 1**: Welcome message (immediate)
3. **Email 2**: Getting started guide (1 day delay)
4. **Email 3**: Feature highlights (3 days delay)
5. **Email 4**: Success stories (7 days delay)
6. **Email 5**: Upgrade invitation (14 days delay)

### Subscription Management
Create automations for subscription events:

1. **Payment Confirmation**: Triggered by successful payment
2. **Feature Access**: Triggered by subscription upgrade
3. **Renewal Reminders**: Triggered 7 days before renewal
4. **Win-back Campaign**: Triggered by subscription cancellation

## Step 9: Monitor and Optimize

### Key Metrics to Track

1. **Open Rates**: Aim for 20-25% industry average
2. **Click Rates**: Aim for 2-5% industry average
3. **Unsubscribe Rate**: Keep below 2%
4. **List Growth**: Track new subscribers vs. unsubscribes
5. **Conversion Rate**: Newsletter to paid subscription

### A/B Testing

Test these elements:
- Subject lines
- Send times
- Email content
- Call-to-action buttons
- Sender names

## Troubleshooting

### Common Issues

1. **401 Unauthorized**: Check your access token and API key
2. **403 Forbidden**: Verify your app permissions and scopes
3. **Rate Limiting**: Implement proper retry logic with exponential backoff
4. **Invalid Email**: Ensure email validation before sending to API

### Debug Mode

Enable debug logging in your Netlify function:

```javascript
// Add this to your function for debugging
console.log('Request details:', {
  method: httpMethod,
  path: subPath,
  body: requestBody
});
```

### Support Resources

- [Constant Contact API Documentation](https://developer.constantcontact.com/api_guide/index.html)
- [Constant Contact Support](https://knowledgebase.constantcontact.com/)
- [OAuth 2.0 Guide](https://developer.constantcontact.com/api_guide/auth_overview.html)

## Security Best Practices

1. **Never commit API keys** to version control
2. **Use environment variables** for all sensitive data
3. **Implement rate limiting** to prevent abuse
4. **Validate all input data** before sending to API
5. **Use HTTPS** for all API communications
6. **Rotate access tokens** regularly
7. **Monitor API usage** for unusual activity

## Next Steps

After successful setup:

1. **Create your first campaign** using the marketing dashboard
2. **Set up automation sequences** for user onboarding
3. **Implement tracking** for email performance
4. **Create segmented lists** based on user behavior
5. **Design responsive email templates** for better engagement

Your Constant Contact integration is now ready to power your email marketing campaigns!