import { inject } from "aurelia-framework";
import { EventAggregator } from "aurelia-event-aggregator";
import { PostService } from "../common/services/post-service";
import { AuthService } from "../common/services/auth-service";
import { Router } from "aurelia-router";

@inject(PostService, AuthService, Router, EventAggregator)
export class Edit {
  constructor(PostService, AuthService, Router, EventAggregator) {
    this.postService = PostService;
    this.authService = AuthService;
    this.Router = Router;
    this.ea = EventAggregator;
  }

  activate(params) {
    this.postService
      .find(params.slug)
      .then((data) => {
        if (data.post.author !== this.authService.currentUser) {
          this.router.navigateToRoute("home");
        }
        this.post = data.post;
      })
      .catch((err) => {
        this.ea.publish("toast", {
          type: "error",
          message: err.message,
        });
        this.router.navigateToRoute("home");
      });

    this.title = "Edit Post";
  }

  editPost() {
    this.postService
      .update(this.post)
      .then((data) => {
        this.ea.publish("post-updated", Date());
        this.ea.publish("toast", {
          type: "success",
          message: "Post edited!",
        });
        this.Router.navigateToRoute("post-view", { slug: data.slug });
      })
      .catch((err) => {
        this.ea.publish("toast", {
          type: "error",
          message: err.message,
        });
      });
  }
}
