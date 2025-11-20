import { Route, Switch } from "wouter"
import Home from "./components/sections/Home"
import MultiStepFormSection from "./components/sections/MultiStepFormSection"
import CreateSection from "./components/sections/CreateSection"
function App() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/create" component={MultiStepFormSection} />
      <Route path="/canvas" component={CreateSection} />
    </Switch>
  )
}

export default App
