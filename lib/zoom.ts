export async function createZoomMeeting(
  topic: string,
  startTime: string,
  duration: number = 60
): Promise<string> {
  try {
    const zoomAccountId = process.env.ZOOM_ACCOUNT_ID!;
    const zoomClientId = process.env.ZOOM_CLIENT_ID!;
    const zoomClientSecret = process.env.ZOOM_CLIENT_SECRET!;

    // Get access token
    const tokenResponse = await fetch('https://zoom.us/oauth/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${zoomClientId}:${zoomClientSecret}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'account_credentials',
        account_id: zoomAccountId,
      }),
    });

    if (!tokenResponse.ok) {
      throw new Error('Failed to get Zoom access token');
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // Create meeting
    const meetingResponse = await fetch('https://api.zoom.us/v2/users/me/meetings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        topic,
        type: 2, // Scheduled meeting
        start_time: startTime,
        duration,
        settings: {
          host_video: true,
          participant_video: true,
          join_before_host: false,
          mute_upon_entry: true,
          waiting_room: false,
        },
      }),
    });

    if (!meetingResponse.ok) {
      throw new Error('Failed to create Zoom meeting');
    }

    const meetingData = await meetingResponse.json();
    return meetingData.join_url;
  } catch (error) {
    console.error('Error creating Zoom meeting:', error);
    // Return a placeholder URL if Zoom API fails
    return `https://zoom.us/j/placeholder-${Date.now()}`;
  }
}

