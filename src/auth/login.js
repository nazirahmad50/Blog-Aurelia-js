import { inject } from "aurelia-framework";
import { EventAggregator } from "aurelia-event-aggregator";
import { Router } from "aurelia-router";
import { AuthService } from "../common/services/auth-service";

@inject(AuthService, Router, EventAggregator)
export class Login {
  constructor(AuthService, Router, EventAggregator) {
    this.ea = EventAggregator;
    this.router = Router;
    this.authService = AuthService;
  }

  login() {
    this.authService
      .login(this.name)
      .then((data) => {
        this.ea.publish("user", data.name);
        this.ea.publish("toast", {
          type: "success",
          message: "you have successfully logged in",
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
