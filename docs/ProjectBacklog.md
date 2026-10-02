# Product Backlog

## Summit: Reddit with LLM Discussion Summarization

### User requirements:
- Create an account and log in.
- Users can update their account information when needed.
- Users can create a post with a title, description, and category.
- Users can browse posts and filter them by category.
- A post can also be created anonymously so other users do not see who posted it.
- Users can add and view replies under a post.
- Users can edit or delete their own posts and replies, and vote on posts and replies.
- After a post has enough replies, the user can view an AI summary of the replies.
- Users can refresh the AI summary when new replies are added.

### Technical requirements:
- Mobile application using React Native.
- Node.js and Express for the backend API.
- PostgreSQL database to store users, posts, replies, categories, and AI summaries.
- User authentication with secure password storage and login session.
- Keep posts and replies available after users leave and return to the app.
- Keep track of which user created each post and reply.
- Hide the user's identity from other users when a post is anonymous.
- Connect post replies to an LLM to generate the AI summary.
- Store the AI summary and allow it to refresh when new replies are added.
- Keep API keys and private account information on the backend.