import React from 'react'
import { redirect, notFound } from 'next/navigation'
import { cookies } from 'next/headers'
import { createClient } from '@supabase/supabase-js'
import Post from './post'

export const dynamic = 'force-dynamic'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
)

const PostPage = async ({ params: { postId } }) => {
  const post = await supabase
    .from('posts')
    .select('*, comments(*)')
    .match({ id: postId })
    .order('created_at', {
      foreignTable: 'comments',
      ascending: false,
    })
    .single()

  if (!post.data) {
    notFound()
  } else if (post.error) {
    throw new Error('An unexpected error occurred fetching post')
  }

  return <Post post={post.data} />
}

export default PostPage
