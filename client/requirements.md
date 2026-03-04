## Packages
framer-motion | Essential for the Tinder-style card swiping animations and page transitions
recharts | Required for the data visualization (radar/bar charts) on the results page
clsx | Utility for conditional classes
tailwind-merge | Utility for merging tailwind classes

## Notes
- Game logic will store temporary results in localStorage to persist between Game and Results pages
- Admin dashboard requires authentication via an API key (x-admin-key header)
- Results page implements an "email gate" pattern before showing charts
