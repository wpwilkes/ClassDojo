# Product Backlog: RedditSummit

## User Requirements

### User Accounts and Community Access
- Users can create an account and log in.
- Users can view posts and replies from other users.
- Users can create posts and reply to existing posts.
- Users can view their own posts and replies.

### Post Creation and Browsing
- Users can create a post with a title and description.
- Users can select a category when creating a post.
- Users can choose to publish a post normally or anonymously.
- Users can browse posts created by other users.
- Users can open a post to view the full discussion.
- Users can see the number of replies associated with a post.

### Post Categories
- Users can assign a category to a post when they create it.
- Users can see the category assigned to each post.
- Users can browse posts by category.
- Users can filter posts based on category.
- The application will provide a predefined set of post categories.

### Replies and Discussion
- Users can reply to an existing post.
- Users can view all replies associated with a post.
- New replies appear as part of the existing discussion.
- Users can continue participating in a discussion by adding additional replies.

### Primary Twist: AI-Generated Reply Summary
- After a post receives a required number of replies, users can view an AI-generated summary of the discussion.
- The AI summary should combine the main ideas from the replies into a shorter and easier-to-read summary.
- The summary should identify the major points discussed in the replies.
- Users can refresh the AI summary after additional replies are added.
- The refreshed summary should include the newer replies.
- The application must clearly identify the summary as AI-generated.

### Twist 2: Anonymous Posting
- Users can choose an Anonymous Post option before publishing a post.
- Other users must not see the identity of the person who created an anonymous post.
- Anonymous posts must otherwise behave like normal posts.
- Users can view and reply to anonymous posts.
- A user can create both normal and anonymous posts from the same account.


## Technical Requirements

### User Accounts and Authentication
- The system must securely store user account information.
- The system must authenticate users before they create posts or replies.
- Each user must have a unique account identifier.
- The system must maintain the user's login session while the application is in use.
- User login information must remain separate from publicly displayed post information.

### Data Storage and Relationships
- The system must store users, posts, replies, categories, anonymity status, and AI summaries.
- Each post must have a unique identifier.
- Each reply must have a unique identifier.
- Each normal post must be internally linked to the account that created it.
- Each reply must be linked to both its author and the correct post.
- Relationships between users, posts, replies, categories, and summaries must be maintained in the database.
- Posts and replies must remain available after users log out and return later.

### Post Data
- The system must store the title, description, category, creation time, and author information for each post.
- The system must store whether each post is normal or anonymous.
- The system must connect each post to its associated replies.
- The system must track the number of replies associated with each post.
- The system must retrieve posts for display in the application feed.

### Category System
- The system must maintain a predefined list of available post categories.
- Each post must be linked to one category.
- The system must support retrieving posts based on category.
- The system must support filtering the post feed by category.

### Reply System
- Each reply must be linked to the correct post.
- The system must store the reply text, author, and creation time.
- The system must update the reply count when a new reply is added.
- Replies must remain associated with their original post.
- Replies must remain available after users log out and return later.

### AI Summary System
- The system must track whether a post has reached the required number of replies for AI summarization.
- The system must allow an AI summary to be generated after the required reply threshold is reached.
- The system must send the relevant post replies to an LLM service when a summary is requested.
- The system must receive and display the generated summary.
- The system must store the generated summary with the correct post.
- The system must record when the summary was generated.
- The system must detect when additional replies have been added after the previous summary.
- The system must allow the summary to be refreshed when newer replies are available.
- A refreshed summary must use the updated set of replies.
- AI service credentials must not be stored directly in the client application.

### Anonymous Post Handling
- The system must store an anonymity setting for each post.
- The system must maintain an internal connection between an anonymous post and the account that created it.
- The author's username and profile information must not be displayed to other users for an anonymous post.
- The internal author information must remain available for account management and moderation purposes.
- Anonymous posts must use the same reply and discussion system as normal posts.

### Security and Privacy
- Users must log in before creating posts or replies.
- Users must not be able to modify another user's posts or replies.
- Anonymous posts must not expose the author's identity through the normal user interface.
- Private account information must not be included in AI summary requests unless it is necessary.
- API keys and other sensitive credentials must be stored on the server side.
- The application must prevent unauthorized access to private account information.

### Platform
- The application will be implemented as a mobile application.
- The application must provide screens for browsing posts, creating posts, viewing discussions, and viewing AI summaries.
- The application must provide controls for category selection and category filtering.
- The application must provide an Anonymous Post option during post creation.
- The interface must clearly identify AI-generated summaries.
- The main application workflows must work on the mobile platform or platforms selected by the team.
