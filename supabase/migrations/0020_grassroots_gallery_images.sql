-- Point gallery seed images at locally hosted grassroots photos (g1–g6, g8).
insert into public.gallery_images (id, url, alt, caption, sort_order) values
  (
    'gallery-1',
    '/images/grassroots/g1.png',
    'Indian schoolgirls sprinting barefoot during a rural sports day race',
    null,
    1
  ),
  (
    'gallery-2',
    '/images/grassroots/g2.png',
    'Indian girls celebrating together after winning a village race',
    null,
    2
  ),
  (
    'gallery-3',
    '/images/grassroots/g3.png',
    'Indian children practicing relay baton handoff with coach cheering on a village field',
    null,
    3
  ),
  (
    'gallery-4',
    '/images/grassroots/g4.png',
    'Indian children warming up together before village games at a rural school',
    null,
    4
  ),
  (
    'gallery-5',
    '/images/grassroots/g5.png',
    'Indian children playing kho-kho during a village sports day',
    null,
    5
  ),
  (
    'gallery-6',
    '/images/grassroots/g6.png',
    'Indian families cheering children at a village sports field',
    null,
    6
  ),
  (
    'gallery-8',
    '/images/grassroots/g8.png',
    'Indian children having fun in a wheelbarrow race at a school sports festival',
    null,
    8
  )
on conflict (id) do update
set
  url = excluded.url,
  alt = excluded.alt,
  caption = excluded.caption,
  sort_order = excluded.sort_order;
