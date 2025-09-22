# Deployment Notes

## Required Environment Variables

Vercel deployments for this project rely on the API configuration found in [`apps/api/.env.example`](apps/api/.env.example).
Set the following variables in the Vercel dashboard (or via `vercel env`) for the **Production**, **Preview**, and **Development** environments:

- `GEMINI_API_KEY` (required) – API key used by the AI sourcing coach endpoints when calling Google Gemini.
- `GEMINI_MODEL` (optional) – Model identifier passed to Gemini. Defaults to `gemini-2.5-flash-preview-05-20`; override when you need a different model version.

The repository's [`vercel.json`](vercel.json) is configured to expect secrets named `gemini_api_key` and `gemini_model`. Create or update the secrets and link them to each environment, for example:

```bash
vercel secrets add gemini_api_key <your-api-key>
vercel secrets add gemini_model gemini-2.5-flash-preview-05-20
vercel env add GEMINI_API_KEY production < gemini_api_key
vercel env add GEMINI_MODEL production < gemini_model
# repeat for preview and development as needed
```

After the variables are added, redeploy the project so the API functions can read the new configuration.
