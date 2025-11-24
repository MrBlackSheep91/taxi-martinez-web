const { AccessToken } = require('livekit-server-sdk');

exports.handler = async (event) => {
    // Only allow POST
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        const { room_name, participant_name } = JSON.parse(event.body);

        if (!room_name || !participant_name) {
            return {
                statusCode: 400,
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
                body: JSON.stringify({ error: 'LiveKit credentials not configured' })
            };
        }

        // Create access token
        const token = new AccessToken(apiKey, apiSecret, {
            identity: participant_name,
            name: participant_name,
            ttl: '10m', // Token expires in 10 minutes
        });

        // Grant room permissions
        token.addGrant({
            room: room_name,
            roomJoin: true,
            canPublish: true,
            canSubscribe: true,
            canPublishData: true,
        });

        const jwt = await token.toJwt();

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({
                token: jwt,
                livekit_url: livekitUrl,
                room_name: room_name,
                participant_name: participant_name
            })
        };

    } catch (error) {
        console.error('Error generating token:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: 'Failed to generate token',
                message: error.message
            })
        };
    }
};
