import sanityClient from '@sanity/client';
let client;
const config = {
  dataset: process.env.NEXT_PUBLIC_SANITY_STUDIO_API_DATASET,
  projectId: process.env.NEXT_PUBLIC_SANITY_STUDIO_API_PROJECT_ID,
  useCdn: true,
  apiVersion: '2022-06-12',
  token: process.env.NEXT_PUBLIC_SANITY_API_TOKEN,
  ignoreBrowserTokenWarning: true,
}
export default client = sanityClient(config)
