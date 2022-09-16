import express, { Application, json } from 'express';

const port = process.env.PORT || 4000;
const app: Application = express();

app.use(json());

app.listen(port, () => {
    console.log(`Server started at port ${port}`);
});
