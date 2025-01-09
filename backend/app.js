import express from 'express';
import cors from 'cors';

const app = express();

/*---------- Setting up middlewares ------ */
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => 
{
    res.status(200).json({
        message: "Server is running!"   
    })
})

/* Running the server */
const PORT = 3000;

app.listen(PORT, () => 
{
    console.log(`The server is up and running at http://localhost:${PORT}`);
})


