import { Switch, Route } from "wouter";
import { LoomTV } from "@/components/LoomTV";
import NotFound from "@/pages/not-found";

function App() {
  return (
    <Switch>
      <Route path="/" component={LoomTV} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default App;
