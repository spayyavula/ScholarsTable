import type { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';

const CONSTANT_CONTACT_V3_BASE_URL = 'https://api.constantcontact.com/v3';

export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  const { path, httpMethod, body, queryStringParameters } = event;

  // Extract the sub-path after /api/constant-contact
  // Example: if path is /api/constant-contact/contacts, subPath will be /contacts
  const subPath = path.replace('/api/constant-contact', '');

  const apiKey = process.env.CONSTANT_CONTACT_API_KEY;
  const accessToken = process.env.CONSTANT_CONTACT_ACCESS_TOKEN;

  if (!apiKey || !accessToken) {
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      },
      body: JSON.stringify({ 
        error: 'Constant Contact API credentials not configured in environment variables.',
        message: 'Please set CONSTANT_CONTACT_API_KEY and CONSTANT_CONTACT_ACCESS_TOKEN in your deployment environment.'
      }),
    };
  }

  // Handle CORS preflight requests
  if (httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      },
      body: '',
    };
  }

  let requestBody;
  if (body) {
    try {
      requestBody = JSON.parse(body);
    } catch (e) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ error: 'Invalid JSON body provided.' }),
      };
    }
  }

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}`,
    'X-API-Key': apiKey,
  };

  let url = `${CONSTANT_CONTACT_V3_BASE_URL}${subPath}`;

  // Append query parameters for GET requests
  if (httpMethod === 'GET' && queryStringParameters && Object.keys(queryStringParameters).length > 0) {
    const params = new URLSearchParams(queryStringParameters).toString();
    url += `?${params}`;
  }

  try {
    let response;
    
    // Log the request for debugging (remove in production)
    console.log(`Proxying ${httpMethod} request to: ${url}`);
    
    if (httpMethod === 'GET') {
      response = await fetch(url, { 
        method: httpMethod, 
        headers 
      });
    } else {
      response = await fetch(url, { 
        method: httpMethod, 
        headers, 
        body: requestBody ? JSON.stringify(requestBody) : undefined
      });
    }

    if (!response.ok) {
      const errorData = await response.text();
      let parsedError;
      
      try {
        parsedError = JSON.parse(errorData);
      } catch {
        parsedError = { message: errorData };
      }
      
      console.error(`Error from Constant Contact API (${response.status}):`, parsedError);
      
      return {
        statusCode: response.status,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          error: parsedError.errors || parsedError.message || 'Failed to communicate with Constant Contact API',
          status: response.status,
          details: parsedError
        }),
      };
    }

    const data = await response.json();
    
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error('Backend API proxy error:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        error: 'Internal server error during API proxy operation.',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      }),
    };
  }
};