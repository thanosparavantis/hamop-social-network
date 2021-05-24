import {Link} from "react-router-dom";

function TopicPreview({topic, activeTopic, className = null}) {
  return (
    <div className={className}>
      <Link to={topic.path}
            className={`flex items-center p-3 font-bold shadow rounded hover:underline
                        ${topic === activeTopic ? "bg-blue-500 text-white" : "bg-white text-gray-900"}`}>
        <img src={require(`../images/topics/${topic.id}.png`).default}
             alt={topic.title}
             className="w-10 h-10 mr-3 object-contain"/>
        <div>{topic.title}</div>
      </Link>
    </div>
  )
}

export default TopicPreview