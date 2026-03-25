import express from 'express';

const app = express();
const port = 9595;

app.use(express.json());

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});