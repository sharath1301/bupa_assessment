import express from 'express';
import type { Application, Request, Response } from 'express';
import cors from 'cors';
import NodeCache from 'node-cache';

const app: Application = express();
const port = process.env.PORT || 3000;

app.use(cors({'origin': 'http://localhost:4200'}));
app.use(express.json());

interface Book {
  name: string;
  type: 'Hardcover' | 'Paperback' | 'Ebook';
}

interface BooksByOwner {
  name: string;
  age: number;
  books: Book[];
}

const myCache = new NodeCache({ stdTTL: 60 }); 
// Cache Middleware
const cacheMiddleware = (duration: number) => {
  return (req:Request, res:Response, next:Function) => {
    if (req.method !== 'GET') return next();
    const key = req.originalUrl; 
    const cachedResponse = myCache.get(key);

    if (cachedResponse) {
      res.set('Content-Type', cachedResponse.contentType);
      return res.send(cachedResponse.body);
    }

    const originalSend = res.send;
    res.send = function (body) {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        myCache.set(key, {
          body: body,
          contentType: res.get('Content-Type')
        }, duration);
      }
      originalSend.call(this, body);
    };

    next();
  };
};

app.get('/api/bookowners', async (req: Request, res: Response) => {
    try{
        const url = 'https://digitalcodingtest.bupa.com.au/api/v1/bookowners';

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseText = await response.text();

        if(responseText.length === 0) {
            throw new Error('Received empty response from the API');
        }

        const data: BooksByOwner[] = JSON.parse(responseText);
        res.set('Cache-Control', 'public, max-age=300, stale-while-revalidate=60');
        res.json(data);
    } catch (error) {
        console.error('Error fetching book owners:', error);
        res.status(500).json({ error: 'Internal Server Error' });   

    }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});