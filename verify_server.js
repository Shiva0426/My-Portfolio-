const http = require('http');

console.log("Verifying local portfolio server...");

http.get('http://localhost:3000/', (res) => {
  console.log(`Status Code: ${res.statusCode}`);
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    console.log(`Received data length: ${data.length} bytes`);
    if (res.statusCode === 200 && data.includes('Shiva Darshan')) {
      console.log("SUCCESS: Portfolio served correctly! ✅");
      process.exit(0);
    } else {
      console.error("FAIL: Portfolio HTML check failed ❌");
      process.exit(1);
    }
  });
}).on('error', (err) => {
  console.error("FAIL: Server could not be reached ❌", err.message);
  process.exit(1);
});
