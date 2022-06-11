import sanityClient from '@sanity/client';
let client;
const config = {
  dataset: process.env.SANITY_STUDIO_API_DATASET || "production", //"donors",
  projectId: process.env.SANITY_STUDIO_API_PROJECT_ID || "xhr6l8cx",// "c9n9zdx2",
  useCdn: true,
  token: process.env.SANITY_API_TOKEN || "sknWekvgcpVfGThMo1jntOTis5fGMDwOck06wdYtMgIqXSLFFKTdhyoWoPl0citIZUhcBvCmiUZfor55G1HtehUsB07QKEMRwefczkBcDzfNBfRr7D42yLndag5QrFANTXiXmW9lziTrKg24PhTqsF08MvcNwZ0tR9gZIbCwvMpzqg7VRtAT",//"sknndi1EPg8jWeO1CZpUQ1MDrjlihU40lTHep2X3HpDFXPLdCrcw77nwaUsYHWNlN8VHdGWJ9VHszSssdxKPxLStpjJamzkCQa2JaB2OZh4IDT1ATUXVBVC8vEOKt5aB30CCT1UIAMYXCW6qQVqK0ritLTJUXG4yTnuUV5vI9ZA6rQUQX6Vv"
}
export default client = sanityClient(config)
