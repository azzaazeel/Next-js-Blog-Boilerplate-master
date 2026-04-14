import fs from 'fs';
import { join } from 'path';

import matter from 'gray-matter';

export type PostItems = {
  [key: string]: string;
};

export function getPostSlugs(directory = '_articles') {
  const postsDirectory = join(/* turbopackIgnore: true */ process.cwd(), directory);
  if (!fs.existsSync(postsDirectory)) return [];
  return fs.readdirSync(postsDirectory);
}

export function getPostBySlug(
  slug: string,
  fields: string[] = [],
  directory = '_articles'
) {
  const postsDirectory = join(/* turbopackIgnore: true */ process.cwd(), directory);
  const realSlug = slug.replace(/\.md$/, '');
  const fullPath = join(postsDirectory, `${realSlug}.md`);
  if (!fs.existsSync(fullPath)) return {};
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);
  const items: PostItems = {};

  // Ensure only the minimal needed data is exposed
  fields.forEach((field) => {
    if (field === 'slug') {
      items[field] = realSlug;
    }
    if (field === 'content') {
      items[field] = content.replace(/@@baseUrl@@/g, process.env.baseUrl || '');
    }

    if (data[field] !== undefined && data[field] !== null) {
      // gray-matter parses date fields as JS Date objects — stringify to preserve sort
      items[field] =
        field === 'date' ? String(data[field]).split('T')[0] : data[field];
    } else if (!items[field]) {
      items[field] = ''; // Default to empty string instead of undefined
    }
  });

  return items;
}

export function getAllPosts(fields: string[] = [], directory = '_articles') {
  const slugs = getPostSlugs(directory);
  const posts = slugs
    .map((slug) => getPostBySlug(slug, fields, directory))
    // sort posts by date in descending order
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1));
  return posts;
}
