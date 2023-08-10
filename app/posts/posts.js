'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
)

const Posts = ({ posts: serverPosts }) => {
  const router = useRouter()
  const [posts, setPosts] = React.useState(serverPosts)

  React.useEffect(() => {
    setPosts(serverPosts)
  }, [serverPosts])

  React.useEffect(() => {
    const channel = supabase
      .channel('posts')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'posts',
        },
        insertedPost => setPosts(posts => [insertedPost.new, ...posts]),
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, serverPosts])

  return (
    <>
      <button
        onClick={async () => {
          const {
            data: { session },
          } = await supabase.auth.getSession()

          const { error } = await supabase
            .from('posts')
            .insert({ title: new Date().toISOString() })
        }}
      >
        add post
      </button>

      {posts.map(post => (
        <div key={post.id}>
          <button onClick={() => router.push(`/posts/${post.id}`)}>
            {post.title || 'UNTITLED POST'}
          </button>
        </div>
      ))}
    </>
  )
}

export default Posts
