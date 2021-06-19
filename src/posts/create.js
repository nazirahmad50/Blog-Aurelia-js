import { inject } from "aurelia-framework";
import { EventAggregator } from "aurelia-event-aggregator";
import { PostService } from "../common/services/post-service";
import { Router } from "aurelia-router";

@inject(PostService, Router, EventAggregator)
export class Create {
  constructor(PostService, Router, EventAggregator) {
    this.postService = PostService;
    this.Router = Router;
    this.ea = EventAggregator;
  }

  attached() {
    this.post = {
      title: "",
      body: "",
      tags: [],
    };
    this.title = "Create Post";
  }

  createPost() {
    this.postService
      .create(this.post)
      .then((data) => {
        this.ea.publish("post-updated", Date());
        this.ea.publish("toast", {
          type: "success",
          message: "Post created!",
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
