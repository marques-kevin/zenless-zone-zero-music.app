export type NewsEntry = {
  frontmatter: {
    published_at: string;
    title: string;
    description: string;
    language: string;
    commit_id?: string;
  };
  rawMarkdownBody: string;
};

