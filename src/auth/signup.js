import { inject } from "aurelia-framework";
import { EventAggregator } from "aurelia-event-aggregator";
import { Router } from "aurelia-router";
import { AuthService } from "../common/services/auth-service";

@inject(AuthService, EventAggregator, Router)
export class Signup {
  constructor(AuthService, EventAggregator, Router) {
    this.authService = AuthService;
    this.ea = EventAggregator;
    this.router = Router;
  }

  signup() {
    this.authService
      .signup(this.name)
      .then((data) => {
        this.ea.publish("user", data.name);
        this.ea.publish("toast", {
          type: "success",
          message: "you have successfully signed up",
        });
        this.router.navigateToRoute("home");
      })
      .catch((err) => {
        this.ea.publish("toast", {
          type: "error",
          message: err.message,
        });
      });
  }
}
