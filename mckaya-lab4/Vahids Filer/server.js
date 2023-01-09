const express = require('express');
const app = express();
const port = 8989;


app.get('/', (req, res) => {
    res.sendFile('/Users/vahid/OneDrive - KTH/intnet/intnet22/Frl/F9/ajax/index.html');
});

app.get('ms.js', (req, res) => {
    res.sendFile('/Users/vahid/OneDrive - KTH/intnet/intnet22/Frl/F9/ajax/ms.js');
});

app.get('challenge1.txt', (req, res) => {
    res.sendFile('/Users/vahid/OneDrive - KTH/intnet/intnet22/Frl/F9/ajax/challenge1.txt');
});


app.listen(port, () => {
    console.info(`Listening on port ${port}!`);
});
