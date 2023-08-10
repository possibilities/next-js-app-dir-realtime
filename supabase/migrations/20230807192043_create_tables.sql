-- Posts

create table public.posts (
 id                 uuid default uuid_generate_v4() primary key,
 title              text not null,
 created_at         timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.posts enable row level security;

create policy "Allow public read access"
  on public.posts for select using ( true);
create policy "Allow public insert access"
  on public.posts for insert with check ( true);
create policy "Allow public update access"
  on public.posts for update using ( true);
create policy "Allow public delete access"
  on public.posts for delete using ( true);

-- Post comments

create table public.comments (
  id               uuid default uuid_generate_v4() primary key,
  comment          text not null,
  post_id  uuid references public.posts on delete cascade not null,
  created_at       timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.comments enable row level security;

create policy "Allow public read access"
  on public.comments for select using ( true);
create policy "Allow public insert access"
  on public.comments for insert with check ( true);
create policy "Allow public update access"
  on public.comments for update using ( true);
create policy "Allow public delete access"
  on public.comments for delete using ( true);

-- Enable realtime

begin;
  drop publication if exists supabase_realtime;
  create publication supabase_realtime;
commit;

alter table public.posts replica identity full;
alter publication supabase_realtime add table public.posts;

alter table public.comments replica identity full;
alter publication supabase_realtime add table public.comments;
