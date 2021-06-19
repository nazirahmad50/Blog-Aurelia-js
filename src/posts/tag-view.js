import { inject } from "aurelia-framework";
import { PostService } from "../common/services/post-service";
import { EventAggregator } from "aurelia-event-aggregator";

@inject(PostService, EventAggregator)
export class TagView {
  constructor(PostService, EventAggregator) {
    this.postService = PostService;
    this.ea = EventAggregator;
  }

  activate(params) {
    this.tag = params.tag;
    this.postService
      .postsByTag(this.tag)
      .then((data) => {
        this.posts = data.posts;
      })
      .catch((err) => {
        this.ea.publish("toast", {
          type: "error",
          message: err.message,
        });
      });
  }
}
