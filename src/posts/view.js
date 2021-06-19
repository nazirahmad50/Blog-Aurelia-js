import { inject } from "aurelia-framework";
import { PostService } from "../common/services/post-service";
import { AuthService } from "../common/services/auth-service";
import { EventAggregator } from "aurelia-event-aggregator";
import { Router } from "aurelia-router";

@inject(PostService, AuthService, EventAggregator, Router)
export class View {
  constructor(PostService, AuthService, EventAggregator, Router) {
    this.postService = PostService;
    this.authService = AuthService;
    this.ea = EventAggregator;
    this.router = Router;
  }

  // lifecycle method that recieves params form the url
  activate(params) {
    this.error = "";
    this.postService
      .find(params.slug)
      .then((data) => {
        this.post = data.post;
      })
      .catch((err) => {
        this.ea.publish("toast", {
          type: "error",
          message: err.message,
        });
        this.router.navigateToRoute("home");
      });
  }
}
