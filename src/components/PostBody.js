import {Link} from "react-router-dom";
import TimeAgo from "timeago-react";
import Linkify from "react-linkify";

function PostBody({user, post}) {
  return (
    <article className="flex flex-col align-top bg-white p-5 rounded-t shadow">
      <div className="flex items-center flex-shrink-0">
        <Link to={`/${user.username}`} className="block hover:opacity-80">
          <img src={user.photoURL} alt={user.username} className="w-12 h-12 rounded shadow-lg border"/>
        </Link>
        <div className="ml-3 flex flex-col">
          <Link to={`/${user.username}`} className="block font-bold leading-none text-gray-900 hover:underline">
            {user.displayName}
          </Link>

          <Link to={`/post/${post.id}`} className="mt-1 text-sm text-gray-600 hover:underline">
            <TimeAgo datetime={post.creationDate} locale="el"/>
          </Link>
        </div>
      </div>
      <div className="mt-3 whitespace-pre-line break-words text-gray-900">
        <Linkify componentDecorator={(decoratedHref, decoratedText, key) => (
          <a target="_blank"
             rel="noopener noreferrer"
             href={decoratedHref}
             key={key}
             className="text-blue-600 hover:underline">{decoratedText}
          </a>
        )}>{post.content}</Linkify>
      </div>
    </article>
  )
}

export default PostBody