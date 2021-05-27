import TopicPreview from "./TopicPreview";
import topics from "../Topics"

function Sidebar({activeTopic = null, className = null}) {
  return (
    <div className={className}>
      <aside className="sticky top-0 h-screen overflow-y-auto hide-scrollbar
                        pt-5 flex flex-col items-stretch items-center">
        {topics.map(topic => (
          <TopicPreview topic={topic} activeTopic={activeTopic} key={topic.id} className="mb-3"/>
        ))}
      </aside>
    </div>
  )
}

export default Sidebar