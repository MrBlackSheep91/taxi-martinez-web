const jwt = require('jsonwebtoken');

exports.handler = async (event) => {
    // Handle CORS preflight
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'POST, OPTIONS'
            },
            body: ''
        };
    }

    // Only allow POST
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        const { room_name, participant_name } = JSON.parse(event.body);

        if (!room_name || !participant_name) {
            return {
                statusCode: 400,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                },
                body: JSON.stringify({ error: 'Missing room_name or participant_name' })
            };
        }

        // LiveKit credentials from environment variables
        const apiKey = process.env.LIVEKIT_API_KEY;
        const apiSecret = process.env.LIVEKIT_API_SECRET;
        const livekitUrl = process.env.LIVEKIT_URL;

        if (!apiKey || !apiSecret || !livekitUrl) {
            return {
                statusCode: 500,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                },
                body: JSON.stringify({
                    error: 'LiveKit credentials not configured',
                    debug: {
                        hasApiKey: !!apiKey,
                        hasApiSecret: !!apiSecret,
                        hasUrl: !!livekitUrl
                    }
                })
            };
        }

        // Create JWT payload for LiveKit
        const now = Math.floor(Date.now() / 1000);
        const payload = {
            iss: apiKey,
            sub: participant_name,
            name: participant_name,
            nbf: now,
            exp: now + 600, // 10 minutes
            video: {
                room: room_name,
                roomJoin: true,
                canPublish: true,
                canSubscribe: true,
                canPublishData: true
            }
        };

        // Sign the JWT using jsonwebtoken library
        const token = jwt.sign(payload, apiSecret, {
            algorithm: 'HS256'
        });

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({
                token: token,
                livekit_url: livekitUrl,
                room_name: room_name,
                participant_name: participant_name
            })
        };

    } catch (error) {
        console.error('Error generating token:', error);
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({
                error: 'Failed to generate token',
                message: error.message,
                stack: error.stack
            })
        };
    }
};
