'use client'

import React from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
)

const Post = ({ post: serverPost }) => {
  const [post, setPost] = React.useState(serverPost)

  React.useEffect(() => {
    setPost(serverPost)
  }, [serverPost])

  React.useEffect(() => {
    const channel = supabase
      .channel('posts')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'comments',
          filter: `post_id=eq.${post.id}`,
        },
        insertedComment =>
          setPost(post => ({
            ...post,
            comments: [insertedComment.new, ...post.comments],
          })),
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, setPost, post.id])

  return (
    <>
      <button
        onClick={async () => {
          await supabase.from('comments').insert({
            comment: new Date().toISOString(),
            post_id: post.id,
          })
        }}
      >
        add comment
      </button>
      <pre>{JSON.stringify({ post }, null, 2)}</pre>
    </>
  )
}

export default Post
