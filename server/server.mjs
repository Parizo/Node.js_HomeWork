import express from 'express';

import usersRouter from "./routes/index.mjs"

import menuRouter from "./routes/index.mjs"

const app = express();

app.use(express.json());

app.use('/api/v1/library', usersRouter);

const PORT = 5000





app.listen(PORT, () => {
    console.log('Serveris klausosi ant 5000 porto')
});