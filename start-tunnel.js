const localtunnel = require('localtunnel');

async function createTunnel() {
  try {
    const tunnel = await localtunnel({ port: 5173 });
    console.log('TUNNEL_ACTIVE_URL:', tunnel.url);

    // Fetch public IP to tell user their bypass password
    try {
      const res = await fetch('https://api.ipify.org?format=json');
      const data = await res.json();
      console.log('TUNNEL_PASSWORD:', data.ip);
    } catch (_) {}

    tunnel.on('close', () => {
      console.log('Tunnel connection closed. Reconnecting in 3 seconds...');
      setTimeout(createTunnel, 3000);
    });

    tunnel.on('error', (err) => {
      console.error('Tunnel error:', err.message);
      tunnel.close();
      setTimeout(createTunnel, 3000);
    });
  } catch (err) {
    console.error('Failed to create tunnel:', err.message);
    setTimeout(createTunnel, 4000);
  }
}

createTunnel();
