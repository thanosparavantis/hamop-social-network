import {Route, Switch} from "react-router-dom";
import TopicPage from "./pages/TopicPage";
import PostPage from "./pages/PostPage";
import ProfilePage from "./pages/ProfilePage";
import NotFoundPage from "./pages/NotFoundPage";
import topics from "./Topics"

function Routes() {
  return (
    <Switch>
      {topics.map(topic => (
        <Route path={topic.path} exact>
          <TopicPage topic={topic} key={topic.id}/>
        </Route>
      ))}
      <Route path="/post/:postId" exact>
        <PostPage/>
      </Route>
      <Route path="/:username" exact>
        <ProfilePage/>
      </Route>
      <Route path="*">
        <NotFoundPage/>
      </Route>
    </Switch>
  )
}

export default Routes