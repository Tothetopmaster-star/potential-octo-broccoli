# potential-octo-broccoli
potential-octo-broccoli
# Nova AI

A fully functional ChatGPT-like AI chat app powered by the Anthropic API. Built with React 18 + TypeScript + Vite on the frontend and Node.js + Express on the backend, with real-time SSE streaming.

## Features

- Real-time SSE token streaming with animated cursor
- - Conversation history persisted in localStorage with date grouping
  - - Auto-generated titles via separate API call
    - - Model selector: Nova (claude-sonnet-4-20250514) and Nova Mini (claude-haiku-4-5-20251001)
      - - Copy, thumbs up/down on message hover
        - - Retry on failed messages
          - - Collapsible sidebar with drawer on mobile
            - - Cmd+K = new chat shortcut
              - - Stop button while streaming
                - - Scroll-to-bottom floating button
                  - - Message timestamps on hover
                    - - Electric blue (#00D4FF) accent color
                      - - Dark theme (#0d0d0d background)
                       
                        - ## Setup
                       
                        - ```bash
                          # 1. Clone and install dependencies
                          git clone <repo-url> nova-ai
                          cd nova-ai
                          npm run install:all

                          # 2. Set up environment
                          cp .env.example backend/.env
                          # Edit backend/.env and add your ANTHROPIC_API_KEY

                          # 3. Start development servers
                          npm run dev
                          ```

                          Frontend runs at http://localhost:5173
                          Backend runs at http://localhost:3001

                          ## Project Structure

                          ```
                          /
                          ├── backend/
                          │   ├── src/
                          │   │   ├── index.ts          # Express server
                          │   │   └── routes/chat.ts    # SSE chat + title endpoints
                          │   ├── package.json
                          │   └── tsconfig.json
                          ├── frontend/
                          │   ├── src/
                          │   │   ├── components/       # React components
                          │   │   ├── store/            # Zustand state
                          │   │   ├── types/            # TypeScript types
                          │   │   ├── App.tsx
                          │   │   └── main.tsx
                          │   ├── package.json
                          │   └── vite.config.ts
                          ├── .env.example
                          └── package.json
                          ```

                          ## API

                          `POST /api/chat` - SSE streaming chat
                          `POST /api/title` - Generate conversation title
                          
