import TopicPreview from "./TopicPreview";
import topics from "../Topics"

function Sidebar({activeTopic = null, className = null}) {
  return (
    <div className={className}>
      <aside className="flex flex-col items-stretch items-center">
        {topics.map(topic => (
          <TopicPreview topic={topic} activeTopic={activeTopic} key={topic.id} className="mb-3"/>
        ))}
      </aside>
    </div>
  )
}

export default Sidebar