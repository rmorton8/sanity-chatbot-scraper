import { createClient } from "@sanity/client";

import dotenv from "dotenv";

dotenv.config();

const sanityClient = createClient({
  useCdn: true,
  projectId: process.env.PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.PUBLIC_SANITY_DATASET,
  token: process.env.PUBLIC_SANITY_TOKEN,
  apiVersion: "2024-02-15"
});

// fields needed for search
const searchFragment = `
  title,
  _type,
  uri,
  body[]{
    ...,
    children[]{
      text,
      marks
    }
  }
`;
// const searchFragment = `
//   _id,
//   _type,
//   _createdAt,
//   'uri': uri.current,
//   title,
//   date,
//   metaTitle,
//   metaDescription,
//   metaImage {..., asset->},
//   listingImage,
//   listingTitle,
//   listingDescription,
//   entryTypes,
//   entryIndustries,
//   entryPartners,
//   entryProductsAndSolutions,
//   entryTags,
//   summary
// `;

// get content (case studies and articles)

// const getContent = `*[]`;
const getContent = `
*[_type in ["article"] && defined(uri) && (!defined(forceOmit) || !forceOmit)]{ ${searchFragment} }
`;

// const getContent = `
// *[_type in ["caseStudy", "article"] && defined(uri) && (!defined(forceOmit) || !forceOmit)]{ ${searchFragment} }
// `;

// get Non-tower pages (for search results page)
const getNonTowerPages = `
  *[_type in ["article", "partner", "industry", "caseStudy"] && defined(uri) && (!defined(forceOmit) || !forceOmit)]{ ${searchFragment} }
`;

// get towers that have the type 'pages'
// this omits things like privacy policy, etc pages from algolia
const getValidTowers = `
  *[_type == "tower" && "pages" in entryTypes[].value && (!defined(forceOmit) || !forceOmit)] { ${searchFragment} }
`;

// common fetch records method
const fetchRecords = async query => {
  const entries = await sanityClient.fetch(query);
  return entries;
};

const contentPages = await fetchRecords(getContent);

// contentPages.forEach(article => {
//   console.log(article.title, article.uri.current);
//   article.body.forEach(block => {
//     if (block._type === "block") {
//       // console.log(block.children);
//       block.children.forEach(child => {
//         console.log(child.text);
//       })
//     }
//   });
// });
console.log(contentPages);
