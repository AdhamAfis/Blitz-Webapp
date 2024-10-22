import { NextResponse } from 'next/server';

const BASE_URL = 'http://localhost/v1/chat-messages';
const API_KEY = process.env.API_KEY;;

const DEFAULT_USER = "default-user-id"; 

export async function POST(req) {
  try {
    const body = await req.json();
  
    const {
      query= body.messages,               
      user = DEFAULT_USER,   
      conversation_id = '',   
      files = [],            
    } = body;

    if (!query) {
      return new Response('Query is required.', { status: 400 });
    }

    const payload = {
      inputs: {}, 
      query,      
      response_mode: 'blocking', 
      conversation_id,
      user,
      files,
    };

    console.log('Payload to send:', JSON.stringify(payload, null, 2));

    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text(); // Get error details from the response
      throw new Error(`Failed to send chat message: ${response.statusText} - ${errorText}`);
    }

    const jsonResponse = await response.json();
    
    console.log('API Response:', jsonResponse);

    const answer = jsonResponse.answer || 'No answer available';

    return new Response(answer, { status: 200, headers: { 'Content-Type': 'text/plain' } });

  } catch (error) {
    console.error('Request error:', error);
    return new Response(`Internal Server Error: ${error.message}`, { status: 500 });
  }
}