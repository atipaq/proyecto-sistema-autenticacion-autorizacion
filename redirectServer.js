const express = require('express');
const app = express();

app.get('/callback', (req, res) => {
    const { code } = req.query;
    res.send(`Authorization Code received: ${code}`);
});

const PORT = 4000;
app.listen(PORT, () => {
    console.log(`Redirect server running on http://localhost:${PORT}`);
});
