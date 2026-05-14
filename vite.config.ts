import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [
      react(),
      {
        name: 'api-chat-mock',
        configureServer(server) {
          server.middlewares.use('/api/chat', async (req, res) => {
            if (req.method !== 'POST') {
              res.statusCode = 405;
              res.end('Method Not Allowed');
              return;
            }

            let body = '';
            req.on('data', chunk => {
              body += chunk.toString();
            });
            req.on('end', async () => {
              try {
                const { messages } = JSON.parse(body);
                const apiKey = env.OPENAI_API_KEY;

                if (!apiKey || apiKey === 'your_openai_api_key_here') {
                  res.statusCode = 500;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ error: 'OPENAI_API_KEY is not configured in .env.local' }));
                  return;
                }

                const response = await fetch('https://api.openai.com/v1/chat/completions', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${apiKey}`,
                  },
                  body: JSON.stringify({
                    model: 'gpt-4o-mini', // Updated to an existing model to prevent API errors
                    messages,
                  }),
                });

                if (!response.ok) {
                  const errorData = await response.json();
                  res.statusCode = response.status;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ error: errorData }));
                  return;
                }

                const data = await response.json();
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(data));
              } catch (error) {
                res.statusCode = 500;
                res.end(JSON.stringify({ error: 'Internal Server Error' }));
              }
            });
          });
        }
      }
    ],
  }
})
