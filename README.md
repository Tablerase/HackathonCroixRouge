# Client for Crisis Prevention

## Technologies Used

- React
- Vite
- TypeScript
- Material UI
- React Leaflet

## Description

This project is a client for a crisis prevention application. It provides a user-friendly interface for users to interact with the crisis prevention system. The application is built using React and Vite, ensuring a fast and efficient development experience.

## Demo

1. User location
2. Crisis approximation (most likely for the user location - mocked for now - can be improved in the future)
3. Crisis prevention (using predefined crisis timelines for now to prevent halucinations - can be improved in the future)
4. Analysis of response: Feed to RAG model to analyze the response and provide feedback (LLM used for this)

## Setup

1. Clone the repository

```bash
git clone <repo-url>
```

2. Navigate to the project directory

```bash
cd <project-directory>
```

3. Install dependencies

```bash
npm install
```

4. Start the development server

```bash
npm run dev
```

5. Create build for production

````bash
echo "
VITE_API_URL=backend-url
" > .env
```

```bash
npm run build
````

## Example
