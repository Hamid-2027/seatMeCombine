import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Dashboard from "@/pages/dashboard";
import NotFound from "@/pages/not-found";
import BusDetailsPage from "@/pages/BusDetailsPage";
import ScheduleDetailsPage from "@/pages/ScheduleDetailsPage";
import CreateBusSchedule from "@/pages/CreateBusSchedule";
import SchedulesPage from "@/pages/Schedules";
import EditSchedulePage from "@/pages/EditSchedulePage";
import EditRoutePage from "@/pages/EditRoutePage";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";


function Router() {
  return (
    <Switch>
      <Route path="/schedules" component={SchedulesPage} />
      <Route path="/schedules/:id/edit" component={EditSchedulePage} />
      <Route path="/route/:id/edit" component={EditRoutePage} />
      <Route path="/create-schedule" component={CreateBusSchedule} />
      <Route path="/bus/:id" component={BusDetailsPage} />
      <Route path="/schedule/:id" component={ScheduleDetailsPage} />
      <Route path="/bus-management">
        <Dashboard section="bus-management" />
      </Route>
      <Route path="/route-management">
        <Dashboard section="route-management" />
      </Route>
      <Route path="/schedule-management">
        <Dashboard section="schedule-management" />
      </Route>
      <Route path="/seat-layouts">
        <Dashboard section="seat-layouts" />
      </Route>
      <Route path="/analytics">
        <Dashboard section="analytics" />
      </Route>

      <Route path="/dashboard">
        <Dashboard section="overview" />
      </Route>
      <Route path="/">
        <Dashboard section="overview" />
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}
const stripePromise = loadStripe("pk_test_51QtBl3JCOawnh7ZxEP6f10shKXZYwlSTQve3MmyYjOHTpthGGivL5Rov5LYLUndfuqEzeJ1F4OvQ2ZuKiMCHTSSW00wHuNYjTM");


function App() {
  return (
    <Elements stripe={stripePromise}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
    </Elements>
  );
}

export default App;
