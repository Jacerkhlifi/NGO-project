exports.handler = async (event, context) => {
  // Handle PayPal webhook or donation processing
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const donationData = JSON.parse(event.body);
    
    // Log donation for tracking
    console.log('Donation received:', donationData);
    
    // Here you would typically:
    // 1. Verify the payment with PayPal
    // 2. Store donation in database
    // 3. Send confirmation email
    // 4. Update donor records
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: JSON.stringify({ 
        success: true, 
        message: 'Donation processed successfully' 
      })
    };

  } catch (error) {
    console.error('Error processing donation:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ 
        error: 'Failed to process donation' 
      })
    };
  }
};
