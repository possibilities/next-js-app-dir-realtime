import React from 'react'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { createClient } from '@supabase/supabase-js'
import Posts from './posts'

export const dynamic = 'force-dynamic'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
)

const PostsPage = async () => {
  const posts = await supabase.from('posts').select('*')

  if (posts.error) {
    throw new Error('An unexpected error occurred fetching posts')
  }

  return <Posts posts={posts.data} />
}

export default PostsPage
