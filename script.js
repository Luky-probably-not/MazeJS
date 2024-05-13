import express from 'express';
const app = express();
const port = 8080;

app.use(express.static('web'));

app.listen(port, () => {
    console.log(`Serveur démarré sur http://localhost:${port}`);
});
