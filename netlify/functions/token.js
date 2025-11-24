const { AccessToken } = require('livekit-server-sdk');

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

        // Create access token using LiveKit's official SDK
        const at = new AccessToken(apiKey, apiSecret, {
            identity: participant_name,
            name: participant_name,
            ttl: '10m'
        });

        // Add video grants
        at.addGrant({
            roomJoin: true,
            room: room_name,
            canPublish: true,
            canSubscribe: true,
            canPublishData: true
        });

        const token = await at.toJwt();

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
